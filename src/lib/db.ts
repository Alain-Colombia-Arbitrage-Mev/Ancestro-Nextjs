import pg from 'pg';

const { Pool } = pg;

let pool: pg.Pool | null = null;

export class DBNotConfiguredError extends Error {
  constructor() {
    super('[DB] DB_HOST env var is missing — database is not configured');
    this.name = 'DBNotConfiguredError';
  }
}

export function getPool(): pg.Pool {
  if (!process.env.DB_HOST) {
    throw new DBNotConfiguredError();
  }

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
      statement_timeout: 8000,
      query_timeout: 8000,
    });
  }

  return pool;
}

export async function query(text: string, params?: unknown[]): Promise<pg.QueryResult> {
  const p = getPool();
  const client = await p.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}
