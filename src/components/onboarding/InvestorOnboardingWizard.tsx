'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { t } from '@/i18n/translations';
import { Ic } from '@/components/dashboard/shared';
import { OnboardingShell, type StepDef } from './OnboardingShell';
import { Step1InvestorProfile } from './steps/Step1InvestorProfile';
import { Step2InvestorRisk } from './steps/Step2InvestorRisk';
import { Step3InvestorKyc } from './steps/Step3InvestorKyc';
import { Step4InvestorFirstInvestment } from './steps/Step4InvestorFirstInvestment';

export type RiskProfile = 'conservative' | 'balanced' | 'aggressive';
export type Sector = 'residential' | 'electrolineras' | 'commercial';

export interface InvestorOnboardingState {
  fullName?: string;
  dob?: string;
  citizenship?: string;
  address?: string;
  isAccredited?: boolean;
  isUsCitizen?: boolean;
  isPep?: boolean;
  riskProfile?: RiskProfile;
  horizonYears?: number;
  sectors?: Sector[];
  kycDocType?: 'passport' | 'driver-license' | 'national-id';
  kycDocUploaded?: boolean;
  kycSelfieUploaded?: boolean;
  acceptedTerms?: boolean;
  firstProjectId?: string;
  firstAmount?: number;
}

const STEPS: StepDef[] = [
  { id: 'profile',  labelKey: 'onb.inv.step.profile' },
  { id: 'risk',     labelKey: 'onb.inv.step.risk' },
  { id: 'kyc',      labelKey: 'onb.inv.step.kyc' },
  { id: 'invest',   labelKey: 'onb.inv.step.invest' },
];

const STORAGE_KEY = 'ancestro_investor_onboarding';

export default function InvestorOnboardingWizard({ lang }: { lang: string }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<InvestorOnboardingState>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.data) setData(parsed.data);
        if (typeof parsed?.step === 'number') setStep(parsed.step);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, data })); } catch {}
  }, [step, data]);

  const update = (patch: Partial<InvestorOnboardingState>) => setData((d) => ({ ...d, ...patch }));

  const canProceed: Record<number, boolean> = {
    0: !!data.fullName && !!data.dob && !!data.citizenship,
    1: !!data.riskProfile && typeof data.horizonYears === 'number' && (data.sectors?.length ?? 0) > 0,
    2: !!data.kycDocUploaded && !!data.kycSelfieUploaded && !!data.acceptedTerms,
    3: !!data.firstProjectId && typeof data.firstAmount === 'number' && data.firstAmount >= 100,
  };

  const goNext = async () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    setSubmitting(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/investor-onboarding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.fullName,
          dateOfBirth: data.dob,
          citizenship: data.citizenship,
          address: data.address,
          isPep: data.isPep === true,
          isUsCitizen: data.isUsCitizen === true,
          acceptedRepresentations: data.acceptedTerms === true,
          investorType: 'individual',
        }),
        credentials: 'include',
      }).catch(() => {});
      localStorage.removeItem(STORAGE_KEY);
      router.push(`/${lang}/dashboard`);
    } finally {
      setSubmitting(false);
    }
  };

  const goBack = () => {
    if (step === 0) router.push(`/${lang}/dashboard`);
    else setStep((s) => s - 1);
  };

  const stepContent = (() => {
    switch (step) {
      case 0: return <Step1InvestorProfile lang={lang} data={data} update={update} />;
      case 1: return <Step2InvestorRisk lang={lang} data={data} update={update} />;
      case 2: return <Step3InvestorKyc lang={lang} data={data} update={update} />;
      case 3: return <Step4InvestorFirstInvestment lang={lang} data={data} update={update} />;
      default: return null;
    }
  })();

  const headlineMap: Record<number, string> = {
    0: 'onb.inv.step.profile.title',
    1: 'onb.inv.step.risk.title',
    2: 'onb.inv.step.kyc.title',
    3: 'onb.inv.step.invest.title',
  };
  const descMap: Record<number, string> = {
    0: 'onb.inv.step.profile.desc',
    1: 'onb.inv.step.risk.desc',
    2: 'onb.inv.step.kyc.desc',
    3: 'onb.inv.step.invest.desc',
  };

  const finalCtaText = data.firstAmount
    ? `${t(lang, 'onb.inv.fundCta')} $${data.firstAmount.toLocaleString('en-US')} · ${t(lang, 'onb.inv.goDashboard')}`
    : t(lang, 'onb.inv.fundCta');

  return (
    <OnboardingShell
      lang={lang}
      steps={STEPS}
      activeIndex={step}
      onSelect={(i) => i <= step && setStep(i)}
      headline={
        <>
          <h1 style={{ fontSize: 44, fontWeight: 800, color: '#F5F3FF', margin: 0, letterSpacing: -1, lineHeight: 1.05 }}>
            {t(lang, headlineMap[step])}
          </h1>
          <p style={{ color: '#848E9C', fontSize: 15, lineHeight: 1.5, margin: 0, maxWidth: 480 }}>
            {t(lang, descMap[step])}
          </p>
        </>
      }
      rightPanel={stepContent}
      footer={
        <>
          <button type="button" className="onb-btn-ghost" onClick={goBack}>
            ← {t(lang, 'onb.back')}
          </button>
          <button
            type="button"
            className={`onb-btn-primary${step === STEPS.length - 1 ? ' onb-btn-success' : ''}`}
            disabled={!canProceed[step] || submitting}
            onClick={goNext}
          >
            {step === STEPS.length - 1
              ? (submitting ? t(lang, 'onb.submitting') : finalCtaText)
              : <>{t(lang, 'onb.continueTo')} {t(lang, STEPS[step + 1].labelKey).toLowerCase()} <Ic n="arrow-right" s={14} /></>}
          </button>
        </>
      }
    >
      <></>
    </OnboardingShell>
  );
}
