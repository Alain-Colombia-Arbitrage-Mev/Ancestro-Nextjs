import type { Metadata } from 'next';
import EpcOnboardingWizard from '@/components/onboarding/EpcOnboardingWizard';
import { t } from '@/i18n/translations';

interface Props { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: t(lang, 'onb.epc.meta.title'),
    description: t(lang, 'onb.epc.meta.desc'),
  };
}

export default async function EpcOnboardingPage({ params }: Props) {
  const { lang } = await params;
  return <EpcOnboardingWizard lang={lang} />;
}
