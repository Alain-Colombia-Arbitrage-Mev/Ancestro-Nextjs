'use client';
import { useState, useEffect, useRef } from 'react';
import { t } from '@/i18n/translations';

interface WaitlistFormProps { lang: string; }

const countryCodes = [
  { code: '+57', country: 'Colombia', flag: '\ud83c\udde8\ud83c\uddf4' },
  { code: '+507', country: 'Panam\u00e1', flag: '\ud83c\uddf5\ud83c\udde6' },
  { code: '+1', country: 'Rep\u00fablica Dominicana', flag: '\ud83c\udde9\ud83c\uddf4' },
  { code: '+52', country: 'M\u00e9xico', flag: '\ud83c\uddf2\ud83c\uddfd' },
  { code: '+51', country: 'Per\u00fa', flag: '\ud83c\uddf5\ud83c\uddea' },
  { code: '+502', country: 'Guatemala', flag: '\ud83c\uddec\ud83c\uddf9' },
  { code: '+503', country: 'El Salvador', flag: '\ud83c\uddf8\ud83c\uddfb' },
  { code: '+598', country: 'Uruguay', flag: '\ud83c\uddfa\ud83c\uddfe' },
  { code: '+506', country: 'Costa Rica', flag: '\ud83c\udde8\ud83c\uddf7' },
  { code: '+55', country: 'Brasil', flag: '\ud83c\udde7\ud83c\uddf7' },
  { code: '+505', country: 'Nicaragua', flag: '\ud83c\uddf3\ud83c\uddee' },
  { code: '+504', country: 'Honduras', flag: '\ud83c\udded\ud83c\uddf3' },
  { code: '+56', country: 'Chile', flag: '\ud83c\udde8\ud83c\uddf1' },
  { code: '+54', country: 'Argentina', flag: '\ud83c\udde6\ud83c\uddf7' },
  { code: '+591', country: 'Bolivia', flag: '\ud83c\udde7\ud83c\uddf4' },
  { code: '+501', country: 'Belice', flag: '\ud83c\udde7\ud83c\uddff' },
  { code: '+593', country: 'Ecuador', flag: '\ud83c\uddea\ud83c\udde8' },
  { code: '+595', country: 'Paraguay', flag: '\ud83c\uddf5\ud83c\uddfe' },
  { code: '+1', country: 'Estados Unidos', flag: '\ud83c\uddfa\ud83c\uddf8' },
  { code: '+34', country: 'Espa\u00f1a', flag: '\ud83c\uddea\ud83c\uddf8' },
];

export default function WaitlistForm({ lang }: WaitlistFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [counter, setCounter] = useState(0);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = 12847;
    const duration = 2000;
    const start = Date.now();
    function update() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCounter(Math.floor(target * easeOut));
      if (progress < 1) requestAnimationFrame(update);
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) { requestAnimationFrame(update); observer.disconnect(); } });
    }, { threshold: 0.5 });
    if (counterRef.current) observer.observe(counterRef.current);
    return () => observer.disconnect();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('fullName'),
          email: formData.get('email'),
          phone: `${formData.get('countryCode')} ${formData.get('phone')}`,
          country: formData.get('country'),
        }),
      });
      if (!res.ok) throw new Error('Server error');
      setIsSuccess(true);
    } catch {
      alert(t(lang, 'contact.error'));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="waitlist-page">
        <div className="waitlist-bg">
          <div className="wl-bg-gradient"></div>
          <div className="wl-bg-grid"></div>
          <div className="floating-orb wl-orb-1"></div>
          <div className="floating-orb wl-orb-2"></div>
          <div className="floating-orb wl-orb-3"></div>
        </div>

        <div className="waitlist-container">
          <div className="waitlist-content">
            <div className="waitlist-header">
              <span className="waitlist-badge">{t(lang, 'waitlist.badge')}</span>
              <h1 className="waitlist-title">{t(lang, 'nav.waitlist')}</h1>
              <p className="waitlist-subtitle">{t(lang, 'waitlist.subtitle')}</p>
            </div>

            {!isSuccess ? (
              <form className="waitlist-form" onSubmit={handleSubmit}>
                <div className="wl-form-group">
                  <label>{t(lang, 'waitlist.fullName')}</label>
                  <div className="wl-input-wrapper">
                    <svg className="wl-input-icon" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/></svg>
                    <input type="text" name="fullName" placeholder={t(lang, 'waitlist.fullName.placeholder')} required />
                  </div>
                </div>
                <div className="wl-form-group">
                  <label>{t(lang, 'waitlist.email')}</label>
                  <div className="wl-input-wrapper">
                    <svg className="wl-input-icon" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" stroke="currentColor" strokeWidth="2"/></svg>
                    <input type="email" name="email" placeholder={t(lang, 'waitlist.email.placeholder')} required />
                  </div>
                </div>
                <div className="wl-form-group">
                  <label>{t(lang, 'waitlist.phone')}</label>
                  <div className="wl-phone-group">
                    <select className="wl-country-select" name="countryCode">
                      {countryCodes.map((c, i) => (<option key={i} value={c.code}>{c.flag} {c.code}</option>))}
                    </select>
                    <div className="wl-input-wrapper wl-phone-input">
                      <input type="tel" name="phone" placeholder={t(lang, 'waitlist.phone.placeholder')} required />
                    </div>
                  </div>
                </div>
                <div className="wl-form-group">
                  <label>{t(lang, 'waitlist.country')}</label>
                  <div className="wl-input-wrapper wl-select-wrapper">
                    <svg className="wl-input-icon" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="2"/></svg>
                    <select name="country" required>
                      <option value="">{t(lang, 'waitlist.country.placeholder')}</option>
                      {countryCodes.map((c, i) => (<option key={i} value={c.country}>{c.flag} {c.country}</option>))}
                    </select>
                  </div>
                </div>
                <button type="submit" className={`wl-submit-btn ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                  <span className="wl-btn-text">{t(lang, 'waitlist.submit')}</span>
                  {isLoading && <span className="wl-btn-loading"><svg className="wl-spinner" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="31.4 31.4" strokeLinecap="round"/></svg></span>}
                </button>
              </form>
            ) : (
              <div className="wl-success-message show">
                <div className="wl-success-icon"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                <h3>{t(lang, 'waitlist.success.title')}</h3>
                <p>{t(lang, 'waitlist.success.message')}</p>
                <div className="wl-position-badge">{t(lang, 'waitlist.success.position')}: <span>#13,248</span></div>
              </div>
            )}

            <div className="waitlist-counter" ref={counterRef}>
              <span className="counter-number">{counter.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
              <span className="counter-label">{t(lang, 'waitlist.counter')}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .waitlist-page{padding-top:79px;min-height:calc(100vh - 79px);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
        .waitlist-bg{position:absolute;inset:0;pointer-events:none}
        .wl-bg-gradient{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(248,176,59,0.15) 0%,transparent 50%),radial-gradient(ellipse at 80% 80%,rgba(248,176,59,0.1) 0%,transparent 40%)}
        .wl-bg-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px);background-size:60px 60px;mask-image:radial-gradient(ellipse at center,black 30%,transparent 70%)}
        .floating-orb{position:absolute;border-radius:50%;filter:blur(80px);opacity:0.4;animation:wlFloat 20s ease-in-out infinite}
        .wl-orb-1{width:400px;height:400px;background:var(--color-primary);top:10%;left:10%}
        .wl-orb-2{width:300px;height:300px;background:#ff6b35;bottom:20%;right:15%;animation-delay:-7s}
        .wl-orb-3{width:250px;height:250px;background:#4ecdc4;top:50%;right:30%;animation-delay:-14s}
        @keyframes wlFloat{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-30px) scale(1.1)}66%{transform:translate(-20px,20px) scale(0.9)}}
        .waitlist-container{position:relative;z-index:10;width:100%;max-width:500px;padding:40px 20px}
        .waitlist-content{background:rgba(15,15,15,0.8);backdrop-filter:blur(40px);-webkit-backdrop-filter:blur(40px);border:1px solid rgba(255,255,255,0.1);border-radius:24px;padding:48px;box-shadow:0 25px 80px rgba(0,0,0,0.5)}
        .waitlist-header{text-align:center;margin-bottom:32px}
        .waitlist-badge{display:inline-block;padding:8px 16px;background:rgba(248,176,59,0.15);border:1px solid rgba(248,176,59,0.3);border-radius:20px;font-size:12px;font-weight:600;color:var(--color-primary);text-transform:uppercase;letter-spacing:1px;margin-bottom:16px}
        .waitlist-title{font-size:32px;font-weight:700;color:var(--color-white);margin-bottom:12px}
        .waitlist-subtitle{font-size:15px;color:var(--color-gray);line-height:1.6}
        .waitlist-form{display:flex;flex-direction:column;gap:20px}
        .wl-form-group{display:flex;flex-direction:column;gap:8px}
        .wl-form-group label{font-size:14px;font-weight:500;color:var(--color-white)}
        .wl-input-wrapper{position:relative;display:flex;align-items:center}
        .wl-input-icon{position:absolute;left:16px;width:20px;height:20px;color:var(--color-gray);pointer-events:none}
        .wl-input-wrapper input,.wl-input-wrapper select{width:100%;padding:14px 16px 14px 48px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;font-size:15px;color:var(--color-white);transition:all 0.3s ease}
        .wl-input-wrapper input::placeholder{color:var(--color-gray)}
        .wl-input-wrapper input:focus,.wl-input-wrapper select:focus{outline:none;border-color:var(--color-primary);background:rgba(255,255,255,0.08)}
        .wl-phone-group{display:flex;gap:12px}
        .wl-country-select{padding:14px 12px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;font-size:15px;color:var(--color-white);cursor:pointer;min-width:100px}
        .wl-phone-input{flex:1}
        .wl-phone-input input{padding-left:16px}
        .wl-select-wrapper select{appearance:none;cursor:pointer}
        .wl-submit-btn{position:relative;width:100%;padding:16px;background:var(--color-primary);border:none;border-radius:12px;font-size:16px;font-weight:600;color:#000;cursor:pointer;overflow:hidden;transition:all 0.3s ease;margin-top:8px}
        .wl-submit-btn:hover{background:#e9a235;transform:translateY(-2px)}
        .wl-submit-btn.loading .wl-btn-text{opacity:0}
        .wl-btn-loading{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
        .wl-spinner{width:24px;height:24px;animation:wlSpin 1s linear infinite}
        @keyframes wlSpin{to{transform:rotate(360deg)}}
        .wl-success-message{display:none;text-align:center;padding:20px 0}
        .wl-success-message.show{display:block;animation:wlFadeIn 0.5s ease}
        @keyframes wlFadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .wl-success-icon{width:80px;height:80px;margin:0 auto 24px;background:rgba(34,197,94,0.15);border-radius:50%;display:flex;align-items:center;justify-content:center}
        .wl-success-icon svg{width:40px;height:40px;color:#22c55e}
        .wl-success-message h3{font-size:24px;font-weight:700;color:var(--color-white);margin-bottom:12px}
        .wl-success-message p{font-size:15px;color:var(--color-gray);margin-bottom:24px}
        .wl-position-badge{display:inline-block;padding:12px 24px;background:rgba(248,176,59,0.15);border:1px solid rgba(248,176,59,0.3);border-radius:30px;font-size:16px;color:var(--color-white)}
        .wl-position-badge span{font-weight:700;color:var(--color-primary)}
        .waitlist-counter{margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.1);text-align:center}
        .counter-number{display:block;font-size:32px;font-weight:700;color:var(--color-primary);margin-bottom:4px}
        .counter-label{font-size:14px;color:var(--color-gray)}
        @media(max-width:480px){.waitlist-content{padding:32px 24px}.waitlist-title{font-size:26px}.wl-phone-group{flex-direction:column}.wl-country-select{width:100%}}
      `}</style>
    </>
  );
}
