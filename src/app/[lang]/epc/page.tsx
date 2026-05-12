import type { Metadata } from 'next';
import EpcDashboard from '@/components/EpcDashboard';
import { t } from '@/i18n/translations';

interface Props { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: t(lang, 'epc.meta.title'), description: t(lang, 'epc.meta.desc') };
}

export default async function EpcPage({ params }: Props) {
  const { lang } = await params;
  return <EpcDashboard lang={lang} />;
}
