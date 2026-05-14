import type { Metadata } from 'next';
import InvestorOnboardingWizard from '@/components/onboarding/InvestorOnboardingWizard';
import { t } from '@/i18n/translations';

interface Props { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: t(lang, 'onb.inv.meta.title'),
    description: t(lang, 'onb.inv.meta.desc'),
  };
}

export default async function InvestorOnboardingPage({ params }: Props) {
  const { lang } = await params;
  return <InvestorOnboardingWizard lang={lang} />;
}
