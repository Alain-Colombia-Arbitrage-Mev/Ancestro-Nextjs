/**
 * Lambda: ancestro-kyc-webhook
 * Dual-purpose:
 *   1. Recibir webhooks de MetaMap (con firma HMAC) → actualizar kyc_events + investor_profiles
 *   2. Recibir submissions del formulario de inversión (sin HMAC) → guardar en investment_requests
 *
 * API Gateway: ANY /kyc/webhook → esta Lambda
 * Diferenciación: si tiene header x-signature → MetaMap; si tiene campo "source":"invest-form" → formulario
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

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, x-signature, X-Signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

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

// ── Manejar formulario de inversión ──────────────────────────────
async function handleInvestForm(payload) {
  const {
    name, email, phone, amount, message,
    dateOfBirth, address, citizenship, investorType,
    accreditationCriteria, entityCriteria,
    sourceOfFunds, sourceOfFundsOther,
    isPep, pepDetails,
    isUsCitizen, usTaxId,
    declarationAccepted,
    signatureType, signatureData,
  } = payload;

  if (!name || !email || !amount) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Missing required fields: name, email, amount' }),
    };
  }

  // Determinar accreditation status
  let accreditationStatus = 'pending';
  if (isPep || isUsCitizen) accreditationStatus = 'requires_review';

  const client = await pool.connect();
  try {
    await client.query(
      `INSERT INTO investment_requests
        (investment_request, full_name, email, phone, investment_range_usd, message,
         date_of_birth, address, citizenship, investor_type,
         accreditation_criteria, entity_criteria,
         source_of_funds, source_of_funds_other,
         is_pep, pep_details,
         is_us_citizen, us_tax_id,
         declaration_accepted, accreditation_status,
         form_source, follow_up_status, assigned_to, submission_date, department_notified,
         signature_type, signature_data, signed_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,NOW(),$24,$25,$26,$27)`,
      [
        `${name} - ${amount} - ${new Date().toISOString().split('T')[0]}`,
        name, email, phone || '', amount, message || '',
        dateOfBirth || null, address || '', citizenship || '', investorType || 'individual',
        accreditationCriteria || [], entityCriteria || [],
        sourceOfFunds || '', sourceOfFundsOther || '',
        isPep || false, pepDetails || '',
        isUsCitizen || false, usTaxId || '',
        declarationAccepted || false, accreditationStatus,
        'invest-page', 'New', '', 'Investor Relations',
        signatureType || null, signatureData || null, signatureData ? new Date() : null,
      ]
    );

    console.log(`Investment request saved: ${email} - ${amount} - ${accreditationStatus}`);
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error('DB error (invest form):', err.message);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Internal error' }),
    };
  } finally {
    client.release();
  }
}

// ── Manejar webhook de MetaMap ───────────────────────────────────
async function handleMetaMapWebhook(payload) {
  const eventName = payload.eventName || 'unknown';
  const verificationId = payload.resource?.split('/').pop() || payload.id || null;
  const metadata = payload.metadata || {};
  const userId = metadata.userId || metadata.user_id || null;

  console.log(`Event: ${eventName} | Verification: ${verificationId} | User: ${userId}`);

  const client = await pool.connect();
  try {
    // Guardar en audit trail (SIEMPRE)
    await client.query(
      `INSERT INTO kyc_events (user_id, event_type, verification_id, status, raw_payload)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, eventName, verificationId, payload.status || null, payload]
    );

    // Actualizar investor_profiles en eventos de resultado
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

      await client.query(
        `INSERT INTO investor_profiles (user_id)
         VALUES ($1) ON CONFLICT (user_id) DO NOTHING`,
        [userId]
      );

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

    // Expiración
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
      headers: CORS_HEADERS,
      body: JSON.stringify({ received: true }),
    };
  } catch (err) {
    console.error('DB error (MetaMap):', err.message);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Internal error' }),
    };
  } finally {
    client.release();
  }
}

// ── Handler principal ────────────────────────────────────────────
export async function handler(event) {
  // CORS preflight
  if (event.requestContext?.http?.method === 'OPTIONS' || event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  // 1. Obtener body raw
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body;

  // 2. Parsear payload
  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Invalid JSON' }),
    };
  }

  // 3. Diferenciar: MetaMap (tiene x-signature) vs formulario de inversión (source: invest-form)
  const signature = event.headers?.['x-signature'] || event.headers?.['X-Signature'];

  if (signature) {
    // MetaMap webhook — validar HMAC
    console.log('MetaMap webhook received');
    if (!verifySignature(rawBody, signature)) {
      console.error('Invalid webhook signature');
      return {
        statusCode: 401,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Invalid signature' }),
      };
    }
    return handleMetaMapWebhook(payload);
  }

  if (payload.source === 'invest-form') {
    // Formulario de inversión
    console.log('Investment form received');
    return handleInvestForm(payload);
  }

  // Payload no reconocido
  return {
    statusCode: 400,
    headers: CORS_HEADERS,
    body: JSON.stringify({ error: 'Unknown request type' }),
  };
}
