import type { Metadata } from 'next';
import CustomerOnboardingWizard from '@/components/onboarding/CustomerOnboardingWizard';
import { t } from '@/i18n/translations';

interface Props { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: t(lang, 'onb.cust.meta.title'),
    description: t(lang, 'onb.cust.meta.desc'),
  };
}

export default async function CustomerOnboardingPage({ params }: Props) {
  const { lang } = await params;
  return <CustomerOnboardingWizard lang={lang} />;
}
