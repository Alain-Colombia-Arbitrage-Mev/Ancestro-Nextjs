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

const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
};

function respond(statusCode, body) {
  return { statusCode, headers: CORS, body: JSON.stringify(body) };
}

// ── Verificar firma HMAC-SHA256 ──────────────────────────────────
function verifySignature(rawBody, signature) {
  if (!signature || !WEBHOOK_SECRET) return false;
  const hash = createHmac('sha256', WEBHOOK_SECRET).update(rawBody).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
  } catch {
    return false;
  }
}

// ── Obtener userId desde Cognito JWT ─────────────────────────────
function getUserCognitoId(event) {
  return event.requestContext?.authorizer?.jwt?.claims?.sub
    || event.requestContext?.authorizer?.claims?.sub
    || null;
}

async function getUserId(client, cognitoId) {
  if (!cognitoId) return null;
  const result = await client.query('SELECT id FROM users WHERE cognito_id = $1', [cognitoId]);
  return result.rows[0]?.id || null;
}

// ══════════════════════════════════════════════════════════════════
// HANDLER PRINCIPAL — rutea por método + path
// ══════════════════════════════════════════════════════════════════
export async function handler(event) {
  const method = event.requestContext?.http?.method || event.httpMethod;
  const path = event.requestContext?.http?.path || event.path;

  console.log(`${method} ${path}`);

  // CORS preflight
  if (method === 'OPTIONS') {
    return respond(200, { ok: true });
  }

  // Ruteo
  if (method === 'POST' && path.endsWith('/kyc/webhook')) {
    return handleWebhook(event);
  }
  if (method === 'GET' && path.endsWith('/kyc/status')) {
    return handleStatus(event);
  }
  if (method === 'POST' && path.endsWith('/kyc/aml')) {
    return handleAml(event);
  }
  if (method === 'POST' && path.endsWith('/kyc/pending')) {
    return handlePending(event);
  }

  return respond(404, { error: 'Not found' });
}

// ══════════════════════════════════════════════════════════════════
// POST /kyc/webhook — MetaMap envia eventos de verificación
// Sin auth JWT — usa HMAC signature
// ══════════════════════════════════════════════════════════════════
async function handleWebhook(event) {
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body;

  const signature = event.headers?.['x-signature'] || event.headers?.['X-Signature'];

  if (!verifySignature(rawBody, signature)) {
    console.error('Invalid webhook signature');
    return respond(401, { error: 'Invalid signature' });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return respond(400, { error: 'Invalid JSON' });
  }

  const eventName = payload.eventName || 'unknown';
  const verificationId = payload.resource?.split('/').pop() || payload.id || null;
  const metadata = payload.metadata || {};
  const userId = metadata.userId || metadata.user_id || null;

  console.log(`Webhook: event=${eventName} verification=${verificationId} user=${userId}`);

  const client = await pool.connect();
  try {
    // Siempre guardar en audit trail
    await client.query(
      `INSERT INTO kyc_events (user_id, event_type, verification_id, status, raw_payload)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, eventName, verificationId, payload.status || null, payload]
    );

    // Actualizar profile en eventos relevantes
    if (userId && ['verification_completed', 'verification_updated'].includes(eventName)) {
      let kycStatus = 'pending';
      let kycVerified = false;

      if (payload.status === 'verified') {
        kycStatus = 'verified';
        kycVerified = true;
      } else if (['rejected', 'reviewNeeded'].includes(payload.status)) {
        kycStatus = 'rejected';
      }

      await client.query(
        `INSERT INTO investor_profiles (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING`,
        [userId]
      );

      await client.query(
        `UPDATE investor_profiles SET
          kyc_status = $1, kyc_verified = $2, kyc_verification_id = $3,
          kyc_completed_at = NOW(), kyc_metadata = $4
         WHERE user_id = $5`,
        [kycStatus, kycVerified, verificationId, payload, userId]
      );

      console.log(`KYC updated: user=${userId} status=${kycStatus}`);
    }

    if (eventName === 'verification_expired' && userId) {
      await client.query(
        `UPDATE investor_profiles SET kyc_status = 'rejected'
         WHERE user_id = $1 AND kyc_status = 'pending'`,
        [userId]
      );
    }

    return respond(200, { received: true });
  } catch (err) {
    console.error('Webhook DB error:', err.message);
    return respond(500, { error: 'Internal error' });
  } finally {
    client.release();
  }
}

// ══════════════════════════════════════════════════════════════════
// GET /kyc/status — Retorna KYC + AML status del usuario
// Auth: Cognito JWT
// ══════════════════════════════════════════════════════════════════
async function handleStatus(event) {
  const cognitoId = getUserCognitoId(event);
  if (!cognitoId) return respond(401, { error: 'Unauthorized' });

  const client = await pool.connect();
  try {
    const userId = await getUserId(client, cognitoId);
    if (!userId) return respond(200, { status: 'not_started', amlStatus: 'not_started' });

    const result = await client.query(
      `SELECT kyc_status, aml_status, kyc_verification_id, kyc_completed_at, aml_completed_at
       FROM investor_profiles WHERE user_id = $1`,
      [userId]
    );

    if (!result.rows.length) {
      return respond(200, { status: 'not_started', amlStatus: 'not_started' });
    }

    const p = result.rows[0];
    return respond(200, {
      status: p.kyc_status,
      amlStatus: p.aml_status,
      verificationId: p.kyc_verification_id,
      kycCompletedAt: p.kyc_completed_at,
      amlCompletedAt: p.aml_completed_at,
    });
  } finally {
    client.release();
  }
}

// ══════════════════════════════════════════════════════════════════
// POST /kyc/pending — Frontend marca KYC como pending tras MetaMap SDK
// Auth: Cognito JWT
// ══════════════════════════════════════════════════════════════════
async function handlePending(event) {
  const cognitoId = getUserCognitoId(event);
  if (!cognitoId) return respond(401, { error: 'Unauthorized' });

  const client = await pool.connect();
  try {
    const userId = await getUserId(client, cognitoId);
    if (!userId) return respond(404, { error: 'User not found' });

    await client.query(
      `INSERT INTO investor_profiles (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING`,
      [userId]
    );

    await client.query(
      `UPDATE investor_profiles SET kyc_status = 'pending'
       WHERE user_id = $1 AND kyc_status != 'verified'`,
      [userId]
    );

    return respond(200, { success: true });
  } finally {
    client.release();
  }
}

// ══════════════════════════════════════════════════════════════════
// POST /kyc/aml — Guarda cuestionario AML
// Auth: Cognito JWT
// ══════════════════════════════════════════════════════════════════
async function handleAml(event) {
  const cognitoId = getUserCognitoId(event);
  if (!cognitoId) return respond(401, { error: 'Unauthorized' });

  const body = JSON.parse(event.body || '{}');

  if (!body.acceptedDeclaration) {
    return respond(400, { error: 'Declaration required' });
  }

  const client = await pool.connect();
  try {
    const userId = await getUserId(client, cognitoId);
    if (!userId) return respond(404, { error: 'User not found' });

    // Verificar KYC completado
    const profile = await client.query(
      'SELECT kyc_status FROM investor_profiles WHERE user_id = $1',
      [userId]
    );

    if (!profile.rows.length || profile.rows[0].kyc_status !== 'verified') {
      return respond(400, { error: 'KYC must be verified first' });
    }

    // PEP o US Citizen → flagged para revisión manual
    const flagged = body.isPep || body.isUsCitizen;
    const amlStatus = flagged ? 'flagged' : 'approved';

    await client.query(
      `UPDATE investor_profiles SET
        aml_status = $1, aml_completed_at = NOW(),
        aml_source_of_funds = $2, aml_source_other = $3,
        aml_net_worth = $4, aml_annual_income = $5,
        aml_is_pep = $6, aml_pep_details = $7,
        aml_is_us_citizen = $8, aml_us_tax_id = $9,
        aml_tax_country = $10, aml_occupation = $11,
        aml_employer = $12, aml_investment_purpose = $13,
        aml_declaration_accepted = $14
       WHERE user_id = $15`,
      [
        amlStatus,
        body.sourceOfFunds, body.sourceOfFundsOther || null,
        body.estimatedNetWorth, body.annualIncome,
        body.isPep || false, body.pepDetails || null,
        body.isUsCitizen || false, body.usTaxId || null,
        body.countryOfTaxResidence, body.occupation,
        body.employer || null, body.investmentPurpose,
        true, userId,
      ]
    );

    // Audit log
    await client.query(
      `INSERT INTO kyc_events (user_id, event_type, status, raw_payload)
       VALUES ($1, 'aml_submitted', $2, $3)`,
      [userId, amlStatus, body]
    );

    console.log(`AML ${amlStatus}: user=${userId} pep=${body.isPep} us=${body.isUsCitizen}`);

    return respond(200, { success: true, amlStatus });
  } finally {
    client.release();
  }
}
