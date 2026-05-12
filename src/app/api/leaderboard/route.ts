import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

function tierColor(rank: number): string {
  if (rank === 1) return '#F59E0B';
  if (rank === 2) return '#C0C0C0';
  if (rank === 3) return '#CD7F32';
  return '#848E9C';
}

export async function GET(req: NextRequest) {
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '20'), 100);
  const userId = req.nextUrl.searchParams.get('user_id') || '';

  try {
    const r = await query(
      `SELECT
         rl.user_id,
         COALESCE(rl.user_name, rl.user_email, rl.user_id) AS name,
         rl.signups AS refs,
         COALESCE(SUM(rc.amount * rc.commission_percent / 100.0), 0)::float AS revenue
       FROM referral_links rl
       LEFT JOIN referral_commissions rc ON rc.referrer_code = rl.code
       GROUP BY rl.user_id, rl.user_name, rl.user_email, rl.signups
       ORDER BY revenue DESC, refs DESC
       LIMIT $1`,
      [limit]
    );

    const rows = r.rows.map((row, i) => ({
      rank: i + 1,
      user_id: row.user_id,
      name: row.name,
      refs: Number(row.refs) || 0,
      revenue: Number(row.revenue) || 0,
      color: tierColor(i + 1),
      isYou: userId && row.user_id === userId,
    }));

    return NextResponse.json({ rows, total: rows.length });
  } catch (e) {
    console.error('[Leaderboard API]', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
