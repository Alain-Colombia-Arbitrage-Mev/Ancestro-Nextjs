import { redirect } from 'next/navigation';

interface Props { params: Promise<{ lang: string; code: string }> }

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || '';

export default async function ReferralRedirect({ params }: Props) {
  const { lang, code } = await params;

  if (API_URL) {
    try {
      await fetch(`${API_URL}/api/referrals/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
        cache: 'no-store',
      });
    } catch {
      // Silent — redirect even if tracking fails
    }
  }

  redirect(`/${lang}?ref=${code}&via=r`);
}
