import { redirect } from 'next/navigation';
import { query } from '@/lib/db';

interface Props { params: Promise<{ lang: string; code: string }> }

export default async function ReferralRedirect({ params }: Props) {
  const { lang, code } = await params;

  try {
    await query('UPDATE referral_links SET clicks = clicks + 1 WHERE code = $1', [code]);
  } catch {
    // Silent — redirect even if tracking fails
  }

  redirect(`/${lang}?ref=${code}&via=r`);
}