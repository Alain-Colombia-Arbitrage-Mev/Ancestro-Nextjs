import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

function tierFor(revenue: number): string {
  if (revenue >= 10000) return 'Platinum';
  if (revenue >= 2500) return 'Gold';
  if (revenue >= 500) return 'Silver';
  return 'Bronze';
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('user_id');
  if (!userId) return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });

  try {
    const link = await query(
      'SELECT code, clicks, signups, channel, zip, onboarded_at FROM referral_links WHERE user_id = $1',
      [userId]
    );
    if (!link.rows.length) {
      return NextResponse.json({
        code: null, clicks: 0, signups: 0, conversion: 0,
        commission_total: 0, commission_pending: 0, commission_paid: 0,
        tier: 'Bronze', onboarded: false, channel: null, zip: null,
      });
    }
    const row = link.rows[0];

    const c = await query(
      `SELECT
         COALESCE(SUM(amount * commission_percent / 100.0), 0)::float AS total,
         COALESCE(SUM(CASE WHEN status = 'pending' THEN amount * commission_percent / 100.0 ELSE 0 END), 0)::float AS pending,
         COALESCE(SUM(CASE WHEN status = 'paid'    THEN amount * commission_percent / 100.0 ELSE 0 END), 0)::float AS paid
       FROM referral_commissions WHERE referrer_code = $1`,
      [row.code]
    );
    const totals = c.rows[0] || { total: 0, pending: 0, paid: 0 };
    const clicks = Number(row.clicks) || 0;
    const signups = Number(row.signups) || 0;

    const recent = await query(
      `SELECT referred_email, amount, commission_percent, status, created_at
       FROM referral_commissions WHERE referrer_code = $1 ORDER BY created_at DESC LIMIT 10`,
      [row.code]
    );

    return NextResponse.json({
      recent: recent.rows.map(r => ({
        email: r.referred_email,
        amount: Number(r.amount) || 0,
        commission: (Number(r.amount) || 0) * (Number(r.commission_percent) || 0) / 100,
        status: r.status,
        created_at: r.created_at,
      })),
      code: row.code,
      clicks,
      signups,
      conversion: clicks > 0 ? +(signups / clicks * 100).toFixed(1) : 0,
      commission_total: totals.total,
      commission_pending: totals.pending,
      commission_paid: totals.paid,
      tier: tierFor(totals.total),
      onboarded: !!row.onboarded_at,
      channel: row.channel,
      zip: row.zip,
    });
  } catch (e) {
    console.error('[Referrals Stats API]', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
