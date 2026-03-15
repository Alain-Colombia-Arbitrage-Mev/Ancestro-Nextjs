/**
 * Lambda: ancestro-kyc-webhook
 * Única función: recibir webhooks de MetaMap y actualizar RDS.
 * Todo lo demás (status, pending, AML) lo maneja el backend Express.js en EC2.
 *
 * API Gateway: POST /kyc/webhook → esta Lambda
 */

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
  max: 3,
});

const WEBHOOK_SECRET = process.env.METAMAP_WEBHOOK_SECRET;

// ── Verificar firma HMAC-SHA256 de MetaMap ───────────────────────
function verifySignature(rawBody, signature) {
  if (!signature || !WEBHOOK_SECRET) return false;
  const hash = createHmac('sha256', WEBHOOK_SECRET).update(rawBody).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
  } catch {
    return false;
  }
}

// ── Handler ──────────────────────────────────────────────────────
export async function handler(event) {
  console.log('MetaMap webhook received');

  // 1. Obtener body raw
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body;

  // 2. Validar firma HMAC
  const signature = event.headers?.['x-signature'] || event.headers?.['X-Signature'];

  if (!verifySignature(rawBody, signature)) {
    console.error('Invalid webhook signature');
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid signature' }),
    };
  }

  // 3. Parsear payload
  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON' }),
    };
  }

  const eventName = payload.eventName || 'unknown';
  const verificationId = payload.resource?.split('/').pop() || payload.id || null;
  const metadata = payload.metadata || {};
  const userId = metadata.userId || metadata.user_id || null;

  console.log(`Event: ${eventName} | Verification: ${verificationId} | User: ${userId}`);

  const client = await pool.connect();
  try {
    // 4. Guardar en audit trail (SIEMPRE, para cualquier evento)
    await client.query(
      `INSERT INTO kyc_events (user_id, event_type, verification_id, status, raw_payload)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, eventName, verificationId, payload.status || null, payload]
    );

    // 5. Actualizar investor_profiles solo en eventos de resultado
    if (userId && ['verification_completed', 'verification_updated'].includes(eventName)) {
      let kycStatus = 'pending';
      let kycVerified = false;

      if (payload.status === 'verified') {
        kycStatus = 'verified';
        kycVerified = true;
      } else if (['rejected', 'reviewNeeded'].includes(payload.status)) {
        kycStatus = 'rejected';
        kycVerified = false;
      }

      // Crear profile si no existe
      await client.query(
        `INSERT INTO investor_profiles (user_id)
         VALUES ($1) ON CONFLICT (user_id) DO NOTHING`,
        [userId]
      );

      // Actualizar KYC status
      await client.query(
        `UPDATE investor_profiles SET
          kyc_status = $1,
          kyc_verified = $2,
          kyc_verification_id = $3,
          kyc_completed_at = NOW(),
          kyc_metadata = $4
         WHERE user_id = $5`,
        [kycStatus, kycVerified, verificationId, payload, userId]
      );

      console.log(`KYC updated: user=${userId} status=${kycStatus}`);
    }

    // 6. Expiración
    if (eventName === 'verification_expired' && userId) {
      await client.query(
        `UPDATE investor_profiles SET kyc_status = 'rejected'
         WHERE user_id = $1 AND kyc_status = 'pending'`,
        [userId]
      );
      console.log(`KYC expired: user=${userId}`);
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ received: true }),
    };
  } catch (err) {
    console.error('DB error:', err.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal error' }),
    };
  } finally {
    client.release();
  }
}
