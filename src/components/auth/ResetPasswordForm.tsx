'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { cognitoConfirmResetPassword, getAuthErrorMessage } from '@/lib/auth';
import { configureAmplify } from '@/lib/amplify';
import { t } from '@/i18n/translations';

interface ResetPasswordFormProps {
  lang: string;
}

function ResetPasswordFormInner({ lang }: ResetPasswordFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ code: false, newPassword: false, confirmPassword: false });
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!email) {
      router.push(`/${lang}/forgot-password`);
      return;
    }
    configureAmplify();
    codeRef.current?.focus();
  }, [email, lang, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const errors = {
      code: !code || code.length !== 6,
      newPassword: !newPassword || newPassword.length < 8,
      confirmPassword: !confirmPassword || confirmPassword !== newPassword,
    };
    setFieldErrors(errors);

    if (errors.code || errors.newPassword) return;

    if (errors.confirmPassword) {
      setError(t(lang, 'auth.reset.passwordsNoMatch'));
      return;
    }

    setIsLoading(true);
    try {
      await cognitoConfirmResetPassword(email, code, newPassword);
      setSuccess(t(lang, 'auth.reset.passwordChanged'));
      setTimeout(() => { router.push(`/${lang}/login`); }, 1500);
    } catch (err: any) {
      setError(getAuthErrorMessage(err, lang));
    } finally {
      setIsLoading(false);
    }
  }

  function clearFieldError(field: keyof typeof fieldErrors) {
    setFieldErrors((f) => ({ ...f, [field]: false }));
  }

  const EyeOpen = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const EyeClosed = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M1 1l22 22" />
    </svg>
  );

  return (
    <div className="rp-wrapper">
      <div className="rp-glow rp-glow-1" />
      <div className="rp-glow rp-glow-2" />

      <div className="rp-card">
        <Link href={`/${lang}`} className="rp-logo">
          <img src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/logo.svg`} alt="Ancestro" width={140} height={28} />
        </Link>

        <div className="rp-header">
          <h1 className="rp-title">{t(lang, 'auth.reset.title')}</h1>
          <p className="rp-subtitle">{t(lang, 'auth.reset.subtitle')}</p>
        </div>

        {error && (
          <div className="rp-error" role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="rp-success" role="status">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="rp-form" noValidate>
          <div className={`rp-field ${fieldErrors.code ? 'rp-field--error' : ''}`}>
            <label className="rp-label" htmlFor="rp-code">{t(lang, 'auth.reset.code')}</label>
            <div className="rp-input-wrap">
              <svg className="rp-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26z" />
              </svg>
              <input
                ref={codeRef}
                id="rp-code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                className="rp-input"
                value={code}
                onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); clearFieldError('code'); }}
                placeholder="000000"
                disabled={isLoading || !!success}
              />
            </div>
          </div>

          <div className={`rp-field ${fieldErrors.newPassword ? 'rp-field--error' : ''}`}>
            <label className="rp-label" htmlFor="rp-new-pw">{t(lang, 'auth.reset.newPassword')}</label>
            <div className="rp-input-wrap">
              <svg className="rp-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="rp-new-pw"
                type={showPassword ? 'text' : 'password'}
                className="rp-input rp-input--password"
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); clearFieldError('newPassword'); }}
                autoComplete="new-password"
                placeholder="Min. 8 caracteres"
                disabled={isLoading || !!success}
              />
              <button type="button" className="rp-eye" onClick={() => setShowPassword(!showPassword)} tabIndex={-1} aria-label={showPassword ? t(lang, 'auth.reset.hidePassword') : t(lang, 'auth.reset.showPassword')}>
                {showPassword ? EyeClosed : EyeOpen}
              </button>
            </div>
          </div>

          <div className={`rp-field ${fieldErrors.confirmPassword ? 'rp-field--error' : ''}`}>
            <label className="rp-label" htmlFor="rp-confirm-pw">{t(lang, 'auth.reset.confirmPassword')}</label>
            <div className="rp-input-wrap">
              <svg className="rp-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="rp-confirm-pw"
                type={showPassword ? 'text' : 'password'}
                className="rp-input rp-input--password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); clearFieldError('confirmPassword'); }}
                autoComplete="new-password"
                placeholder="Repite tu contraseña"
                disabled={isLoading || !!success}
              />
            </div>
          </div>

          <button
            type="submit"
            className={`rp-btn rp-btn--primary ${isLoading ? 'rp-btn--loading' : ''}`}
            disabled={isLoading || !!success}
          >
            {isLoading ? (
              <><span className="rp-spinner" />{t(lang, 'auth.reset.loading')}</>
            ) : t(lang, 'auth.reset.button')}
          </button>
        </form>

        <p className="rp-link-row">
          <Link href={`/${lang}/login`} className="rp-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {t(lang, 'auth.reset.backToLogin')}
          </Link>
        </p>
      </div>

      <style>{`
        .rp-wrapper{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#000;padding:100px 20px 40px;position:relative;overflow:hidden}
        .rp-glow{position:absolute;border-radius:50%;filter:blur(120px);pointer-events:none;z-index:0}
        .rp-glow-1{width:500px;height:500px;background:radial-gradient(circle,rgba(248,176,59,.12) 0%,transparent 70%);top:-100px;left:-100px;animation:rpFloat 8s ease-in-out infinite}
        .rp-glow-2{width:400px;height:400px;background:radial-gradient(circle,rgba(248,176,59,.07) 0%,transparent 70%);bottom:-80px;right:-80px;animation:rpFloat 10s ease-in-out infinite reverse}
        @keyframes rpFloat{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-30px) scale(1.05)}}
        .rp-card{position:relative;z-index:1;width:100%;max-width:440px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.1);border-radius:24px;padding:44px 40px;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);box-shadow:0 0 0 1px rgba(255,255,255,.04) inset,0 40px 80px rgba(0,0,0,.6),0 0 60px rgba(248,176,59,.04);animation:rpFadeUp .5s cubic-bezier(.16,1,.3,1) both}
        @keyframes rpFadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        .rp-logo{display:flex;justify-content:center;margin-bottom:32px;text-decoration:none}
        .rp-logo img{height:30px;width:auto;object-fit:contain}
        .rp-header{text-align:center;margin-bottom:32px}
        .rp-title{font-size:26px;font-weight:700;color:#fff;margin:0 0 8px;letter-spacing:-.5px}
        .rp-subtitle{font-size:14px;color:rgba(255,255,255,.45);margin:0;line-height:1.5}
        .rp-error{display:flex;align-items:center;gap:8px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.25);border-radius:12px;padding:12px 14px;font-size:13px;color:#f87171;margin-bottom:20px;animation:rpShake .4s cubic-bezier(.36,.07,.19,.97)}
        .rp-success{display:flex;align-items:center;gap:8px;background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.25);border-radius:12px;padding:12px 14px;font-size:13px;color:#4ade80;margin-bottom:20px}
        .rp-error svg,.rp-success svg{flex-shrink:0}
        @keyframes rpShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-5px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}}
        .rp-form{display:flex;flex-direction:column;gap:18px}
        .rp-field{display:flex;flex-direction:column;gap:7px}
        .rp-label{font-size:13px;font-weight:500;color:rgba(255,255,255,.55);letter-spacing:.01em}
        .rp-input-wrap{position:relative}
        .rp-input-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,.3);pointer-events:none;transition:color .2s}
        .rp-input{width:100%;padding:13px 16px 13px 42px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:12px;color:#fff;font-size:15px;font-family:inherit;outline:none;transition:all .2s ease;box-sizing:border-box}
        .rp-input--password{padding-right:46px}
        .rp-input:focus{border-color:rgba(248,176,59,.5);background:rgba(248,176,59,.04);box-shadow:0 0 0 3px rgba(248,176,59,.08)}
        .rp-input-wrap:focus-within .rp-input-icon{color:rgba(248,176,59,.7)}
        .rp-input::placeholder{color:rgba(255,255,255,.2)}
        .rp-input:disabled{opacity:.5;cursor:not-allowed}
        .rp-field--error .rp-input{border-color:rgba(239,68,68,.4);background:rgba(239,68,68,.04)}
        .rp-eye{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;color:rgba(255,255,255,.3);cursor:pointer;padding:4px;display:flex;align-items:center;justify-content:center;border-radius:6px;transition:color .2s}
        .rp-eye:hover{color:rgba(255,255,255,.7)}
        .rp-btn{width:100%;padding:14px;border:none;border-radius:12px;font-size:15px;font-weight:600;font-family:inherit;cursor:pointer;transition:all .25s ease;display:flex;align-items:center;justify-content:center;gap:10px;margin-top:4px}
        .rp-btn--primary{background:linear-gradient(135deg,#f8b03b 0%,#e9a235 100%);color:#000;box-shadow:0 4px 20px rgba(248,176,59,.25)}
        .rp-btn--primary:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 30px rgba(248,176,59,.4)}
        .rp-btn--primary:disabled{opacity:.6;cursor:not-allowed}
        .rp-spinner{width:18px;height:18px;border:2px solid rgba(0,0,0,.2);border-top-color:#000;border-radius:50%;animation:rpSpin .7s linear infinite;flex-shrink:0}
        @keyframes rpSpin{to{transform:rotate(360deg)}}
        .rp-link-row{text-align:center;margin-top:24px}
        .rp-link{color:rgba(248,176,59,.8);font-size:14px;font-weight:500;text-decoration:none;transition:color .2s;display:inline-flex;align-items:center;gap:6px}
        .rp-link:hover{color:#f8b03b}
        @media(max-width:480px){.rp-card{padding:36px 24px;border-radius:20px}.rp-title{font-size:22px}}
      `}</style>
    </div>
  );
}

export default function ResetPasswordForm({ lang }: ResetPasswordFormProps) {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#000' }} />}>
      <ResetPasswordFormInner lang={lang} />
    </Suspense>
  );
}
