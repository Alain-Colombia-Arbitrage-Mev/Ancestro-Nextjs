# MetaMap KYC + AML — Lambda + API Gateway Setup

## Arquitectura

```
Frontend (Next.js / Amplify)
    │
    ├── GET  /kyc/status   ──┐
    ├── POST /kyc/pending  ──┤
    ├── POST /kyc/aml      ──┤
    │                        ▼
    │                   API Gateway HTTP
    │                        │
    │                        ▼
    │                   1 sola Lambda
    │                   (ancestro-kyc-handler)
    │                        │
    │                        ▼
    │                   PostgreSQL (RDS)
    │
MetaMap (verificación KYC)
    │
    └── POST /kyc/webhook ──► API Gateway ──► misma Lambda
```

**1 Lambda, 4 rutas.** La Lambda rutea internamente por método + path.

---

## Paso 1: Preparar el ZIP de la Lambda

En tu máquina local:

```bash
cd lambda/kyc-handler
npm install
```

Crear el zip para subir a AWS:

```bash
zip -r function.zip index.mjs node_modules/ package.json
```

El archivo `function.zip` es lo que subes a Lambda.

---

## Paso 2: Crear la Lambda en AWS Console

1. Ve a **AWS Lambda** → **Create function**
2. **Author from scratch**
3. Configuración:

| Campo | Valor |
|-------|-------|
| Function name | `ancestro-kyc-handler` |
| Runtime | Node.js 20.x |
| Architecture | arm64 |
| Handler | `index.handler` |

4. Click **Create function**
5. En **Code** → **Upload from** → **.zip file** → sube `function.zip`

### Variables de entorno

Lambda → **Configuration** → **Environment variables** → **Edit**:

| Key | Valor |
|-----|-------|
| `DB_HOST` | `tu-rds-endpoint.xxxx.us-east-2.rds.amazonaws.com` |
| `DB_PORT` | `5432` |
| `DB_NAME` | `ancestro` |
| `DB_USER` | `tu_usuario` |
| `DB_PASSWORD` | `tu_password` |
| `METAMAP_WEBHOOK_SECRET` | `(se genera en Paso 4)` |

### VPC (para acceder a RDS)

Lambda → **Configuration** → **VPC** → **Edit**:

1. Selecciona la **misma VPC** donde está tu RDS
2. Selecciona las **subnets privadas** (donde está RDS)
3. Selecciona el **Security Group** que permite puerto 5432

### Timeout y memoria

Lambda → **Configuration** → **General configuration** → **Edit**:

| Campo | Valor |
|-------|-------|
| Memory | 256 MB |
| Timeout | 30 sec |

---

## Paso 3: Crear API Gateway HTTP

### 3.1 Crear la API

1. Ve a **API Gateway** → **Create API**
2. Selecciona **HTTP API** → **Build**
3. **API name**: `ancestro-kyc-api`
4. Click **Next** → **Next** → **Next** → **Create**

Se crea con stage `$default` y auto-deploy activado.

### 3.2 Crear las 4 rutas

Ve a **Routes** en el menú izquierdo. Crea cada ruta:

| # | Method | Path | Auth |
|---|--------|------|------|
| 1 | POST | `/kyc/webhook` | Ninguna (usa HMAC) |
| 2 | GET | `/kyc/status` | Cognito JWT |
| 3 | POST | `/kyc/pending` | Cognito JWT |
| 4 | POST | `/kyc/aml` | Cognito JWT |

Para cada ruta:
1. **Create** → selecciona method y path
2. Click en la ruta creada
3. **Attach integration** → **Create and attach an integration**
4. Integration type: **Lambda function**
5. Lambda function: **ancestro-kyc-handler** (la misma para todas)
6. Click **Create**

### 3.3 Crear Cognito Authorizer

1. Menú izquierdo → **Authorization** → **Manage authorizers**
2. **Create** authorizer:

| Campo | Valor |
|-------|-------|
| Name | `cognito-jwt` |
| Type | JWT |
| Identity source | `$request.header.Authorization` |
| Issuer URL | `https://cognito-idp.us-east-2.amazonaws.com/us-east-2_udv5vu` |
| Audience | `343ufcdf05skpoeasj3qnogjf0` |

3. Click **Create**

### 3.4 Aplicar authorizer a las rutas protegidas

1. Menú izquierdo → **Authorization** → **Attach authorizations to routes**
2. Para cada ruta (`GET /kyc/status`, `POST /kyc/pending`, `POST /kyc/aml`):
   - Click en la ruta
   - Selecciona el authorizer `cognito-jwt`
   - Click **Attach authorizer**
3. **NO** le pongas authorizer a `POST /kyc/webhook` (MetaMap no envía JWT, usa HMAC)

### 3.5 Configurar CORS

1. Menú izquierdo → **CORS**
2. Configurar:

| Campo | Valor |
|-------|-------|
| Access-Control-Allow-Origin | `*` (o tu dominio `https://ancestro.ai`) |
| Access-Control-Allow-Headers | `Content-Type, Authorization` |
| Access-Control-Allow-Methods | `GET, POST, OPTIONS` |

3. Click **Save**

### 3.6 Obtener la URL

Menú izquierdo → **Stages** → `$default` → copia la **Invoke URL**:

```
https://abc123xyz.execute-api.us-east-2.amazonaws.com
```

Tus endpoints quedan:
```
POST https://abc123xyz.execute-api.us-east-2.amazonaws.com/kyc/webhook
GET  https://abc123xyz.execute-api.us-east-2.amazonaws.com/kyc/status
POST https://abc123xyz.execute-api.us-east-2.amazonaws.com/kyc/pending
POST https://abc123xyz.execute-api.us-east-2.amazonaws.com/kyc/aml
```

---

## Paso 4: Configurar MetaMap Webhook

### 4.1 Generar el webhook secret

Crea un secret seguro (min 16 chars, mayúsculas, minúsculas, números):
```
AncestroKyc2026SecretKey!
```

### 4.2 Guardar el secret en la Lambda

Ve a Lambda → `ancestro-kyc-handler` → Environment variables:
- `METAMAP_WEBHOOK_SECRET` = `AncestroKyc2026SecretKey!`

### 4.3 Configurar en MetaMap Dashboard

1. Ve a **https://dashboard.metamap.com**
2. **Developers** → **Webhooks**
3. Click **Add webhook**
4. Configurar:

| Campo | Valor |
|-------|-------|
| URL | `https://abc123xyz.execute-api.us-east-2.amazonaws.com/kyc/webhook` |
| Secret | `AncestroKyc2026SecretKey!` (el mismo de la Lambda) |
| Events | `verification_completed`, `verification_updated`, `verification_expired` |

5. **Save**

### 4.4 IPs de MetaMap (whitelist)

Si tu Security Group o WAF filtra IPs, permite:
- `52.55.16.54`
- `52.5.135.13`
- `18.209.133.212`
- `52.7.73.154`

---

## Paso 5: Ejecutar migración en RDS

Conéctate a tu PostgreSQL y ejecuta `migration.sql`:

```bash
psql -h tu-rds-endpoint.rds.amazonaws.com -U tu_usuario -d ancestro -f migration.sql
```

O copia el contenido de `migration.sql` y ejecútalo en pgAdmin/DBeaver.

---

## Paso 6: Actualizar Frontend

En **AWS Amplify** → tu app → **Environment variables**, agrega o actualiza:

```
NEXT_PUBLIC_API_URL=https://abc123xyz.execute-api.us-east-2.amazonaws.com
```

Esto hace que el frontend envíe las requests de KYC/AML al API Gateway.

---

## Cómo funciona cada ruta

### POST /kyc/webhook (MetaMap → Lambda)

MetaMap envía eventos cuando un usuario completa la verificación:

```json
{
  "eventName": "verification_completed",
  "status": "verified",
  "metadata": { "userId": "uuid-del-usuario" },
  "resource": "https://api.getmati.com/v2/verifications/xxxx"
}
```

La Lambda:
1. Valida la firma HMAC-SHA256 del header `x-signature`
2. Guarda el evento en `kyc_events` (audit trail)
3. Actualiza `investor_profiles.kyc_status` a `verified` o `rejected`

### GET /kyc/status (Frontend → Lambda)

El frontend envía el JWT de Cognito en el header `Authorization`.
Retorna:

```json
{
  "status": "verified",
  "amlStatus": "not_started",
  "verificationId": "xxxx",
  "kycCompletedAt": "2026-03-14T..."
}
```

### POST /kyc/pending (Frontend → Lambda)

Llamada inmediatamente después de que el usuario completa el flujo de MetaMap SDK.
Marca `kyc_status = 'pending'` mientras MetaMap procesa.

### POST /kyc/aml (Frontend → Lambda)

Envía el cuestionario AML. La Lambda:
1. Verifica que KYC esté `verified`
2. Guarda todas las respuestas en `investor_profiles`
3. Si es PEP o US Citizen → `aml_status = 'flagged'` (revisión manual)
4. Si no → `aml_status = 'approved'`

---

## Probar el flujo completo

### Test 1: Webhook

```bash
curl -X POST https://abc123xyz.execute-api.us-east-2.amazonaws.com/kyc/webhook \
  -H "Content-Type: application/json" \
  -H "x-signature: test" \
  -d '{"eventName":"test"}'
```

Debe retornar `401` (firma inválida) — eso confirma que la Lambda funciona.

### Test 2: Status

```bash
curl https://abc123xyz.execute-api.us-east-2.amazonaws.com/kyc/status \
  -H "Authorization: Bearer TU_COGNITO_JWT_TOKEN"
```

Debe retornar `{"status":"not_started","amlStatus":"not_started"}`.

### Test 3: Flujo completo

1. Usuario abre `/invest` → ingresa contraseña del access gate
2. Click "Verificame" → MetaMap SDK se abre
3. Sube documento + selfie → MetaMap procesa
4. MetaMap envía webhook → Lambda actualiza `kyc_status = 'verified'`
5. Frontend poll detecta `verified` → muestra cuestionario AML
6. Usuario llena AML → POST `/kyc/aml` → Lambda guarda y aprueba/flaggea
7. Si aprobado → formulario de inversión se desbloquea

---

## Checklist

- [ ] Subir `function.zip` a Lambda `ancestro-kyc-handler`
- [ ] Configurar variables de entorno en Lambda (DB + METAMAP_WEBHOOK_SECRET)
- [ ] Configurar VPC + Security Group en Lambda
- [ ] Crear API Gateway HTTP con 4 rutas
- [ ] Crear Cognito JWT authorizer
- [ ] Aplicar authorizer a 3 rutas (NO al webhook)
- [ ] Configurar CORS
- [ ] Configurar webhook URL en MetaMap Dashboard
- [ ] Ejecutar `migration.sql` en RDS
- [ ] Actualizar `NEXT_PUBLIC_API_URL` en Amplify
- [ ] Test: curl al webhook (debe dar 401)
- [ ] Test: curl al status con JWT (debe dar 200)
- [ ] Test completo: MetaMap → webhook → DB → frontend
