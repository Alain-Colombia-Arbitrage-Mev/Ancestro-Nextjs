import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const r = await query('SELECT * FROM commission_settings ORDER BY role');
    return NextResponse.json(r.rows);
  } catch (e) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { role, percentage, updated_by } = await req.json();
    if (!role || percentage === undefined) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const pct = parseFloat(percentage);
    if (isNaN(pct) || pct < 0 || pct > 100) return NextResponse.json({ error: 'Invalid percentage' }, { status: 400 });

    const r = await query(
      `INSERT INTO commission_settings (role, percentage, updated_by, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (role) DO UPDATE SET percentage = $2, updated_by = $3, updated_at = NOW()
       RETURNING *`,
      [role, pct, updated_by || 'admin']
    );
    return NextResponse.json(r.rows[0]);
  } catch (e) {
    console.error('[Commissions API]', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
