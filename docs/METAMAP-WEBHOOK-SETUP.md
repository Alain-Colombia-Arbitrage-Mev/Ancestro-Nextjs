# MetaMap Webhook — Lambda + API Gateway

La única Lambda necesaria. Todo lo demás va por el backend Express.js en EC2.

## Arquitectura

```
MetaMap (verificación KYC)
    │
    └── POST /kyc/webhook ──► API Gateway ──► Lambda ──► RDS (investor_profiles)
```

## Setup

### 1. Crear Lambda

- **Name**: `ancestro-kyc-webhook`
- **Runtime**: Node.js 20.x
- **Handler**: `index.handler`
- **Code**: Subir zip de `lambda/kyc-handler/`
- **Timeout**: 30 sec
- **Memory**: 256 MB
- **VPC**: Misma VPC que RDS

```bash
cd lambda/kyc-handler && npm install && zip -r function.zip index.mjs node_modules/ package.json
```

### 2. Variables de entorno (Lambda)

| Key | Value |
|-----|-------|
| `DB_HOST` | `ancestro-back2.cyr0gak22eby.us-east-1.rds.amazonaws.com` |
| `DB_PORT` | `5432` |
| `DB_NAME` | `postgres` |
| `DB_USER` | `ancestro` |
| `DB_PASSWORD` | (tu password) |
| `METAMAP_WEBHOOK_SECRET` | (generar en MetaMap dashboard) |

### 3. API Gateway HTTP

- **Create API** → HTTP API → `ancestro-kyc-webhook-api`
- **Route**: `POST /kyc/webhook` → Lambda `ancestro-kyc-webhook`
- **Sin authorizer** (usa HMAC signature)
- **URL resultante**: `https://xxx.execute-api.us-east-2.amazonaws.com/kyc/webhook`

### 4. Configurar en MetaMap Dashboard

- **Developers** → **Webhooks** → **Add webhook**
- **URL**: La URL del API Gateway
- **Secret**: Min 16 chars (guardar en Lambda env vars)
- **Events**: `verification_completed`, `verification_updated`, `verification_expired`

### IPs de MetaMap (whitelist si aplica)

`52.55.16.54`, `52.5.135.13`, `18.209.133.212`, `52.7.73.154`

### Test

```bash
# Debe retornar 401 (firma inválida = Lambda funciona)
curl -X POST https://xxx.execute-api.us-east-2.amazonaws.com/kyc/webhook \
  -H "Content-Type: application/json" -d '{"test":true}'
```
