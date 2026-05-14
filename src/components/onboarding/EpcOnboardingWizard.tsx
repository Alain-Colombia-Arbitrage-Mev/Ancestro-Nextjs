'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { t } from '@/i18n/translations';
import { Ic } from '@/components/dashboard/shared';
import { OnboardingShell, type StepDef } from './OnboardingShell';
import { Step1EpcCompany } from './steps/Step1EpcCompany';
import { Step2EpcCertifications } from './steps/Step2EpcCertifications';
import { Step3EpcServiceArea } from './steps/Step3EpcServiceArea';
import { Step4EpcSubmit } from './steps/Step4EpcSubmit';

export interface EpcCert { id: string; type: 'nabcep' | 'osha10' | 'osha30' | 'manufacturer' | 'electrical'; expiresAt?: string; uploaded?: boolean }

export interface EpcOnboardingState {
  legalName?: string;
  ein?: string;
  yearsOperating?: number;
  licenseNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  // certifications
  certs?: EpcCert[];
  insuranceUploaded?: boolean;
  // service area
  serviceCenter?: string;
  serviceRadiusKm?: number;
  zipCodes?: string[];
  // submit
  acceptedTerms?: boolean;
}

const STEPS: StepDef[] = [
  { id: 'company', labelKey: 'onb.epc.step.company' },
  { id: 'certs',   labelKey: 'onb.epc.step.certs' },
  { id: 'area',    labelKey: 'onb.epc.step.area' },
  { id: 'submit',  labelKey: 'onb.epc.step.submit' },
];

const STORAGE_KEY = 'ancestro_epc_onboarding';

export default function EpcOnboardingWizard({ lang }: { lang: string }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<EpcOnboardingState>({});
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

  const update = (patch: Partial<EpcOnboardingState>) => setData((d) => ({ ...d, ...patch }));

  const canProceed: Record<number, boolean> = {
    0: !!data.legalName && !!data.ein && !!data.address,
    1: (data.certs?.filter(c => c.uploaded).length ?? 0) >= 1 && !!data.insuranceUploaded,
    2: !!data.serviceCenter && typeof data.serviceRadiusKm === 'number' && data.serviceRadiusKm > 0,
    3: !!data.acceptedTerms,
  };

  const goNext = async () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    setSubmitting(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/epc-onboarding`, {
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
      case 0: return <Step1EpcCompany lang={lang} data={data} update={update} />;
      case 1: return <Step2EpcCertifications lang={lang} data={data} update={update} />;
      case 2: return <Step3EpcServiceArea lang={lang} data={data} update={update} />;
      case 3: return <Step4EpcSubmit lang={lang} data={data} update={update} />;
      default: return null;
    }
  })();

  const headlineMap: Record<number, string> = {
    0: 'onb.epc.step.company.title',
    1: 'onb.epc.step.certs.title',
    2: 'onb.epc.step.area.title',
    3: 'onb.epc.step.submit.title',
  };
  const descMap: Record<number, string> = {
    0: 'onb.epc.step.company.desc',
    1: 'onb.epc.step.certs.desc',
    2: 'onb.epc.step.area.desc',
    3: 'onb.epc.step.submit.desc',
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
              ? (submitting ? t(lang, 'onb.submitting') : <>{t(lang, 'onb.epc.submitForReview')} <Ic n="check" s={14} /></>)
              : <>{t(lang, 'onb.continueTo')} {t(lang, STEPS[step + 1].labelKey).toLowerCase()} <Ic n="arrow-right" s={14} /></>}
          </button>
        </>
      }
    >
      <></>
    </OnboardingShell>
  );
}
