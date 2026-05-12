import type { NextRequest } from 'next/server';
import { query } from './db';

const COOKIE_NAME = 'ancestro_ref';

export function readRefCookie(req: NextRequest): string | null {
  const raw = req.cookies.get(COOKIE_NAME)?.value;
  return raw ? decodeURIComponent(raw) : null;
}

interface ConvertOptions {
  /** Email of the referred user (required for dedupe) */
  email: string;
  /** Optional order amount; if absent, commission row is created with amount=0 (just signup credit) */
  amount?: number;
  /** Override commission role (default 'affiliate'; could be 'customer' for customer-to-customer refs) */
  role?: 'affiliate' | 'customer' | 'epc';
  /** Optional explicit code (skips cookie read — used for server-side calls with known attribution) */
  code?: string;
}

export interface ConvertResult {
  credited: boolean;
  reason?: 'no_cookie' | 'invalid_code' | 'duplicate' | 'error';
  commission_pct?: number;
  amount?: number;
  referrer_code?: string;
}

/**
 * Credit a referral conversion if the user arrived via a tracked link.
 * Idempotent per (referrer_code, referred_email) — safe to call from any signup/order endpoint.
 */
export async function recordReferralConversion(
  req: NextRequest,
  opts: ConvertOptions
): Promise<ConvertResult> {
  const code = opts.code ?? readRefCookie(req);
  if (!code) return { credited: false, reason: 'no_cookie' };
  if (!opts.email) return { credited: false, reason: 'error' };

  try {
    const link = await query('SELECT code FROM referral_links WHERE code = $1', [code]);
    if (!link.rows.length) return { credited: false, reason: 'invalid_code' };

    const role = opts.role || 'affiliate';
    const cs = await query('SELECT percentage FROM commission_settings WHERE role = $1', [role]);
    const pct = Number(cs.rows[0]?.percentage) || 15;
    const amount = Number(opts.amount) || 0;

    // Dedupe per (referrer_code, referred_email).
    //  - First call (typically a signup with amount=0): creates a pending row + bumps signups.
    //  - Subsequent call with a higher amount (e.g. install completion): upgrades the existing
    //    row's amount instead of creating a duplicate. Returns credited=true on upgrade.
    const dup = await query(
      'SELECT id, amount FROM referral_commissions WHERE referrer_code = $1 AND referred_email = $2 LIMIT 1',
      [code, opts.email]
    );
    if (dup.rows.length) {
      const existingAmount = Number(dup.rows[0].amount) || 0;
      if (amount > existingAmount) {
        await query(
          `UPDATE referral_commissions
           SET amount = $1, commission_percent = $2, status = 'pending'
           WHERE id = $3`,
          [amount, pct, dup.rows[0].id]
        );
        return { credited: true, commission_pct: pct, amount, referrer_code: code };
      }
      return { credited: false, reason: 'duplicate', referrer_code: code };
    }

    await query('UPDATE referral_links SET signups = signups + 1 WHERE code = $1', [code]);
    await query(
      `INSERT INTO referral_commissions (referrer_code, referred_email, amount, commission_percent, status)
       VALUES ($1, $2, $3, $4, $5)`,
      [code, opts.email, amount, pct, 'pending']
    );

    return { credited: true, commission_pct: pct, amount, referrer_code: code };
  } catch (e) {
    console.error('[recordReferralConversion]', e);
    return { credited: false, reason: 'error' };
  }
}
