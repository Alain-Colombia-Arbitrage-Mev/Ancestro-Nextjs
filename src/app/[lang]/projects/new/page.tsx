import type { Metadata } from 'next';
import Dashboard from '@/components/Dashboard';
import ProjectUploadWizard from '@/components/projects/ProjectUploadWizard';
import { t } from '@/i18n/translations';

interface Props { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: t(lang, 'proj.meta.title'),
    description: t(lang, 'proj.meta.desc'),
  };
}

export default async function NewProjectPage({ params }: Props) {
  const { lang } = await params;
  return (
    <Dashboard lang={lang}>
      <ProjectUploadWizard lang={lang} />
    </Dashboard>
  );
}
