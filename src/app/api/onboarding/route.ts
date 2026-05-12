import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { user_id, user_email, user_name, channel, zip, code } = await req.json();
    if (!user_id) return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });

    const existing = await query('SELECT code FROM referral_links WHERE user_id = $1', [user_id]);
    let finalCode = existing.rows[0]?.code as string | undefined;

    if (!finalCode) {
      const seed = (user_email || user_id).split('@')[0].substring(0, 8);
      finalCode = code || `${seed}-${Math.floor(Math.random() * 9000) + 1000}`;
      await query(
        `INSERT INTO referral_links (user_id, code, user_email, user_name, channel, zip, onboarded_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [user_id, finalCode, user_email || null, user_name || null, channel || null, zip || null]
      );
    } else {
      await query(
        `UPDATE referral_links
         SET channel = COALESCE($2, channel),
             zip = COALESCE($3, zip),
             user_email = COALESCE(user_email, $4),
             user_name = COALESCE(user_name, $5),
             onboarded_at = COALESCE(onboarded_at, NOW())
         WHERE user_id = $1`,
        [user_id, channel || null, zip || null, user_email || null, user_name || null]
      );
    }

    return NextResponse.json({ success: true, code: finalCode });
  } catch (e) {
    console.error('[Onboarding API]', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('user_id');
  if (!userId) return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
  try {
    const r = await query(
      'SELECT code, channel, zip, onboarded_at FROM referral_links WHERE user_id = $1',
      [userId]
    );
    if (!r.rows.length) return NextResponse.json({ onboarded: false });
    const row = r.rows[0];
    return NextResponse.json({
      onboarded: !!row.onboarded_at,
      code: row.code,
      channel: row.channel,
      zip: row.zip,
    });
  } catch (e) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
