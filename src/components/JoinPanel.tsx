'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { t } from '@/i18n/translations';

type ProfileType = 'investor' | 'strategic' | 'installer' | 'energy' | 'logistics' | 'advisor' | 'government' | 'host' | 'supplier';

interface Profile {
  id: ProfileType;
  icon: string;
  labelKey: string;
  descKey: string;
  featured?: boolean;
}

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_INVEST_URL || 'https://calendly.com/ancestro/invest';

const profiles: Profile[] = [
  { id: 'investor', icon: '\u{1F4C8}', labelKey: 'join.profile.investor', descKey: 'join.profile.investor.desc', featured: true },
  { id: 'strategic', icon: '\u{1F91D}', labelKey: 'join.profile.strategic', descKey: 'join.profile.strategic.desc' },
  { id: 'installer', icon: '\u{1F527}', labelKey: 'join.profile.installer', descKey: 'join.profile.installer.desc' },
  { id: 'energy', icon: '\u26A1', labelKey: 'join.profile.energy', descKey: 'join.profile.energy.desc' },
  { id: 'logistics', icon: '\u{1F69B}', labelKey: 'join.profile.logistics', descKey: 'join.profile.logistics.desc' },
  { id: 'advisor', icon: '\u{1F9E0}', labelKey: 'join.profile.advisor', descKey: 'join.profile.advisor.desc' },
  { id: 'government', icon: '\u{1F3DB}', labelKey: 'join.profile.government', descKey: 'join.profile.government.desc' },
  { id: 'host', icon: '\u{1F3E0}', labelKey: 'join.profile.host', descKey: 'join.profile.host.desc' },
  { id: 'supplier', icon: '\u{1F4E6}', labelKey: 'join.profile.supplier', descKey: 'join.profile.supplier.desc' },
];

const investmentRanges = [
  'join.form.investment.range1',
  'join.form.investment.range2',
  'join.form.investment.range3',
  'join.form.investment.range4',
  'join.form.investment.range5',
];

const WIZARD_STEPS = ['profile', 'contact', 'details', 'done'] as const;
type WizardStep = (typeof WIZARD_STEPS)[number];

interface FormData {
  profile: ProfileType | null;
  name: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  city: string;
  investment: string;
  experience: string;
  message: string;
  terms: boolean;
}

const initialFormData: FormData = {
  profile: null,
  name: '',
  email: '',
  phone: '',
  company: '',
  country: '',
  city: '',
  investment: '',
  experience: '',
  message: '',
  terms: false,
};

export default function JoinPanel({ lang }: { lang: string }) {
  const [step, setStep] = useState<WizardStep>('profile');
  const [form, setForm] = useState<FormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const sectionRef = useRef<HTMLDivElement>(null);

  const stepIndex = WIZARD_STEPS.indexOf(step);
  const isInvestor = form.profile === 'investor';

  // Auto-select profile from URL ?profile=investor (client-only)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlProfile = params.get('profile') as ProfileType | null;
      if (urlProfile && profiles.some(p => p.id === urlProfile)) {
        setForm(prev => ({ ...prev, profile: urlProfile }));
        setTimeout(() => setStep('contact'), 0);
      }
    }
  }, []);

  const scrollToSection = useCallback(() => {
    setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  const updateField = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm(prev => (prev[key] === value ? prev : { ...prev, [key]: value }));
    setErrors(prev => (prev[key] ? { ...prev, [key]: false } : prev));
  }, []);

  function handleSelectProfile(id: ProfileType) {
    updateField('profile', id);
    setStep('contact');
    scrollToSection();
  }

  function validateContact(): boolean {
    const errs: Partial<Record<keyof FormData, boolean>> = {};
    if (!form.name.trim()) errs.name = true;
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = true;
    if (!form.phone.trim()) errs.phone = true;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateDetails(): boolean {
    const errs: Partial<Record<keyof FormData, boolean>> = {};
    if (!form.country.trim()) errs.country = true;
    if (isInvestor && !form.investment) errs.investment = true;
    if (!form.terms) errs.terms = true;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function goNext() {
    if (step === 'contact') {
      if (!validateContact()) return;
      setStep('details');
      scrollToSection();
    }
  }

  function goBack() {
    if (step === 'contact') {
      setStep('profile');
    } else if (step === 'details') {
      setStep('contact');
      scrollToSection();
    } else if (step === 'done') {
      setForm(initialFormData);
      setStep('profile');
    }
  }

  async function handleSubmit() {
    if (!validateDetails()) return;
    setSubmitting(true);

    const data = {
      profile: form.profile,
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: form.company,
      country: form.country,
      city: form.city,
      investment: form.investment,
      experience: form.experience,
      message: form.message,
      lang,
    };

    async function postOnce(): Promise<{ ok: boolean; body: { db?: boolean; airtable?: boolean; error?: string } }> {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      return { ok: res.ok, body };
    }

    const MAX_ATTEMPTS = 3;
    let lastError: unknown = null;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const { ok, body } = await postOnce();

        if (!ok) {
          console.error('[Join] HTTP error', { attempt, body });
          if (attempt < MAX_ATTEMPTS) {
            await new Promise(r => setTimeout(r, 500 * attempt));
            continue;
          }
          alert(t(lang, 'join.form.error'));
          return;
        }

        if (body.db === false && body.airtable === false) {
          console.error('[Join] Both sinks failed', body);
          if (attempt < MAX_ATTEMPTS) {
            await new Promise(r => setTimeout(r, 500 * attempt));
            continue;
          }
          alert(t(lang, 'join.form.error'));
          return;
        }

        if (body.db === false || body.airtable === false) {
          console.warn('[Join] Partial success', { db: body.db, airtable: body.airtable });
        }

        // Clear any previously saved offline submission for this email.
        try { localStorage.removeItem(`join:pending:${form.email}`); } catch {}

        setStep('done');
        scrollToSection();
        return;
      } catch (err) {
        lastError = err;
        console.error('[Join] Network error', { attempt, err });
        if (attempt < MAX_ATTEMPTS) {
          await new Promise(r => setTimeout(r, 500 * attempt));
          continue;
        }
      } finally {
        if (attempt === MAX_ATTEMPTS) setSubmitting(false);
      }
    }

    // All attempts exhausted — persist locally so the user doesn't lose their input.
    try {
      localStorage.setItem(
        `join:pending:${form.email}`,
        JSON.stringify({ data, savedAt: new Date().toISOString(), lastError: String(lastError) })
      );
      console.warn('[Join] Saved submission to localStorage — will retry on next load');
    } catch (storageErr) {
      console.error('[Join] Could not persist to localStorage', storageErr);
    }

    alert(t(lang, 'join.form.error'));
    setSubmitting(false);
  }

  const stepLabels = [
    t(lang, 'join.wizard.step1'),
    t(lang, 'join.wizard.step2'),
    t(lang, 'join.wizard.step3'),
    t(lang, 'join.wizard.step4'),
  ];

  return (
    <>
      <section className="join-page">
        {/* Hero */}
        <div className="join-hero">
          <span className="join-badge">{t(lang, 'join.hero.badge')}</span>
          <h1 className="join-hero-title">{t(lang, 'join.hero.title')}</h1>
          <p className="join-hero-sub">{t(lang, 'join.hero.subtitle')}</p>
          <div className="join-stats">
            <div className="stat"><span className="stat-num">18+</span><span className="stat-label">{t(lang, 'join.stats.countries')}</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">200+</span><span className="stat-label">{t(lang, 'join.stats.partners')}</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">$5M+</span><span className="stat-label">{t(lang, 'join.stats.invested')}</span></div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="wizard-steps" ref={sectionRef}>
          {stepLabels.map((label, i) => (
            <div key={i} className={`wizard-step ${i < stepIndex ? 'completed' : ''} ${i === stepIndex ? 'active' : ''}`}>
              <div className="wizard-dot">
                {i < stepIndex ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              <span className="wizard-label">{label}</span>
              {i < stepLabels.length - 1 && <div className={`wizard-line ${i < stepIndex ? 'filled' : ''}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Profile Selection */}
        {step === 'profile' && (
          <div className="join-section">
            <h2 className="section-title">{t(lang, 'join.select.title')}</h2>
            <div className="profile-grid">
              {profiles.map((p) => (
                <button
                  key={p.id}
                  className={`profile-card ${p.featured ? 'featured' : ''} ${form.profile === p.id ? 'selected' : ''}`}
                  onClick={() => handleSelectProfile(p.id)}
                >
                  {p.featured && <span className="card-tag">{t(lang, 'join.profile.investor.tag')}</span>}
                  <span className="card-icon">{p.icon}</span>
                  <h3 className="card-title">{t(lang, p.labelKey)}</h3>
                  <p className="card-desc">{t(lang, p.descKey)}</p>
                  <span className="card-arrow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Contact Info */}
        {step === 'contact' && (
          <div className="join-section">
            <div className="form-header">
              <span className="form-profile-badge">
                {profiles.find(p => p.id === form.profile)?.icon} {t(lang, profiles.find(p => p.id === form.profile)?.labelKey || '')}
              </span>
              <h2 className="section-title">{t(lang, 'join.wizard.contactTitle')}</h2>
              <p className="form-subtitle">{t(lang, 'join.wizard.contactSubtitle')}</p>
            </div>

            <div className="join-form">
              <div className="form-grid">
                <div className={`form-field ${errors.name ? 'has-error' : ''}`}>
                  <label>{t(lang, 'join.form.name')} *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => updateField('name', e.target.value)}
                    required
                  />
                </div>
                <div className={`form-field ${errors.email ? 'has-error' : ''}`}>
                  <label>{t(lang, 'join.form.email')} *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => updateField('email', e.target.value)}
                    required
                  />
                </div>
                <div className={`form-field ${errors.phone ? 'has-error' : ''}`}>
                  <label>{t(lang, 'join.form.phone')} *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => updateField('phone', e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>{t(lang, 'join.form.company')}</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={e => updateField('company', e.target.value)}
                  />
                </div>
              </div>

              <div className="wizard-nav">
                <button className="back-btn" type="button" onClick={goBack}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {t(lang, 'join.wizard.back')}
                </button>
                <button className="next-btn" type="button" onClick={goNext}>
                  {t(lang, 'join.wizard.next')}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Details */}
        {step === 'details' && (
          <div className="join-section">
            <div className="form-header">
              <span className="form-profile-badge">
                {profiles.find(p => p.id === form.profile)?.icon} {t(lang, profiles.find(p => p.id === form.profile)?.labelKey || '')}
              </span>
              <h2 className="section-title">{t(lang, 'join.wizard.detailsTitle')}</h2>
              <p className="form-subtitle">{t(lang, 'join.wizard.detailsSubtitle')}</p>
            </div>

            <div className="join-form">
              <div className="form-grid">
                <div className={`form-field ${errors.country ? 'has-error' : ''}`}>
                  <label>{t(lang, 'join.form.country')} *</label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={e => updateField('country', e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>{t(lang, 'join.form.city')}</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={e => updateField('city', e.target.value)}
                  />
                </div>

                {isInvestor && (
                  <div className={`form-field full-width ${errors.investment ? 'has-error' : ''}`}>
                    <label>{t(lang, 'join.form.investment')} *</label>
                    <select
                      value={form.investment}
                      onChange={e => updateField('investment', e.target.value)}
                      required
                    >
                      <option value="">{t(lang, 'join.form.investment.placeholder')}</option>
                      {investmentRanges.map((key) => (
                        <option key={key} value={t(lang, key)}>{t(lang, key)}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-field full-width">
                  <label>{t(lang, 'join.form.experience')}</label>
                  <textarea
                    value={form.experience}
                    onChange={e => updateField('experience', e.target.value)}
                    rows={3}
                    placeholder={t(lang, 'join.form.experience.placeholder')}
                  />
                </div>
                <div className="form-field full-width">
                  <label>{t(lang, 'join.form.message')}</label>
                  <textarea
                    value={form.message}
                    onChange={e => updateField('message', e.target.value)}
                    rows={3}
                    placeholder={t(lang, 'join.form.message.placeholder')}
                  />
                </div>
              </div>

              <div className="form-footer">
                <label className={`terms-check ${errors.terms ? 'has-error' : ''}`}>
                  <input
                    type="checkbox"
                    checked={form.terms}
                    onChange={e => updateField('terms', e.target.checked)}
                  />
                  <span>{t(lang, 'join.form.terms')} <a href={`/${lang}/coming-soon`} className="terms-link">{t(lang, 'join.form.termsLink')}</a></span>
                </label>
              </div>

              <div className="wizard-nav">
                <button className="back-btn" type="button" onClick={goBack}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {t(lang, 'join.wizard.back')}
                </button>
                <button className="submit-btn" type="button" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? '...' : isInvestor ? t(lang, 'join.form.submitInvestor') : t(lang, 'join.form.submit')}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Success / Calendly */}
        {step === 'done' && !isInvestor && (
          <div className="join-section">
            <div className="success-card">
              <div className="success-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h2 className="success-title">{t(lang, 'join.form.success')}</h2>
              <p className="success-sub">{t(lang, 'join.wizard.successSubtitle')}</p>
              <button className="back-btn" onClick={goBack}>
                {t(lang, 'join.wizard.startOver')}
              </button>
            </div>
          </div>
        )}

        {step === 'done' && isInvestor && (
          <div className="join-section">
            <div className="calendly-section">
              <div className="calendly-header">
                <span className="calendly-icon">{'\u{1F4C5}'}</span>
                <h2 className="section-title">{t(lang, 'join.calendly.title')}</h2>
                <p className="calendly-sub">{t(lang, 'join.calendly.subtitle')}</p>
              </div>
              <div className="calendly-embed">
                <iframe
                  src={`${CALENDLY_URL}?hide_gdpr_banner=1&background_color=0e0e0e&text_color=ffffff&primary_color=f8b03b`}
                  width="100%"
                  height="660"
                  frameBorder="0"
                  title="Calendly"
                />
              </div>
              <button className="back-btn" onClick={goBack}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {t(lang, 'join.wizard.startOver')}
              </button>
            </div>
          </div>
        )}
      </section>

      <style>{`
        .join-page{padding:120px 20px 80px;max-width:1200px;margin:0 auto;min-height:100vh}

        .join-hero{text-align:center;margin-bottom:48px;display:flex;flex-direction:column;align-items:center;gap:16px}
        .join-badge{display:inline-block;padding:6px 16px;border-radius:20px;background:rgba(248,176,59,0.12);border:1px solid rgba(248,176,59,0.25);color:#f8b03b;font-size:12px;font-weight:700;letter-spacing:2px}
        .join-hero-title{font-size:clamp(36px,6vw,64px);font-weight:700;color:#fff;line-height:1.1;margin:0}
        .join-hero-sub{font-size:clamp(15px,1.5vw,18px);color:rgba(255,255,255,0.6);max-width:600px;line-height:1.6;margin:0}
        .join-stats{display:flex;align-items:center;gap:24px;margin-top:16px;padding:20px 32px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px}
        .stat{display:flex;flex-direction:column;align-items:center;gap:4px}
        .stat-num{font-size:28px;font-weight:700;color:#f8b03b}
        .stat-label{font-size:13px;color:rgba(255,255,255,0.5);font-weight:500}
        .stat-divider{width:1px;height:36px;background:rgba(255,255,255,0.1)}

        /* Wizard Steps Indicator */
        .wizard-steps{display:flex;align-items:center;justify-content:center;gap:0;margin-bottom:48px;padding:0 20px;scroll-margin-top:120px}
        .wizard-step{display:flex;align-items:center;gap:8px;position:relative}
        .wizard-dot{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:rgba(255,255,255,0.35);background:rgba(255,255,255,0.06);border:2px solid rgba(255,255,255,0.1);transition:all 0.3s ease;flex-shrink:0}
        .wizard-step.active .wizard-dot{background:rgba(248,176,59,0.15);border-color:#f8b03b;color:#f8b03b}
        .wizard-step.completed .wizard-dot{background:#f8b03b;border-color:#f8b03b;color:#000}
        .wizard-label{font-size:13px;font-weight:600;color:rgba(255,255,255,0.35);white-space:nowrap;transition:color 0.3s ease}
        .wizard-step.active .wizard-label{color:#f8b03b}
        .wizard-step.completed .wizard-label{color:rgba(255,255,255,0.7)}
        .wizard-line{width:40px;height:2px;background:rgba(255,255,255,0.1);margin:0 12px;flex-shrink:0;transition:background 0.3s ease}
        .wizard-line.filled{background:#f8b03b}

        .join-section{margin-bottom:60px;animation:sectionIn 0.4s ease-out}
        @keyframes sectionIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .section-title{font-size:clamp(24px,3vw,36px);font-weight:700;color:#fff;text-align:center;margin:0 0 8px}

        .profile-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        .profile-grid .profile-card:first-child{grid-column:1/-1;display:grid;grid-template-columns:auto 1fr auto;grid-template-rows:auto auto;column-gap:20px;align-items:center;padding:32px 36px}
        .profile-grid .profile-card:first-child .card-icon{grid-row:1/3;font-size:48px}
        .profile-grid .profile-card:first-child .card-title{font-size:22px;margin:0}
        .profile-grid .profile-card:first-child .card-desc{grid-column:2;font-size:15px;margin:0}
        .profile-grid .profile-card:first-child .card-arrow{grid-row:1/3;grid-column:3}
        .profile-grid .profile-card:first-child .card-tag{position:absolute;top:16px;right:16px}

        .profile-card{position:relative;display:flex;flex-direction:column;gap:12px;padding:28px 24px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:16px;cursor:pointer;transition:all 0.3s cubic-bezier(0.25,0.46,0.45,0.94);text-align:left;font-family:inherit;color:#fff}
        .profile-card:hover{background:rgba(255,255,255,0.07);border-color:rgba(255,255,255,0.2);transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,0.3)}
        .profile-card.featured{border-color:rgba(248,176,59,0.3);background:rgba(248,176,59,0.06)}
        .profile-card.featured:hover{border-color:rgba(248,176,59,0.5);background:rgba(248,176,59,0.1);box-shadow:0 12px 40px rgba(248,176,59,0.15)}
        .profile-card.selected{border-color:#f8b03b;background:rgba(248,176,59,0.12)}
        .card-tag{display:inline-block;padding:4px 10px;border-radius:8px;background:rgba(248,176,59,0.2);color:#f8b03b;font-size:11px;font-weight:700;letter-spacing:0.5px;width:fit-content}
        .card-icon{font-size:36px;line-height:1}
        .card-title{font-size:18px;font-weight:600;color:#fff;margin:0}
        .card-desc{font-size:13px;color:rgba(255,255,255,0.55);line-height:1.5;margin:0}
        .card-arrow{color:rgba(255,255,255,0.3);transition:all 0.3s ease;margin-top:auto;align-self:flex-end}
        .profile-card:hover .card-arrow{color:#f8b03b;transform:translateX(4px)}

        .back-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 18px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:12px;color:rgba(255,255,255,0.7);font-size:14px;cursor:pointer;transition:all 0.2s ease;font-family:inherit}
        .back-btn:hover{background:rgba(255,255,255,0.1);color:#fff}

        .form-header{display:flex;flex-direction:column;align-items:center;gap:12px;margin-bottom:24px}
        .form-profile-badge{display:inline-flex;align-items:center;gap:8px;padding:8px 16px;border-radius:12px;background:rgba(248,176,59,0.1);border:1px solid rgba(248,176,59,0.2);color:#f8b03b;font-size:14px;font-weight:600}
        .form-subtitle{font-size:15px;color:rgba(255,255,255,0.5);text-align:center;margin:0;max-width:500px}

        .join-form{max-width:720px;margin:0 auto}
        .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
        .form-field{display:flex;flex-direction:column;gap:6px}
        .form-field.full-width{grid-column:1/-1}
        .form-field label{font-size:13px;font-weight:600;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:0.5px}
        .form-field input,.form-field select,.form-field textarea{padding:14px 16px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);border-radius:12px;color:#fff;font-size:15px;font-family:inherit;outline:none;transition:border-color 0.2s ease;-webkit-appearance:none}
        .form-field input:focus,.form-field select:focus,.form-field textarea:focus{border-color:rgba(248,176,59,0.4)}
        .form-field input::placeholder,.form-field textarea::placeholder{color:rgba(255,255,255,0.25)}
        .form-field select{cursor:pointer}
        .form-field select option{background:#1a1a1a;color:#fff}
        .form-field textarea{resize:vertical;min-height:80px}
        .form-field.has-error input,.form-field.has-error select,.form-field.has-error textarea{border-color:rgba(239,68,68,0.6)}
        .form-field.has-error label{color:rgba(239,68,68,0.8)}

        .form-footer{margin-top:24px}
        .terms-check{display:flex;align-items:flex-start;gap:10px;font-size:14px;color:rgba(255,255,255,0.6);cursor:pointer}
        .terms-check.has-error{color:rgba(239,68,68,0.8)}
        .terms-check input[type=checkbox]{width:18px;height:18px;accent-color:#f8b03b;cursor:pointer;flex-shrink:0;margin-top:2px}
        .terms-link{color:#f8b03b;text-decoration:none}
        .terms-link:hover{text-decoration:underline}

        .wizard-nav{display:flex;justify-content:space-between;align-items:center;margin-top:32px;gap:16px}
        .next-btn{display:inline-flex;align-items:center;gap:10px;padding:14px 28px;background:rgba(248,176,59,0.15);color:#f8b03b;font-size:16px;font-weight:700;border:1px solid rgba(248,176,59,0.3);border-radius:14px;cursor:pointer;transition:all 0.3s ease;font-family:inherit}
        .next-btn:hover{background:rgba(248,176,59,0.25);border-color:rgba(248,176,59,0.5);transform:translateY(-2px);box-shadow:0 8px 24px rgba(248,176,59,0.15)}
        .submit-btn{display:inline-flex;align-items:center;gap:10px;padding:14px 28px;background:#f8b03b;color:#000;font-size:16px;font-weight:700;border:none;border-radius:14px;cursor:pointer;transition:all 0.3s ease;font-family:inherit}
        .submit-btn:hover:not(:disabled){background:#ffbe4d;transform:translateY(-2px);box-shadow:0 8px 24px rgba(248,176,59,0.3)}
        .submit-btn:disabled{opacity:0.5;cursor:not-allowed}

        .success-card{display:flex;flex-direction:column;align-items:center;gap:20px;padding:60px 40px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:20px;text-align:center}
        .success-icon{width:64px;height:64px;border-radius:50%;background:rgba(74,222,128,0.15);border:2px solid rgba(74,222,128,0.4);display:flex;align-items:center;justify-content:center;color:#4ade80}
        .success-title{font-size:20px;font-weight:600;color:#fff;margin:0}
        .success-sub{font-size:15px;color:rgba(255,255,255,0.5);max-width:400px;line-height:1.5;margin:0}

        .calendly-section{display:flex;flex-direction:column;align-items:center;gap:24px}
        .calendly-header{text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px}
        .calendly-icon{font-size:48px}
        .calendly-sub{font-size:15px;color:rgba(255,255,255,0.55);max-width:500px;line-height:1.5;margin:0}
        .calendly-embed{width:100%;max-width:720px;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.1)}
        .calendly-embed iframe{display:block}

        @media(max-width:900px){.profile-grid{grid-template-columns:1fr 1fr}.profile-grid .profile-card:first-child{grid-column:1/-1;grid-template-columns:auto 1fr;grid-template-rows:auto auto auto}.profile-grid .profile-card:first-child .card-arrow{grid-column:2;justify-self:end}.wizard-label{display:none}.wizard-line{width:24px;margin:0 4px}}
        @media(max-width:600px){.join-page{padding:100px 16px 60px}.join-hero{margin-bottom:32px}.join-stats{flex-direction:row;gap:16px;padding:16px 20px}.stat-num{font-size:22px}.stat-divider{width:1px;height:28px}.profile-grid{grid-template-columns:1fr}.profile-grid .profile-card:first-child{display:flex;flex-direction:column}.form-grid{grid-template-columns:1fr}.wizard-nav{flex-direction:column-reverse;align-items:stretch}.next-btn,.submit-btn{justify-content:center}.back-btn{justify-content:center}.calendly-embed iframe{height:550px}}
      `}</style>
    </>
  );
}
