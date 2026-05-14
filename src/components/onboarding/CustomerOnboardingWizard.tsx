'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { t } from '@/i18n/translations';
import { Ic } from '@/components/dashboard/shared';
import { OnboardingShell, type StepDef } from './OnboardingShell';
import { Step1Location } from './steps/Step1Location';
import { Step2EnergyUse } from './steps/Step2EnergyUse';
import { Step3SystemSizing } from './steps/Step3SystemSizing';
import { Step4Signature } from './steps/Step4Signature';

export interface OnboardingState {
  address?: string;
  lat?: number;
  lng?: number;
  monthlyKwh?: number;
  hasUtilityBills?: boolean;
  peakUsage?: 'morning' | 'afternoon' | 'evening' | 'night';
  systemSizeKw?: number;
  signedAt?: string;
}

const STEPS: StepDef[] = [
  { id: 'location',  labelKey: 'onb.cust.step.location' },
  { id: 'energy',    labelKey: 'onb.cust.step.energy' },
  { id: 'sizing',    labelKey: 'onb.cust.step.sizing' },
  { id: 'signature', labelKey: 'onb.cust.step.signature' },
];

const STORAGE_KEY = 'ancestro_customer_onboarding';

export default function CustomerOnboardingWizard({ lang }: { lang: string }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingState>({});
  const [submitting, setSubmitting] = useState(false);

  // Restore from localStorage on mount.
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

  // Persist on every change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, data }));
    } catch {}
  }, [step, data]);

  const update = (patch: Partial<OnboardingState>) => setData((d) => ({ ...d, ...patch }));

  const canProceed: Record<number, boolean> = {
    0: !!data.address,
    1: typeof data.monthlyKwh === 'number' && data.monthlyKwh > 0,
    2: typeof data.systemSizeKw === 'number' && data.systemSizeKw > 0,
    3: !!data.signedAt,
  };

  const goNext = async () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    // Final submit
    setSubmitting(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/onboarding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
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
      case 0: return <Step1Location lang={lang} data={data} update={update} />;
      case 1: return <Step2EnergyUse lang={lang} data={data} update={update} />;
      case 2: return <Step3SystemSizing lang={lang} data={data} update={update} />;
      case 3: return <Step4Signature lang={lang} data={data} update={update} />;
      default: return null;
    }
  })();

  const headlineMap: Record<number, string> = {
    0: 'onb.cust.step.location.title',
    1: 'onb.cust.step.energy.title',
    2: 'onb.cust.step.sizing.title',
    3: 'onb.cust.step.signature.title',
  };
  const descMap: Record<number, string> = {
    0: 'onb.cust.step.location.desc',
    1: 'onb.cust.step.energy.desc',
    2: 'onb.cust.step.sizing.desc',
    3: 'onb.cust.step.signature.desc',
  };

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
              ? (submitting ? t(lang, 'onb.submitting') : <>{t(lang, 'onb.signFinalize')} <Ic n="check" s={14} /></>)
              : <>{t(lang, 'onb.continueTo')} {t(lang, STEPS[step + 1].labelKey).toLowerCase()} <Ic n="arrow-right" s={14} /></>}
          </button>
        </>
      }
    >
      <></>
    </OnboardingShell>
  );
}
