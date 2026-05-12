import type { Metadata } from 'next';
import Dashboard from '@/components/Dashboard';
import { t } from '@/i18n/translations';

interface Props { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: t(lang, 'dashboard.meta.title'), description: t(lang, 'dashboard.meta.desc') };
}

export default async function DashboardPage({ params }: Props) {
  const { lang } = await params;
  return <Dashboard lang={lang} />;
}
