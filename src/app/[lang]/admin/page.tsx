import type { Metadata } from 'next';
import AdminPanel from '@/components/admin/AdminPanel';
import { t } from '@/i18n/translations';

interface Props { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: t(lang, 'admin.meta.title'), description: t(lang, 'admin.meta.desc') };
}

export default async function AdminPage({ params }: Props) {
  const { lang } = await params;
  return <AdminPanel lang={lang} />;
}
