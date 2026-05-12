import type { Metadata } from 'next';
import OnboardingWizard from '@/components/OnboardingWizard';
import { t } from '@/i18n/translations';

interface Props { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: t(lang, 'onboarding.meta.title'), description: t(lang, 'onboarding.meta.desc') };
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  return <OnboardingWizard lang={lang} />;
}
