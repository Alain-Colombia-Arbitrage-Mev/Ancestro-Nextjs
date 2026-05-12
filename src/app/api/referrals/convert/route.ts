import { NextRequest, NextResponse } from 'next/server';
import { recordReferralConversion } from '@/lib/referral-attribution';

/**
 * Credit a referral conversion using the ancestro_ref cookie.
 * Call this from the client right after a successful signup, or from server
 * routes that finalize a signup/order. Idempotent per (code, email).
 *
 * Body: { email: string, amount?: number, role?: 'affiliate'|'customer'|'epc' }
 */
export async function POST(req: NextRequest) {
  try {
    const { email, amount, role } = await req.json();
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 });

    const result = await recordReferralConversion(req, {
      email,
      amount: typeof amount === 'number' ? amount : amount ? parseFloat(amount) : undefined,
      role,
    });

    if (!result.credited) {
      const status = result.reason === 'no_cookie' || result.reason === 'duplicate' ? 200 : 200;
      return NextResponse.json({ credited: false, reason: result.reason }, { status });
    }

    const res = NextResponse.json({
      credited: true,
      commission_pct: result.commission_pct,
      amount: result.amount,
      referrer_code: result.referrer_code,
    });
    // Clear cookie after a successful credit so the same visitor doesn't re-attribute a second action.
    res.cookies.set('ancestro_ref', '', { maxAge: 0, path: '/' });
    return res;
  } catch (e) {
    console.error('[Referrals Convert]', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
