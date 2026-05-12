import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 });

  try {
    const r = await query('SELECT * FROM referral_links WHERE code = $1', [code]);
    if (!r.rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(r.rows[0]);
  } catch (e) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, code, action, user_email, user_name } = body;
    if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 });

    if (action === 'create') {
      const existing = await query('SELECT * FROM referral_links WHERE user_id = $1', [user_id]);
      if (existing.rows.length) return NextResponse.json(existing.rows[0]);

      const r = await query(
        'INSERT INTO referral_links (user_id, code, user_email, user_name) VALUES ($1, $2, $3, $4) RETURNING *',
        [user_id, code, user_email || null, user_name || null]
      );
      return NextResponse.json(r.rows[0]);
    }

    if (action === 'click') {
      await query('UPDATE referral_links SET clicks = clicks + 1 WHERE code = $1', [code]);
      return NextResponse.json({ success: true, action: 'click' });
    }

    if (action === 'convert') {
      const { referred_email, amount } = await req.json();
      const r = await query('SELECT * FROM referral_links WHERE code = $1', [code]);
      if (!r.rows.length) return NextResponse.json({ error: 'Invalid code' }, { status: 404 });

      const cs = await query('SELECT * FROM commission_settings WHERE role = $1', ['affiliate']);
      const pct = cs.rows[0]?.percentage || 15;

      await query('UPDATE referral_links SET signups = signups + 1 WHERE code = $1', [code]);
      await query(
        'INSERT INTO referral_commissions (referrer_code, referred_email, amount, commission_percent) VALUES ($1,$2,$3,$4)',
        [code, referred_email, amount ? parseFloat(amount) : 0, pct]
      );

      return NextResponse.json({ success: true, action: 'convert', commission_pct: pct });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (e) {
    console.error('[Referrals API]', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
