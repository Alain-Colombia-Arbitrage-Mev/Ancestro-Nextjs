import type { Metadata } from 'next';
import LeaderboardPage from '@/components/Leaderboard';
import { t } from '@/i18n/translations';

interface Props { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: t(lang, 'leaderboard.meta.title'), description: t(lang, 'leaderboard.meta.desc') };
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  return <LeaderboardPage lang={lang} />;
}
