'use client';
import { useState } from 'react';
import { t } from '@/i18n/translations';

interface ContactFormProps { lang: string; }

function getFlagEmoji(code: string): string {
  const c = code.toUpperCase();
  if (c.length !== 2) return '';
  return String.fromCodePoint(...[...c].map((char) => 0x1f1e6 - 65 + char.charCodeAt(0)));
}

const countries = [
  { code: 'CO', name: 'Colombia', dial: '+57' },
  { code: 'MX', name: 'M\u00e9xico', dial: '+52' },
  { code: 'BR', name: 'Brasil', dial: '+55' },
  { code: 'AR', name: 'Argentina', dial: '+54' },
  { code: 'CL', name: 'Chile', dial: '+56' },
  { code: 'PE', name: 'Per\u00fa', dial: '+51' },
  { code: 'PA', name: 'Panam\u00e1', dial: '+507' },
  { code: 'CR', name: 'Costa Rica', dial: '+506' },
  { code: 'EC', name: 'Ecuador', dial: '+593' },
  { code: 'UY', name: 'Uruguay', dial: '+598' },
  { code: 'GT', name: 'Guatemala', dial: '+502' },
  { code: 'SV', name: 'El Salvador', dial: '+503' },
  { code: 'HN', name: 'Honduras', dial: '+504' },
  { code: 'NI', name: 'Nicaragua', dial: '+505' },
  { code: 'DO', name: 'Rep. Dominicana', dial: '+1' },
  { code: 'BO', name: 'Bolivia', dial: '+591' },
  { code: 'PY', name: 'Paraguay', dial: '+595' },
  { code: 'VE', name: 'Venezuela', dial: '+58' },
  { code: 'US', name: 'Estados Unidos', dial: '+1' },
  { code: 'ES', name: 'Espa\u00f1a', dial: '+34' },
];

export default function ContactForm({ lang }: ContactFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState('CO');

  const contactTypes = [
    { value: 'order', label: t(lang, 'contact.type.order') },
    { value: 'budget', label: t(lang, 'contact.type.budget') },
    { value: 'info', label: t(lang, 'contact.type.info') },
    { value: 'charger', label: t(lang, 'contact.type.charger') },
    { value: 'general', label: t(lang, 'contact.type.general') },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('fullName'),
          email: formData.get('email'),
          phone: `${formData.get('countryCode')} ${formData.get('phone')}`,
          contactType: formData.get('contactType'),
          message: formData.get('message'),
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
      <section className="contact-section">
        <div className="bg-effects">
          <div className="bg-gradient"></div>
          <div className="bg-grid"></div>
          <div className="floating-orbs"><div className="orb orb-1"></div><div className="orb orb-2"></div></div>
        </div>

        <div className="contact-container">
          <div className="contact-info">
            <span className="contact-badge"><span className="badge-dot"></span>{t(lang, 'contact.title')}</span>
            <h1 className="contact-title">{t(lang, 'contact.title')}</h1>
            <p className="contact-subtitle">{t(lang, 'contact.subtitle')}</p>
            <div className="contact-channels">
              <div className="channel-item">
                <div className="channel-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" stroke="currentColor" strokeWidth="2"/></svg></div>
                <div><span className="channel-label">Email</span><span className="channel-value">info@ancestro.ai</span></div>
              </div>
              <div className="channel-item">
                <div className="channel-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="2"/></svg></div>
                <div><span className="channel-label">Web</span><span className="channel-value">ancestro.ai</span></div>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            {!isSuccess ? (
              <div className="form-card">
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke="currentColor" strokeWidth="2"/><rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="2"/></svg>{t(lang, 'contact.type')} *</label>
                    <div className="select-wrapper">
                      <select name="contactType" required>
                        <option value="">{t(lang, 'contact.type')}</option>
                        {contactTypes.map((ct) => (<option key={ct.value} value={ct.value}>{ct.label}</option>))}
                      </select>
                      <span className="select-arrow"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/></svg>{t(lang, 'contact.name')} *</label>
                    <input type="text" name="fullName" placeholder={t(lang, 'contact.name')} required autoComplete="name" />
                  </div>
                  <div className="form-group">
                    <label><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" stroke="currentColor" strokeWidth="2"/></svg>{t(lang, 'contact.email')} *</label>
                    <input type="email" name="email" placeholder={t(lang, 'contact.emailPlaceholder')} required autoComplete="email" />
                  </div>
                  <div className="form-group">
                    <label><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2"/></svg>{t(lang, 'contact.phone')}</label>
                    <div className="phone-input-group">
                      <div className="country-select-wrapper">
                        <span className="country-flag">{getFlagEmoji(selectedCountryCode)}</span>
                        <select name="countryCode" onChange={(e) => { const opt = e.target.options[e.target.selectedIndex]; setSelectedCountryCode(opt.getAttribute('data-code') || 'CO'); }}>
                          {countries.map((c) => (<option key={c.code + c.dial} value={c.dial} data-code={c.code}>{getFlagEmoji(c.code)} {c.dial} {c.name}</option>))}
                        </select>
                        <span className="select-arrow"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></span>
                      </div>
                      <input type="tel" name="phone" placeholder="300 123 4567" autoComplete="tel-national" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/></svg>{t(lang, 'contact.message')} *</label>
                    <textarea name="message" rows={4} placeholder={t(lang, 'contact.messagePlaceholder')} required></textarea>
                  </div>
                  <button type="submit" className={`submit-btn ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                    <span className="btn-text">{t(lang, 'contact.submit')}</span>
                    <span className="btn-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                    {isLoading && <span className="btn-loader"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="spinner"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="60" strokeDashoffset="20"/></svg></span>}
                  </button>
                </form>
                <div className="form-footer"><div className="security-note"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2"/></svg><span>{t(lang, 'contact.security')}</span></div></div>
              </div>
            ) : (
              <div className="success-message visible">
                <div className="success-icon"><svg width="60" height="60" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                <h3>{t(lang, 'contact.success')}</h3>
              </div>
            )}
          </div>
        </div>
      </section>

      <style>{`
        .contact-section{position:relative;z-index:1;padding:80px 20px;min-height:calc(100vh - 79px);display:flex;align-items:center}
        .bg-effects{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden}
        .bg-gradient{position:absolute;top:-30%;left:50%;transform:translateX(-50%);width:150%;height:80%;background:radial-gradient(ellipse at center,rgba(248,176,59,0.10) 0%,transparent 60%)}
        .bg-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(248,176,59,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(248,176,59,0.03) 1px,transparent 1px);background-size:80px 80px;mask-image:radial-gradient(ellipse at center top,black 20%,transparent 70%)}
        .floating-orbs{position:absolute;inset:0}
        .orb{position:absolute;border-radius:50%;filter:blur(80px);opacity:0.35;animation:float 20s ease-in-out infinite}
        .orb-1{width:350px;height:350px;background:rgba(248,176,59,0.3);top:15%;left:10%}
        .orb-2{width:250px;height:250px;background:rgba(248,176,59,0.2);top:55%;right:10%;animation-delay:-7s}
        @keyframes float{0%,100%{transform:translate(0,0) scale(1)}25%{transform:translate(30px,-30px) scale(1.05)}50%{transform:translate(-20px,20px) scale(0.95)}75%{transform:translate(20px,30px) scale(1.02)}}
        .contact-container{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1.1fr;gap:80px;align-items:start;position:relative;z-index:1}
        .contact-badge{display:inline-flex;align-items:center;gap:10px;padding:10px 20px;background:rgba(248,176,59,0.1);border:1px solid rgba(248,176,59,0.3);border-radius:50px;color:var(--color-primary);font-size:14px;font-weight:600;margin-bottom:30px}
        .badge-dot{width:8px;height:8px;background:var(--color-primary);border-radius:50%;animation:pulse 2s ease-in-out infinite}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.2)}}
        .contact-title{font-size:clamp(36px,5vw,52px);font-weight:700;color:var(--color-white);line-height:1.1;margin-bottom:18px}
        .contact-subtitle{font-size:clamp(16px,1.8vw,18px);color:var(--color-gray);line-height:1.7;margin-bottom:40px}
        .contact-channels{display:flex;flex-direction:column;gap:16px}
        .channel-item{display:flex;align-items:center;gap:16px;padding:16px 20px;background:rgba(255,255,255,0.03);border:1px solid var(--color-white-10);border-radius:14px;transition:all 0.3s ease}
        .channel-item:hover{border-color:rgba(248,176,59,0.3);background:rgba(248,176,59,0.05)}
        .channel-icon{color:var(--color-primary);flex-shrink:0}
        .channel-label{display:block;font-size:12px;color:var(--color-gray);text-transform:uppercase;letter-spacing:0.05em}
        .channel-value{display:block;font-size:16px;color:var(--color-white);font-weight:500}
        .form-card{background:rgba(255,255,255,0.03);border:1px solid var(--color-white-10);border-radius:24px;padding:40px;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}
        .contact-form{display:flex;flex-direction:column;gap:22px}
        .form-group{position:relative}
        .form-group label{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:500;color:var(--color-white);margin-bottom:10px}
        .form-group label svg{color:var(--color-gray);transition:color 0.3s ease}
        .form-group input,.form-group select,.form-group textarea{width:100%;padding:16px 18px;background:rgba(255,255,255,0.05);border:2px solid var(--color-white-10);border-radius:14px;color:var(--color-white);font-size:16px;font-family:inherit;transition:all 0.3s ease;box-sizing:border-box}
        .form-group textarea{resize:vertical;min-height:100px}
        .form-group input::placeholder,.form-group textarea::placeholder{color:var(--color-gray)}
        .form-group input:focus,.form-group select:focus,.form-group textarea:focus{outline:none;border-color:var(--color-primary);background:rgba(248,176,59,0.05);box-shadow:0 0 0 4px rgba(248,176,59,0.1)}
        .form-group select{cursor:pointer;appearance:none}
        .form-group select option{background:#1a1a1a;color:#f5f0e6}
        .select-wrapper,.country-select-wrapper{position:relative}
        .select-arrow{position:absolute;right:16px;top:50%;transform:translateY(-50%);color:var(--color-gray);pointer-events:none}
        .phone-input-group{display:flex;gap:12px}
        .country-select-wrapper{flex-shrink:0;min-width:200px;display:flex;align-items:center;gap:8px}
        .country-select-wrapper .country-flag{font-size:1.5rem;line-height:1;flex-shrink:0;width:32px;text-align:center}
        .country-select-wrapper select{flex:1;min-width:0;padding-left:10px;padding-right:32px}
        .phone-input-group input{flex:1}
        .submit-btn{position:relative;display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:18px 24px;background:linear-gradient(135deg,var(--color-primary) 0%,#e9a235 100%);border:none;border-radius:14px;color:var(--color-black);font-size:17px;font-weight:700;font-family:inherit;cursor:pointer;overflow:hidden;transition:all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)}
        .submit-btn:hover{transform:translateY(-3px);box-shadow:0 10px 40px rgba(248,176,59,0.4)}
        .submit-btn.loading .btn-text,.submit-btn.loading .btn-icon{opacity:0}
        .btn-loader{position:absolute}
        .spinner{animation:spin 1s linear infinite}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .form-footer{margin-top:18px;text-align:center}
        .security-note{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--color-gray)}
        .contact-form-container{position:relative}
        .success-message{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px;background:rgba(255,255,255,0.03);border:1px solid var(--color-white-10);border-radius:24px;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}
        .success-message.visible{animation:fadeIn 0.5s ease}
        @keyframes fadeIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
        .success-icon{color:#4ade80;margin-bottom:24px}
        .success-message h3{font-size:24px;font-weight:700;color:var(--color-white)}
        @media(max-width:1024px){.contact-container{grid-template-columns:1fr;gap:50px}.contact-info{text-align:center}.contact-channels{max-width:400px;margin:0 auto}}
        @media(max-width:600px){.contact-section{padding:40px 16px}.form-card{padding:28px 20px}.phone-input-group{flex-direction:column}.country-select-wrapper{width:100%;min-width:0}}
      `}</style>
    </>
  );
}
