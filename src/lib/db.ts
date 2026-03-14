import pg from 'pg';

const { Pool } = pg;

let pool: pg.Pool | null = null;

export function getPool(): pg.Pool | null {
  if (!process.env.DB_HOST) return null;

  if (!pool) {
    pool = new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }

  return pool;
}

export async function query(text: string, params?: unknown[]): Promise<pg.QueryResult | null> {
  const p = getPool();
  if (!p) {
    console.warn('[DB] No database configured, skipping query');
    return null;
  }

  const client = await p.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}
