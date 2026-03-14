'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchKycStatus, markKycPending, type KycStatus } from '@/lib/kyc';
import MetaMapButton from './MetaMapButton';
import KycStatusBadge from './KycStatusBadge';

interface InvestorOnboardingProps {
  lang: string;
  onVerified?: () => void;
}

const text: Record<string, Record<string, string>> = {
  es: {
    title: 'Verificacion de Inversionista',
    subtitle: 'Para cumplir con regulaciones SEC y anti-lavado de dinero (AML), necesitamos verificar tu identidad antes de procesar tu solicitud de inversion.',
    step1: 'Verificacion de Identidad (KYC)',
    step1desc: 'Sube tu documento de identidad y completa una verificacion biometrica.',
    step2: 'Evaluacion Anti-Lavado (AML)',
    step2desc: 'Verificacion automatica contra listas de sanciones y PEPs.',
    step3: 'Aprobacion',
    step3desc: 'Una vez aprobado, podras completar tu solicitud de inversion.',
    pending: 'Tu verificacion esta en proceso. Esto puede tomar unos minutos. Te notificaremos por correo.',
    verified: 'Identidad verificada. Puedes proceder con tu solicitud de inversion.',
    rejected: 'Tu verificacion fue rechazada. Por favor intenta nuevamente con documentos validos.',
    startBtn: 'Iniciar Verificacion',
    retryBtn: 'Reintentar Verificacion',
    time: 'Toma menos de 3 minutos',
    secure: '256-bit encrypted',
    compliant: 'SEC compliant',
  },
  en: {
    title: 'Investor Verification',
    subtitle: 'To comply with SEC regulations and anti-money laundering (AML) requirements, we need to verify your identity before processing your investment request.',
    step1: 'Identity Verification (KYC)',
    step1desc: 'Upload your government-issued ID and complete biometric verification.',
    step2: 'Anti-Money Laundering (AML)',
    step2desc: 'Automated screening against sanctions lists and PEPs.',
    step3: 'Approval',
    step3desc: 'Once approved, you can complete your investment request.',
    pending: 'Your verification is being processed. This may take a few minutes. We will notify you by email.',
    verified: 'Identity verified. You can proceed with your investment request.',
    rejected: 'Your verification was rejected. Please try again with valid documents.',
    startBtn: 'Start Verification',
    retryBtn: 'Retry Verification',
    time: 'Takes less than 3 minutes',
    secure: '256-bit encrypted',
    compliant: 'SEC compliant',
  },
  pt: {
    title: 'Verificacao de Investidor',
    subtitle: 'Para cumprir com regulamentacoes SEC e anti-lavagem de dinheiro (AML), precisamos verificar sua identidade antes de processar sua solicitacao de investimento.',
    step1: 'Verificacao de Identidade (KYC)',
    step1desc: 'Envie seu documento de identidade e complete a verificacao biometrica.',
    step2: 'Avaliacao Anti-Lavagem (AML)',
    step2desc: 'Verificacao automatica contra listas de sancoes e PEPs.',
    step3: 'Aprovacao',
    step3desc: 'Uma vez aprovado, voce podera completar sua solicitacao de investimento.',
    pending: 'Sua verificacao esta em processo. Isso pode levar alguns minutos.',
    verified: 'Identidade verificada. Voce pode prosseguir com sua solicitacao de investimento.',
    rejected: 'Sua verificacao foi rejeitada. Tente novamente com documentos validos.',
    startBtn: 'Iniciar Verificacao',
    retryBtn: 'Tentar Novamente',
    time: 'Leva menos de 3 minutos',
    secure: '256-bit encrypted',
    compliant: 'SEC compliant',
  },
};

export default function InvestorOnboarding({ lang, onVerified }: InvestorOnboardingProps) {
  const [kycStatus, setKycStatus] = useState<KycStatus>('not_started');
  const [polling, setPolling] = useState(false);
  const t = text[lang] || text.en;

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('ancestro:token') : null;
    if (token) fetchKycStatus(token).then((s) => {
      setKycStatus(s);
      if (s === 'verified') onVerified?.();
    });
  }, [onVerified]);

  // Poll for status when pending
  useEffect(() => {
    if (kycStatus !== 'pending' || polling) return;
    setPolling(true);
    const interval = setInterval(async () => {
      const token = localStorage.getItem('ancestro:token');
      if (!token) return;
      const s = await fetchKycStatus(token);
      if (s !== 'pending') {
        setKycStatus(s);
        clearInterval(interval);
        setPolling(false);
        if (s === 'verified') onVerified?.();
      }
    }, 5000);
    return () => { clearInterval(interval); setPolling(false); };
  }, [kycStatus, polling, onVerified]);

  const handleFinished = useCallback(async () => {
    setKycStatus('pending');
    const token = localStorage.getItem('ancestro:token');
    if (token) await markKycPending(token);
  }, []);

  const stepStatus = (step: number) => {
    if (kycStatus === 'verified') return 'done';
    if (kycStatus === 'pending' && step <= 2) return step === 1 ? 'done' : 'active';
    if (kycStatus === 'not_started' || kycStatus === 'rejected') return step === 1 ? 'active' : 'upcoming';
    return 'upcoming';
  };

  if (kycStatus === 'verified') return null;

  return (
    <>
      <div className="io-container">
        <div className="io-header">
          <div className="io-shield">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h3 className="io-title">{t.title}</h3>
          <KycStatusBadge status={kycStatus} lang={lang} />
        </div>

        <p className="io-subtitle">{t.subtitle}</p>

        {/* Steps */}
        <div className="io-steps">
          {[
            { num: 1, title: t.step1, desc: t.step1desc },
            { num: 2, title: t.step2, desc: t.step2desc },
            { num: 3, title: t.step3, desc: t.step3desc },
          ].map((step) => {
            const s = stepStatus(step.num);
            return (
              <div key={step.num} className={`io-step io-step--${s}`}>
                <div className="io-step-num">
                  {s === 'done' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  ) : step.num}
                </div>
                <div className="io-step-text">
                  <span className="io-step-title">{step.title}</span>
                  <span className="io-step-desc">{step.desc}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action area */}
        {(kycStatus === 'not_started' || kycStatus === 'rejected') && (
          <div className="io-action">
            <MetaMapButton userId="" userEmail="" onFinished={handleFinished} />
            <div className="io-trust">
              <span>{t.time}</span>
              <span>{t.secure}</span>
              <span>{t.compliant}</span>
            </div>
          </div>
        )}

        {kycStatus === 'pending' && (
          <div className="io-status io-status--pending">
            <div className="io-status-spinner" />
            <p>{t.pending}</p>
          </div>
        )}

        {kycStatus === 'rejected' && (
          <div className="io-status io-status--rejected">
            <p>{t.rejected}</p>
          </div>
        )}
      </div>

      <style>{`
        .io-container{padding:32px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:16px;margin-bottom:24px}
        .io-header{display:flex;align-items:center;gap:12px;margin-bottom:16px;flex-wrap:wrap}
        .io-shield{color:#f8b03b}
        .io-title{font-size:20px;font-weight:700;color:#fff;margin:0;flex:1}
        .io-subtitle{font-size:14px;color:rgba(255,255,255,0.45);line-height:1.6;margin:0 0 24px}
        .io-steps{display:flex;flex-direction:column;gap:12px;margin-bottom:24px}
        .io-step{display:flex;align-items:flex-start;gap:14px;padding:14px 16px;border-radius:12px;border:1px solid rgba(255,255,255,0.06);transition:all 0.2s}
        .io-step--active{background:rgba(248,176,59,0.06);border-color:rgba(248,176,59,0.2)}
        .io-step--done{background:rgba(34,197,94,0.04);border-color:rgba(34,197,94,0.15)}
        .io-step--upcoming{opacity:0.4}
        .io-step-num{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0}
        .io-step--active .io-step-num{background:rgba(248,176,59,0.2);color:#f8b03b}
        .io-step--done .io-step-num{background:rgba(34,197,94,0.2);color:#22c55e}
        .io-step--upcoming .io-step-num{background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.4)}
        .io-step-text{display:flex;flex-direction:column;gap:2px}
        .io-step-title{font-size:14px;font-weight:600;color:#fff}
        .io-step-desc{font-size:12px;color:rgba(255,255,255,0.4)}
        .io-action{display:flex;flex-direction:column;align-items:center;gap:16px}
        .io-trust{display:flex;gap:16px;flex-wrap:wrap;justify-content:center}
        .io-trust span{font-size:11px;color:rgba(255,255,255,0.3);display:flex;align-items:center;gap:4px}
        .io-trust span::before{content:'';width:4px;height:4px;border-radius:50%;background:rgba(34,197,94,0.6)}
        .io-status{padding:16px;border-radius:12px;text-align:center;display:flex;align-items:center;justify-content:center;gap:12px}
        .io-status p{margin:0;font-size:14px;line-height:1.5}
        .io-status--pending{background:rgba(234,179,8,0.08);border:1px solid rgba(234,179,8,0.2);color:#eab308}
        .io-status--rejected{background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);color:#ef4444}
        .io-status-spinner{width:20px;height:20px;border:2px solid rgba(234,179,8,0.2);border-top-color:#eab308;border-radius:50%;animation:ioSpin 0.8s linear infinite;flex-shrink:0}
        @keyframes ioSpin{to{transform:rotate(360deg)}}
        @media(max-width:480px){.io-container{padding:20px}.io-step{padding:12px}.io-trust{flex-direction:column;align-items:center}}
      `}</style>
    </>
  );
}
