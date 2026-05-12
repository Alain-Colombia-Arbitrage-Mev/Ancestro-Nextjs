import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdminEmail } from '@/lib/admin';

function requireAdmin(req: NextRequest): string | null {
  const email = req.headers.get('x-user-email') || '';
  return isAdminEmail(email) ? email : null;
}

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const r = await query('SELECT * FROM commission_settings ORDER BY role');
    return NextResponse.json(r.rows);
  } catch (e) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const adminEmail = requireAdmin(req);
  if (!adminEmail) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { role, percentage } = await req.json();
    if (!role || percentage === undefined) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const pct = parseFloat(percentage);
    if (isNaN(pct) || pct < 0 || pct > 100) return NextResponse.json({ error: 'Invalid percentage' }, { status: 400 });

    const r = await query(
      `INSERT INTO commission_settings (role, percentage, updated_by, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (role) DO UPDATE SET percentage = $2, updated_by = $3, updated_at = NOW()
       RETURNING *`,
      [role, pct, adminEmail]
    );
    return NextResponse.json(r.rows[0]);
  } catch (e) {
    console.error('[Commissions API]', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
