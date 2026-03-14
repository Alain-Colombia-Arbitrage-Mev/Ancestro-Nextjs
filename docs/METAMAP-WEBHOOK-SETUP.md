# MetaMap Webhook + AWS Lambda Setup Guide

## Arquitectura

```
MetaMap (verificación KYC)
    │
    ▼  POST webhook con payload + x-signature header
API Gateway (https://xxxxx.execute-api.us-east-2.amazonaws.com/prod/kyc/webhook)
    │
    ▼
Lambda Function (kyc-webhook-handler)
    │
    ▼  Valida HMAC-SHA256 → Actualiza DB
PostgreSQL (RDS) → investor_profiles + kyc_events
```

---

## Paso 1: Crear la Lambda Function

### 1.1 Crear la función en AWS Console

1. Ve a **AWS Lambda** → **Create function**
2. **Function name**: `ancestro-kyc-webhook`
3. **Runtime**: Node.js 20.x
4. **Architecture**: arm64 (más barato)
5. Click **Create function**

### 1.2 Configurar variables de entorno

En la Lambda → **Configuration** → **Environment variables**:

| Key | Value |
|-----|-------|
| `METAMAP_WEBHOOK_SECRET` | (tu secret de MetaMap, min 16 chars) |
| `DB_HOST` | tu-rds-endpoint.rds.amazonaws.com |
| `DB_PORT` | 5432 |
| `DB_NAME` | ancestro |
| `DB_USER` | tu_usuario |
| `DB_PASSWORD` | tu_password |

### 1.3 Código de la Lambda

Crea un archivo `index.mjs` con este código:

```javascript
import { createHmac, timingSafeEqual } from 'crypto';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
  max: 5,
});

const WEBHOOK_SECRET = process.env.METAMAP_WEBHOOK_SECRET;

// ── Verificar firma HMAC-SHA256 ──────────────────────────────────
function verifySignature(rawBody, signature) {
  if (!signature || !WEBHOOK_SECRET) return false;

  const hash = createHmac('sha256', WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');

  try {
    return timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
  } catch {
    return false;
  }
}

// ── Handler principal ────────────────────────────────────────────
export async function handler(event) {
  console.log('Webhook received:', event.headers?.['x-signature'] ? 'signed' : 'unsigned');

  // 1. Obtener body raw y signature
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body;

  const signature = event.headers?.['x-signature'] || event.headers?.['X-Signature'];

  // 2. Validar firma
  if (!verifySignature(rawBody, signature)) {
    console.error('Invalid webhook signature');
    return { statusCode: 401, body: JSON.stringify({ error: 'Invalid signature' }) };
  }

  // 3. Parsear payload
  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const eventName = payload.eventName || 'unknown';
  const verificationId = payload.resource?.split('/').pop() || payload.id || null;
  const metadata = payload.metadata || {};
  const userId = metadata.userId || metadata.user_id || null;

  console.log(`Event: ${eventName}, VerificationId: ${verificationId}, UserId: ${userId}`);

  const client = await pool.connect();

  try {
    // 4. Guardar evento en audit trail (SIEMPRE)
    await client.query(
      `INSERT INTO kyc_events (user_id, event_type, verification_id, status, raw_payload)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, eventName, verificationId, payload.status || null, payload]
    );

    // 5. Actualizar investor_profiles solo en eventos relevantes
    if (userId && ['verification_completed', 'verification_updated'].includes(eventName)) {

      // Obtener detalles de la verificación via MetaMap API
      let kycStatus = 'pending';
      let kycVerified = false;

      // MetaMap envía el status en el payload o necesitas hacer GET al resource
      // Los status posibles: verified, rejected, reviewNeeded
      if (payload.status === 'verified') {
        kycStatus = 'verified';
        kycVerified = true;
      } else if (['rejected', 'reviewNeeded'].includes(payload.status)) {
        kycStatus = 'rejected';
        kycVerified = false;
      }

      // Crear investor_profile si no existe
      await client.query(
        `INSERT INTO investor_profiles (user_id)
         VALUES ($1)
         ON CONFLICT (user_id) DO NOTHING`,
        [userId]
      );

      // Actualizar KYC status
      await client.query(
        `UPDATE investor_profiles
         SET kyc_status = $1,
             kyc_verified = $2,
             kyc_verification_id = $3,
             kyc_completed_at = NOW(),
             kyc_metadata = $4
         WHERE user_id = $5`,
        [kycStatus, kycVerified, verificationId, payload, userId]
      );

      console.log(`KYC updated: userId=${userId} status=${kycStatus}`);
    }

    if (eventName === 'verification_expired' && userId) {
      await client.query(
        `UPDATE investor_profiles
         SET kyc_status = 'rejected'
         WHERE user_id = $1 AND kyc_status = 'pending'`,
        [userId]
      );
      console.log(`KYC expired for userId=${userId}`);
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };

  } catch (err) {
    console.error('DB error:', err.message);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal error' }) };
  } finally {
    client.release();
  }
}
```

### 1.4 Agregar dependencia pg

En la Lambda, crea un **Layer** o sube un zip con `node_modules`:

```bash
mkdir lambda-kyc && cd lambda-kyc
npm init -y
npm install pg
cp index.mjs .
zip -r function.zip index.mjs node_modules/
```

Sube `function.zip` a la Lambda.

### 1.5 Configurar VPC (para acceder a RDS)

1. Lambda → **Configuration** → **VPC**
2. Selecciona la misma VPC donde está tu RDS
3. Selecciona las subnets privadas
4. Selecciona el Security Group que permite acceso al RDS (puerto 5432)

### 1.6 Timeout y memoria

- **Timeout**: 30 segundos
- **Memory**: 256 MB

---

## Paso 2: Crear API Gateway

### 2.1 Crear la API

1. Ve a **API Gateway** → **Create API**
2. Selecciona **HTTP API** (más simple y barato)
3. **API name**: `ancestro-kyc-api`

### 2.2 Crear la ruta

1. **Routes** → **Create**
2. **Method**: POST
3. **Path**: `/kyc/webhook`
4. **Integration**: Lambda → `ancestro-kyc-webhook`

### 2.3 Deploy

1. **Deploy** → Stage `prod`
2. Copia la URL. Será algo como:

```
https://abc123xyz.execute-api.us-east-2.amazonaws.com/prod/kyc/webhook
```

**Esta es la URL que necesitas para MetaMap.**

---

## Paso 3: Configurar MetaMap Webhook

### 3.1 En el Dashboard de MetaMap

1. Ve a **MetaMap Dashboard** → **Developers** → **Webhooks**
2. Click **Add webhook**
3. **URL**: Pega la URL de API Gateway:
   ```
   https://abc123xyz.execute-api.us-east-2.amazonaws.com/prod/kyc/webhook
   ```
4. **Secret**: Genera un secret (min 16 chars, mayúsculas, minúsculas, números)
   - Ejemplo: `AncestroKyc2026Secret!`
   - **Copia este secret** → ponlo en la Lambda como `METAMAP_WEBHOOK_SECRET`
5. **Events**: Selecciona todos o al menos:
   - `verification_completed`
   - `verification_updated`
   - `verification_expired`
6. **Save**

### 3.2 IPs de MetaMap (whitelist si usas WAF)

Si tienes WAF o Security Groups restrictivos, permite estas IPs:
- `52.55.16.54`
- `52.5.135.13`
- `18.209.133.212`
- `52.7.73.154`

---

## Paso 4: Crear Lambda para KYC Status (GET)

Tu frontend llama `GET /api/kyc/status`. Crea otra Lambda:

### 4.1 Función `ancestro-kyc-status`

```javascript
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
  max: 5,
});

export async function handler(event) {
  // Extraer userId del JWT de Cognito (viene en el authorizer)
  const claims = event.requestContext?.authorizer?.jwt?.claims
    || event.requestContext?.authorizer?.claims;

  if (!claims?.sub) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  const cognitoId = claims.sub;

  const client = await pool.connect();
  try {
    // Buscar usuario por cognito_id
    const userResult = await client.query(
      'SELECT id FROM users WHERE cognito_id = $1', [cognitoId]
    );

    if (userResult.rows.length === 0) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ status: 'not_started' }),
      };
    }

    const userId = userResult.rows[0].id;

    const profileResult = await client.query(
      `SELECT kyc_status, aml_status, kyc_verification_id, kyc_completed_at, aml_completed_at
       FROM investor_profiles WHERE user_id = $1`, [userId]
    );

    if (profileResult.rows.length === 0) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ status: 'not_started' }),
      };
    }

    const profile = profileResult.rows[0];

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        status: profile.kyc_status,
        amlStatus: profile.aml_status,
        verificationId: profile.kyc_verification_id,
        kycCompletedAt: profile.kyc_completed_at,
        amlCompletedAt: profile.aml_completed_at,
      }),
    };
  } finally {
    client.release();
  }
}
```

### 4.2 Agregar ruta en API Gateway

1. **Routes** → **Create**
2. **Method**: GET
3. **Path**: `/kyc/status`
4. **Integration**: Lambda → `ancestro-kyc-status`
5. **Authorization**: Cognito JWT Authorizer

### 4.3 Crear Cognito Authorizer

1. API Gateway → **Authorization** → **Create authorizer**
2. **Type**: JWT
3. **Identity source**: `$request.header.Authorization`
4. **Issuer URL**: `https://cognito-idp.us-east-2.amazonaws.com/us-east-2_udv5vu`
5. **Audience**: `343ufcdf05skpoeasj3qnogjf0`
6. Aplica este authorizer a la ruta `GET /kyc/status`

---

## Paso 5: Crear Lambda para AML Submit (POST)

### 5.1 Función `ancestro-kyc-aml`

```javascript
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
  max: 5,
});

export async function handler(event) {
  const claims = event.requestContext?.authorizer?.jwt?.claims
    || event.requestContext?.authorizer?.claims;

  if (!claims?.sub) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  const cognitoId = claims.sub;
  const body = JSON.parse(event.body || '{}');

  if (!body.declarationAccepted) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Declaration required' }) };
  }

  const client = await pool.connect();
  try {
    const userResult = await client.query(
      'SELECT id FROM users WHERE cognito_id = $1', [cognitoId]
    );

    if (userResult.rows.length === 0) {
      return { statusCode: 404, body: JSON.stringify({ error: 'User not found' }) };
    }

    const userId = userResult.rows[0].id;

    // Verificar que KYC esté completado primero
    const profileResult = await client.query(
      'SELECT kyc_status FROM investor_profiles WHERE user_id = $1', [userId]
    );

    if (!profileResult.rows.length || profileResult.rows[0].kyc_status !== 'verified') {
      return { statusCode: 400, body: JSON.stringify({ error: 'KYC must be verified first' }) };
    }

    // PEP o US Citizen = flagged para revisión manual
    const flagged = body.isPep || body.isUsCitizen;
    const amlStatus = flagged ? 'flagged' : 'approved';

    await client.query(
      `UPDATE investor_profiles SET
        aml_status = $1,
        aml_completed_at = NOW(),
        aml_source_of_funds = $2,
        aml_source_other = $3,
        aml_net_worth = $4,
        aml_annual_income = $5,
        aml_is_pep = $6,
        aml_pep_details = $7,
        aml_is_us_citizen = $8,
        aml_us_tax_id = $9,
        aml_tax_country = $10,
        aml_occupation = $11,
        aml_employer = $12,
        aml_investment_purpose = $13,
        aml_declaration_accepted = $14
       WHERE user_id = $15`,
      [
        amlStatus,
        body.sourceOfFunds, body.sourceOfFundsOther || null,
        body.estimatedNetWorth, body.annualIncome,
        body.isPep, body.pepDetails || null,
        body.isUsCitizen, body.usTaxId || null,
        body.countryOfTaxResidence, body.occupation, body.employer || null,
        body.investmentPurpose, true,
        userId,
      ]
    );

    // Audit log
    await client.query(
      `INSERT INTO kyc_events (user_id, event_type, status, raw_payload)
       VALUES ($1, 'aml_submitted', $2, $3)`,
      [userId, amlStatus, body]
    );

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true, amlStatus }),
    };
  } finally {
    client.release();
  }
}
```

### 5.2 Agregar ruta en API Gateway

- **Method**: POST
- **Path**: `/kyc/aml`
- **Integration**: Lambda → `ancestro-kyc-aml`
- **Authorization**: Cognito JWT Authorizer (mismo del paso 4.3)

---

## Paso 6: Actualizar Frontend

En tu `.env.local` actualiza la API URL al API Gateway:

```
NEXT_PUBLIC_API_URL=https://abc123xyz.execute-api.us-east-2.amazonaws.com/prod
```

---

## Resumen de URLs

| Recurso | URL |
|---------|-----|
| Webhook (MetaMap → Lambda) | `https://xxx.execute-api.us-east-2.amazonaws.com/prod/kyc/webhook` |
| KYC Status (Frontend → Lambda) | `https://xxx.execute-api.us-east-2.amazonaws.com/prod/kyc/status` |
| AML Submit (Frontend → Lambda) | `https://xxx.execute-api.us-east-2.amazonaws.com/prod/kyc/aml` |

## Resumen de Lambdas

| Lambda | Trigger | Auth | Función |
|--------|---------|------|---------|
| `ancestro-kyc-webhook` | API Gateway POST | HMAC signature | Recibe eventos MetaMap |
| `ancestro-kyc-status` | API Gateway GET | Cognito JWT | Retorna KYC+AML status |
| `ancestro-kyc-aml` | API Gateway POST | Cognito JWT | Guarda cuestionario AML |

## Checklist

- [ ] Crear 3 Lambdas con el código de arriba
- [ ] Configurar VPC + Security Groups para acceso a RDS
- [ ] Crear API Gateway HTTP con 3 rutas
- [ ] Crear Cognito JWT Authorizer
- [ ] Configurar webhook URL en MetaMap Dashboard
- [ ] Generar webhook secret y guardarlo en Lambda env vars
- [ ] Ejecutar `migration.sql` en RDS
- [ ] Actualizar `NEXT_PUBLIC_API_URL` en Amplify
- [ ] Probar: crear verificación → recibir webhook → verificar DB
