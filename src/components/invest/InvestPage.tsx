'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchKycStatus, type KycStatus } from '@/lib/kyc';
import InvestorOnboarding from '@/components/kyc/InvestorOnboarding';

interface InvestPageProps {
  lang: string;
}

/* ── Data ── */

const INVESTMENT = {
  sharePrice: '$1.00',
  valuation: '$25M',
};

const deepDivePanels = [
  {
    id: 'why-we-win',
    title: 'Why Ancestro Is Inevitable',
    content:
      'We are building infrastructure first. Revenue follows infrastructure. The platform model is capital-light and infinitely replicable.',
    items: [
      { label: 'Platform Model', desc: 'Asset-light vs. asset-heavy competitors' },
      { label: 'First Mover', desc: 'First in emerging renewable markets across 18 countries' },
      { label: 'Multi-Vertical', desc: 'Solar, batteries, charging, vehicles, lifestyle' },
      { label: 'Network Effects', desc: 'Each new participant strengthens the whole ecosystem' },
    ],
  },
  {
    id: 'ancestro-world',
    title: 'Beyond Energy: The Ancestro World',
    content:
      'A modern tribe built on energy independence, personal sovereignty, health, purpose, and awakening. Those who enter Ancestro do not leave unchanged.',
    items: [
      { label: 'Social Platform', desc: 'Internal community for members' },
      { label: 'Ancestral Health', desc: 'Education and wellness protocols' },
      { label: 'Eco-Resorts', desc: 'Access to sustainable retreats' },
      { label: 'Rituals & Gatherings', desc: 'Global community experiences' },
    ],
  },
  {
    id: 'ancestro-coin',
    title: 'Ancestro Coin (ANC) & Carbon Strategy',
    content:
      'A digital asset backed by verified carbon credits \u2014 designed for ecosystem infrastructure, not speculation. Currently available at 33% presale discount.',
    items: [
      { label: 'Carbon Monetization', desc: 'Tokenize verified credits into liquid assets' },
      { label: 'Ecosystem Incentives', desc: 'Reward conservation and participation' },
      { label: 'Stakeholder Alignment', desc: 'Shared value for all participants' },
    ],
  },
  {
    id: 'philanthropy',
    title: 'Profit With Purpose',
    content:
      'Minimum 5% of net profits committed to regenerative initiatives. Impact is not an afterthought \u2014 it is embedded into the operating model.',
    items: [
      { label: 'Free Solar', desc: 'Off-grid installations for underserved communities' },
      { label: 'Amazon Reforestation', desc: 'Native species and rainforest preservation' },
      { label: 'Ocean Cleanup', desc: 'Plastic removal partnerships' },
    ],
  },
];

const funds = [
  { pct: 30, label: 'Platform Technology & Ops' },
  { pct: 25, label: 'Market Entry' },
  { pct: 20, label: 'Legal & Regulatory' },
  { pct: 15, label: 'Pre-Sales & Partners' },
  { pct: 10, label: 'Infrastructure' },
];

const terms = [
  { key: 'Entity', val: 'Delaware C-Corp', gold: false },
  { key: 'Instrument', val: 'SAFE agreement', gold: false },
  { key: 'Share Price', val: INVESTMENT.sharePrice, gold: true },
  { key: 'Valuation', val: INVESTMENT.valuation, gold: true },
  { key: 'Transfer', val: 'Wire to U.S. account', gold: false },
  { key: 'Profile', val: 'Early-stage, high-asymmetry', gold: false },
];

const investmentTiers = [
  { value: '2,000-5,000', label: '$2,000 \u2013 $5,000' },
  { value: '5,000-20,000', label: '$5,000 \u2013 $20,000' },
  { value: '20,000-50,000', label: '$20,000 \u2013 $50,000' },
  { value: '50,000+', label: '$50,000+' },
];

/* ── Access Gate ── */
const ACCESS_HASH = 'fcfa5880';

function simpleHash(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return (h >>> 0).toString(16).slice(0, 8);
}

function AccessGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (simpleHash(password) === ACCESS_HASH) {
      if (typeof window !== 'undefined') sessionStorage.setItem('invest_access', '1');
      onUnlock();
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  }

  return (
    <>
      <div className="access-gate">
        <div className="access-gate-inner">
          <div className="access-gate-logo">
            <img src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/logo.svg`} alt="Ancestro" width={160} height={32} />
          </div>
          <div className="access-gate-lock">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 className="access-gate-title">Investor Access</h1>
          <p className="access-gate-subtitle">This page contains confidential investment information. Enter the access code to continue.</p>
          <form onSubmit={handleSubmit} className={`access-gate-form${shaking ? ' shake' : ''}`}>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Enter access code"
              className={`access-gate-input${error ? ' error' : ''}`}
              autoFocus
            />
            {error && <p className="access-gate-error">Invalid access code</p>}
            <button type="submit" className="access-gate-btn">
              <span>Unlock</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </form>
          <p className="access-gate-contact">Need access? Contact <a href="mailto:invest@ancestro.com">invest@ancestro.com</a></p>
        </div>
      </div>
      <style>{`
        .access-gate{position:fixed;inset:0;z-index:9999;background:#000;display:flex;align-items:center;justify-content:center;padding:20px}
        .access-gate-inner{max-width:420px;width:100%;display:flex;flex-direction:column;align-items:center;gap:24px;text-align:center}
        .access-gate-logo img{height:32px;width:auto;opacity:0.7}
        .access-gate-lock{color:var(--color-primary);opacity:0.8}
        .access-gate-title{font-size:28px;font-weight:700;color:#fff;margin:0}
        .access-gate-subtitle{font-size:15px;color:rgba(255,255,255,0.5);line-height:1.6;margin:0;max-width:340px}
        .access-gate-form{display:flex;flex-direction:column;gap:12px;width:100%}
        .access-gate-input{width:100%;padding:14px 18px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:12px;color:#fff;font-size:16px;font-family:var(--font-family);text-align:center;outline:none;transition:border-color 0.2s}
        .access-gate-input:focus{border-color:rgba(248,176,59,0.5)}
        .access-gate-input.error{border-color:#ef4444}
        .access-gate-error{color:#ef4444;font-size:13px;margin:0}
        .access-gate-btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:14px;background:var(--color-primary);color:#000;font-size:16px;font-weight:600;font-family:var(--font-family);border:none;border-radius:12px;cursor:pointer;transition:all 0.2s}
        .access-gate-btn:hover{background:#e9a235;transform:translateY(-1px)}
        .access-gate-contact{font-size:13px;color:rgba(255,255,255,0.35);margin:0}
        .access-gate-contact a{color:var(--color-primary);text-decoration:none}
        .shake{animation:shakeAnim 0.5s ease}
        @keyframes shakeAnim{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}
      `}</style>
    </>
  );
}

/* ── Component ── */

export default function InvestPage({ lang }: InvestPageProps) {
  /* access gate */
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('invest_access') === '1') {
      setUnlocked(true);
    }
  }, []);

  /* KYC state */
  const [kycStatus, setKycStatus] = useState<KycStatus>('not_started');

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('ancestro:token') : null;
    if (token) fetchKycStatus(token).then(setKycStatus);
  }, []);

  /* accordion state */
  const [openPanels, setOpenPanels] = useState<Record<string, boolean>>({});

  /* funds animation */
  const fundsRef = useRef<HTMLDivElement>(null);
  const [fundsVisible, setFundsVisible] = useState(false);

  /* final CTA animation */
  const finalCtaRef = useRef<HTMLElement>(null);
  const [ctaVisible, setCtaVisible] = useState(false);

  /* form state */
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', amount: '', message: '' });
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* intersection observers */
  useEffect(() => {
    if (!unlocked) return;
    const fundsEl = fundsRef.current;
    if (fundsEl) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              setFundsVisible(true);
              obs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      obs.observe(fundsEl);
      return () => obs.disconnect();
    }
  }, [unlocked]);

  useEffect(() => {
    if (!unlocked) return;
    const ctaEl = finalCtaRef.current;
    if (ctaEl) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              setCtaVisible(true);
              obs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.2 }
      );
      obs.observe(ctaEl);
      return () => obs.disconnect();
    }
  }, [unlocked]);

  const togglePanel = useCallback((id: string) => {
    setOpenPanels((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  if (!unlocked) return <AccessGate onUnlock={() => setUnlocked(true)} />;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (kycStatus !== 'verified') {
      alert(lang === 'es' ? 'Debes completar la verificacion de identidad antes de invertir.' : 'You must complete identity verification before investing.');
      return;
    }
    const errors: Record<string, boolean> = {};
    if (!formData.name.trim()) errors.name = true;
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = true;
    if (!formData.amount) errors.amount = true;
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/invest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Server error');
      setSubmitted(true);
    } catch {
      setSubmitting(false);
      alert('Error submitting form. Please try again.');
    }
  };

  return (
    <>
      {/* ═══════════ HERO ═══════════ */}
      <section className="invest-hero">
        <div className="hero-bg">
          <div className="hero-gradient"></div>
          <div className="hero-grid-lines"></div>
        </div>

        <div className="hero-inner">
          <div className="hero-accent-line"></div>

          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            <span>Delaware C-Corp</span>
            <span className="badge-sep"></span>
            <span>SAFE Agreement</span>
            <span className="badge-sep"></span>
            <span>SEC Compliant</span>
          </div>

          <h1 className="hero-title">
            Invest in the <span className="hero-title-gold">infrastructure</span>
            <br />
            of energy independence
          </h1>

          <p className="hero-subtitle">
            Ancestro is building the operating system for renewable energy adoption across 18 emerging markets.
            Capital-light. Platform-first. Inevitable.
          </p>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">{INVESTMENT.sharePrice}</span>
              <span className="stat-label">Share Price</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-value">{INVESTMENT.valuation}</span>
              <span className="stat-label">Pre-Money Valuation</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-value">18</span>
              <span className="stat-label">Target Markets</span>
            </div>
          </div>

          <div className="hero-ctas">
            <a href="#contact" className="cta-primary">
              <span>Invest Now</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a href="#deep-dive" className="cta-secondary">
              <span>Read the Thesis</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <div className="hero-proof">
            <span className="hero-proof-text">
              Joined by investors from <strong>12 countries</strong>
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════ THESIS ═══════════ */}
      <section className="invest-thesis">
        <div className="thesis-container">
          <span className="thesis-label">THE THESIS</span>
          <h2 className="thesis-heading">Two converging crises. One platform.</h2>

          <div className="thesis-grid">
            <div className="thesis-problem">
              <div className="thesis-card">
                <span className="card-tag">The Problem</span>
                <p className="card-text">
                  Energy adoption across LATAM is constrained by fragmented supply chains, zero coordination between
                  stakeholders, and no scalable platforms. Meanwhile, modern lifestyles drive chronic disease and
                  environmental collapse.
                </p>
                <div className="card-stats">
                  <div className="card-stat">
                    <span className="card-stat-val">650M</span>
                    <span className="card-stat-lbl">Underserved</span>
                  </div>
                  <div className="card-stat">
                    <span className="card-stat-val">$47B</span>
                    <span className="card-stat-lbl">Energy market</span>
                  </div>
                  <div className="card-stat">
                    <span className="card-stat-val">&lt;3%</span>
                    <span className="card-stat-lbl">Solar adoption</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="thesis-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>

            <div className="thesis-solution">
              <div className="thesis-card thesis-card--gold">
                <span className="card-tag card-tag--gold">The Solution</span>
                <p className="card-text">
                  Ancestro is a platform &mdash; not a contractor &mdash; connecting customers, installers,
                  distributors, and investors through a fintech layer. Capital-light, infinitely replicable, with
                  compounding network effects.
                </p>
                <div className="card-features">
                  <span>Copy-paste market entry</span>
                  <span>Multi-vertical expansion</span>
                  <span>First mover in 18 countries</span>
                  <span>Mission-driven brand moat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ ACCORDION / DEEP DIVE ═══════════ */}
      <section className="accordion-section" id="deep-dive">
        <div className="accordion-container">
          <span className="accordion-label">DEEP DIVE</span>
          <h2 className="accordion-heading">Explore the Details</h2>

          <div className="accordion-panels">
            {deepDivePanels.map((panel, i) => (
              <div key={panel.id} className={`panel ${openPanels[panel.id] ? 'panel--open' : ''}`}>
                <button
                  className="panel-trigger"
                  onClick={() => togglePanel(panel.id)}
                  aria-expanded={!!openPanels[panel.id]}
                  aria-controls={`panel-content-${panel.id}`}
                  type="button"
                >
                  <span className="panel-number">{String(i + 1).padStart(2, '0')}</span>
                  <span className="panel-title">{panel.title}</span>
                  <svg
                    className="panel-chevron"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {openPanels[panel.id] && (
                  <div className="panel-content" id={`panel-content-${panel.id}`}>
                    <p className="panel-text">{panel.content}</p>
                    {panel.items && panel.items.length > 0 && (
                      <ul className="panel-list">
                        {panel.items.map((item) => (
                          <li key={item.label}>
                            <strong>{item.label}</strong>
                            <span>{item.desc}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ INVEST NUMBERS ═══════════ */}
      <section className="invest-numbers" id="buy-stock">
        <div className="numbers-container">
          <span className="numbers-label">INVESTMENT DETAILS</span>
          <h2 className="numbers-heading">The Opportunity</h2>

          <div className="numbers-grid">
            {/* Left: Terms */}
            <div className="terms-block">
              <div className="block-title-row">
                <h3 className="block-title">Deal Terms</h3>
                <span className="verified-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Verified
                </span>
              </div>
              <div className="terms-list">
                {terms.map((term) => (
                  <div className="term-row" key={term.key}>
                    <span className="term-key">{term.key}</span>
                    <span className={`term-val${term.gold ? ' term-val--gold' : ''}`}>{term.val}</span>
                  </div>
                ))}
              </div>

              <div className="participation-row">
                <div className="part-option">
                  <span className="part-type">Passive</span>
                  <span className="part-desc">Capital allocation, quarterly updates, dashboard access</span>
                </div>
                <div className="part-option part-option--active">
                  <span className="part-badge">Recommended</span>
                  <span className="part-type">Active</span>
                  <span className="part-desc">Strategic partnership, advisory, network, co-development</span>
                </div>
              </div>
            </div>

            {/* Right: Funds */}
            <div className="funds-block">
              <h3 className="block-title">Use of Funds</h3>
              <div className="funds-bars" ref={fundsRef}>
                {funds.map((f, i) => (
                  <div className="fund-row" key={f.label}>
                    <div className="fund-info">
                      <span className="fund-pct">{f.pct}%</span>
                      <span className="fund-name">{f.label}</span>
                    </div>
                    <div className="fund-track">
                      <div
                        className="fund-fill"
                        style={{
                          width: fundsVisible ? `${f.pct}%` : '0%',
                          transitionDelay: fundsVisible ? `${i * 100}ms` : '0ms',
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="numbers-cta">
            <a href="#contact" className="num-cta-primary">
              Request Access to Invest
            </a>
            <a href="https://calendly.com/tarzan-ancestro/30min" target="_blank" rel="noopener noreferrer" className="num-cta-secondary">
              Schedule a Call
            </a>
          </div>
          <p className="numbers-contact">
            Questions? <a href="mailto:invest@ancestro.com">invest@ancestro.com</a>
          </p>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="final-cta" id="contact" ref={finalCtaRef}>
        <div className="final-cta__glow"></div>
        <div className="final-cta__inner">
          <div className="final-cta__statements">
            {['The platform is built.', 'The markets are opening.', 'The network is forming.'].map((line, i) => (
              <p
                key={i}
                className={`final-cta__line ${ctaVisible ? 'is-visible' : ''}`}
                style={{ transitionDelay: ctaVisible ? `${i * 180}ms` : '0ms' }}
              >
                {line}
              </p>
            ))}
          </div>

          <div
            className={`final-cta__divider ${ctaVisible ? 'is-visible' : ''}`}
            style={{ transitionDelay: ctaVisible ? `${3 * 180}ms` : '0ms' }}
          ></div>

          <p
            className={`final-cta__declaration ${ctaVisible ? 'is-visible' : ''}`}
            style={{ transitionDelay: ctaVisible ? `${3 * 180}ms` : '0ms' }}
          >
            We are not waiting for the future.
            <br />
            <span className="final-cta__declaration-gold">We are building it.</span>
          </p>

          {/* Contact Form */}
          <div
            className={`invest-form-wrap ${ctaVisible ? 'is-visible' : ''}`}
            style={{ transitionDelay: ctaVisible ? `${4 * 180}ms` : '0ms' }}
          >
            <div className="invest-form-card">
              <div className="invest-form-header">
                <h3 className="invest-form-title">Request Access to Invest</h3>
                <p className="invest-form-subtitle">Share your details and our team will reach out within 24 hours.</p>
              </div>

              <InvestorOnboarding lang={lang} onVerified={() => setKycStatus('verified')} />

              {!submitted ? (
                <form className="invest-form" onSubmit={handleFormSubmit} noValidate>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="invest-name" className="form-label">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="invest-name"
                        required
                        autoComplete="name"
                        placeholder="John Doe"
                        className={`form-input ${formErrors.name ? 'has-error' : ''}`}
                        value={formData.name}
                        onChange={(e) => {
                          setFormData((d) => ({ ...d, name: e.target.value }));
                          setFormErrors((err) => ({ ...err, name: false }));
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="invest-email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        id="invest-email"
                        required
                        autoComplete="email"
                        placeholder="john@company.com"
                        className={`form-input ${formErrors.email ? 'has-error' : ''}`}
                        value={formData.email}
                        onChange={(e) => {
                          setFormData((d) => ({ ...d, email: e.target.value }));
                          setFormErrors((err) => ({ ...err, email: false }));
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="invest-phone" className="form-label">
                        Phone <span className="form-optional">(optional)</span>
                      </label>
                      <input
                        type="tel"
                        id="invest-phone"
                        autoComplete="tel"
                        placeholder="+1 (555) 000-0000"
                        className="form-input"
                        value={formData.phone}
                        onChange={(e) => setFormData((d) => ({ ...d, phone: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="invest-amount" className="form-label">
                        Investment Range
                      </label>
                      <select
                        id="invest-amount"
                        required
                        className={`form-input form-select ${formErrors.amount ? 'has-error' : ''}`}
                        value={formData.amount}
                        onChange={(e) => {
                          setFormData((d) => ({ ...d, amount: e.target.value }));
                          setFormErrors((err) => ({ ...err, amount: false }));
                        }}
                      >
                        <option value="" disabled>
                          Select range
                        </option>
                        {investmentTiers.map((tier) => (
                          <option key={tier.value} value={tier.value}>
                            {tier.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group form-group--full">
                    <label htmlFor="invest-message" className="form-label">
                      Message <span className="form-optional">(optional)</span>
                    </label>
                    <textarea
                      id="invest-message"
                      rows={3}
                      placeholder="Tell us about yourself and your interest in Ancestro..."
                      className="form-input form-textarea"
                      value={formData.message}
                      onChange={(e) => setFormData((d) => ({ ...d, message: e.target.value }))}
                    ></textarea>
                  </div>

                  <button type="submit" className="form-submit" disabled={submitting}>
                    <span className="form-submit-text">{submitting ? 'Sending...' : 'Request Access'}</span>
                    <svg className="form-submit-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </form>
              ) : (
                <div className="form-success is-active">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <p>Thank you! We&apos;ll be in touch soon.</p>
                </div>
              )}

              <div className="form-footer">
                <span className="form-footer-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  100% Confidential
                </span>
                <span className="form-footer-sep"></span>
                <span className="form-footer-item">{INVESTMENT.sharePrice} per share</span>
                <span className="form-footer-sep"></span>
                <span className="form-footer-item">{INVESTMENT.valuation} valuation</span>
              </div>
            </div>

            <div className="form-alt-actions">
              <span className="form-alt-text">Prefer a direct conversation?</span>
              <a
                href="https://calendly.com/tarzan-ancestro/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="form-alt-link"
              >
                Schedule a Private Call
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
              <span className="form-alt-sep">&middot;</span>
              <a href="mailto:invest@ancestro.com" className="form-alt-link">
                invest@ancestro.com
              </a>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        /* ═══════════════════════════════════════════ */
        /* INVEST HERO                                */
        /* ═══════════════════════════════════════════ */
        .invest-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 120px 24px 96px;
          overflow: hidden;
          background: var(--color-black);
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .hero-gradient {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 1200px;
          height: 70%;
          background: radial-gradient(
            ellipse 60% 50% at 50% 0%,
            rgba(248, 176, 59, 0.06) 0%,
            transparent 100%
          );
          pointer-events: none;
        }

        .hero-grid-lines {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse 60% 50% at 50% 30%, black 10%, transparent 70%);
          -webkit-mask-image: radial-gradient(ellipse 60% 50% at 50% 30%, black 10%, transparent 70%);
          pointer-events: none;
        }

        .hero-accent-line {
          width: 48px;
          height: 1px;
          background: var(--color-primary);
          margin: 0 auto 40px;
          opacity: 0;
          animation: accentReveal 0.6s ease 0.3s forwards;
          position: relative;
        }

        .hero-accent-line::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--color-primary);
          filter: blur(4px);
          opacity: 0.5;
        }

        .hero-inner {
          position: relative;
          z-index: 1;
          max-width: 800px;
          width: 100%;
          text-align: center;
          opacity: 0;
          transform: translateY(8px);
          animation: fadeUp 0.2s ease forwards;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 7px 20px;
          border: 1px solid var(--color-white-10, rgba(255, 255, 255, 0.1));
          border-radius: 100px;
          font-size: 11px;
          font-weight: 500;
          color: var(--color-gray, rgba(255, 255, 255, 0.55));
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 40px;
        }

        .hero-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 8px rgba(74, 222, 128, 0.5);
          animation: heroPulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }

        .badge-sep {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--color-gray, rgba(255, 255, 255, 0.35));
          flex-shrink: 0;
        }

        .hero-title-gold {
          color: var(--color-primary);
        }

        .hero-title {
          font-size: clamp(36px, 5.5vw, 64px);
          font-weight: 600;
          line-height: 1.08;
          letter-spacing: -0.025em;
          color: var(--color-white);
          margin: 0 0 24px;
        }

        .hero-subtitle {
          font-size: clamp(16px, 1.8vw, 19px);
          line-height: 1.65;
          color: var(--color-gray, rgba(255, 255, 255, 0.55));
          margin: 0 auto 48px;
          max-width: 600px;
          font-weight: 400;
        }

        .hero-stats {
          display: inline-flex;
          align-items: center;
          gap: 32px;
          margin-bottom: 48px;
          padding: 24px 40px;
          border: 1px solid var(--color-white-10, rgba(255, 255, 255, 0.1));
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.02);
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .stat-value {
          font-size: clamp(24px, 3vw, 32px);
          font-weight: 600;
          color: var(--color-white);
          letter-spacing: -0.01em;
          font-variant-numeric: tabular-nums;
        }

        .stat-label {
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-gray, rgba(255, 255, 255, 0.45));
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: var(--color-white-10, rgba(255, 255, 255, 0.1));
        }

        .hero-ctas {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .cta-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px 40px;
          background: var(--color-primary);
          color: var(--color-black);
          font-size: 15px;
          font-weight: 700;
          letter-spacing: -0.005em;
          border-radius: 12px;
          text-decoration: none;
          box-shadow: 0 0 0 1px rgba(248, 176, 59, 0.3), 0 4px 16px rgba(248, 176, 59, 0.15);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cta-primary:hover {
          background: #f9bc55;
          box-shadow: 0 0 0 1px rgba(248, 176, 59, 0.5), 0 8px 32px rgba(248, 176, 59, 0.25);
          transform: translateY(-2px);
        }

        .cta-primary:active {
          transform: translateY(0);
        }

        .cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 14px 28px;
          color: var(--color-gray, rgba(255, 255, 255, 0.6));
          font-size: 15px;
          font-weight: 500;
          text-decoration: none;
          border: 1px solid var(--color-white-10, rgba(255, 255, 255, 0.1));
          border-radius: 10px;
          background: transparent;
          transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
        }

        .cta-secondary:hover {
          color: var(--color-white);
          border-color: var(--color-white-20, rgba(255, 255, 255, 0.2));
          background: rgba(255, 255, 255, 0.04);
        }

        .cta-secondary:hover svg {
          transform: translateX(3px);
        }

        .cta-secondary svg {
          transition: transform 0.15s ease;
        }

        .hero-proof {
          margin-top: 48px;
          text-align: center;
        }

        .hero-proof-text {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.35);
        }

        .hero-proof-text strong {
          color: rgba(255, 255, 255, 0.6);
          font-weight: 600;
        }

        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes accentReveal {
          0% { opacity: 0; width: 0; }
          100% { opacity: 1; width: 48px; }
        }

        @keyframes heroPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        @media (max-width: 768px) {
          .invest-hero { padding: 100px 20px 72px; min-height: auto; }
          .hero-accent-line { margin-bottom: 32px; }
          .hero-badge { margin-bottom: 32px; }
          .hero-subtitle { margin-bottom: 36px; }
          .hero-stats { gap: 24px; padding: 20px 28px; margin-bottom: 40px; }
          .hero-ctas { flex-direction: column; width: 100%; }
          .cta-primary, .cta-secondary { width: 100%; justify-content: center; }
        }

        @media (max-width: 480px) {
          .invest-hero { padding: 90px 16px 56px; }
          .hero-badge { font-size: 11px; padding: 6px 14px; gap: 6px; margin-bottom: 24px; }
          .hero-stats { flex-direction: column; gap: 0; padding: 16px 20px; width: 100%; max-width: 320px; }
          .stat { padding: 10px 0; align-items: center; }
          .stat-divider { width: 80%; height: 1px; align-self: center; }
          .stat-value { font-size: 22px; }
          .stat-label { font-size: 11px; }
          .hero-proof { gap: 6px; }
          .hero-proof-text { font-size: 11px; }
        }

        /* ═══════════════════════════════════════════ */
        /* INVEST THESIS                              */
        /* ═══════════════════════════════════════════ */
        .invest-thesis {
          padding: 64px 24px;
        }

        .thesis-container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .thesis-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--color-primary);
          margin-bottom: 12px;
        }

        .thesis-heading {
          font-size: 2rem;
          font-weight: 600;
          color: var(--color-white);
          letter-spacing: -0.02em;
          margin: 0 0 40px;
        }

        .thesis-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 0;
          align-items: stretch;
        }

        .thesis-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 20px;
          color: var(--color-primary);
          opacity: 0.4;
        }

        .thesis-card {
          height: 100%;
          padding: 28px;
          border: 1px solid var(--color-white-10);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.02);
        }

        .thesis-card--gold {
          border-color: rgba(248, 176, 59, 0.15);
          background: rgba(248, 176, 59, 0.03);
        }

        .card-tag {
          display: inline-block;
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-gray);
          margin-bottom: 12px;
        }

        .card-tag--gold {
          color: var(--color-primary);
        }

        .card-text {
          font-size: 0.9375rem;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        .card-features {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 16px;
        }

        .card-features span {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-primary);
          padding: 4px 12px;
          border: 1px solid rgba(248, 176, 59, 0.2);
          border-radius: 100px;
          background: rgba(248, 176, 59, 0.06);
          white-space: nowrap;
        }

        .card-stats {
          display: flex;
          gap: 20px;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid var(--color-white-10);
        }

        .card-stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .card-stat-val {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--color-white);
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.02em;
        }

        .card-stat-lbl {
          font-size: 0.6875rem;
          font-weight: 500;
          color: var(--color-gray);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        @media (max-width: 768px) {
          .invest-thesis { padding: 40px 20px; }
          .thesis-heading { font-size: 1.5rem; }
          .thesis-grid { grid-template-columns: 1fr; gap: 16px; }
          .thesis-arrow { transform: rotate(90deg); padding: 4px 0; }
        }

        @media (max-width: 480px) {
          .invest-thesis { padding: 32px 16px; }
          .thesis-heading { font-size: 1.25rem; }
          .thesis-card { padding: 20px 16px; }
          .card-features span { white-space: normal; text-align: center; }
          .card-stats { flex-wrap: wrap; gap: 12px; }
          .card-stat { min-width: 0; }
          .card-stat-val { font-size: 1rem; }
          .card-stat-lbl { font-size: 0.625rem; }
        }

        /* ═══════════════════════════════════════════ */
        /* ACCORDION SECTION                          */
        /* ═══════════════════════════════════════════ */
        .accordion-section {
          padding: 64px 24px;
          position: relative;
        }

        .accordion-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--color-white-10), transparent);
        }

        .accordion-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .accordion-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--color-primary);
          margin-bottom: 12px;
        }

        .accordion-heading {
          font-size: 2rem;
          font-weight: 600;
          color: var(--color-white);
          letter-spacing: -0.02em;
          margin: 0 0 40px;
        }

        .accordion-panels {
          display: flex;
          flex-direction: column;
        }

        .panel {
          border-top: 1px solid var(--color-white-10);
        }

        .panel:last-child {
          border-bottom: 1px solid var(--color-white-10);
        }

        .panel-trigger {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 0;
          cursor: pointer;
          user-select: none;
          transition: color 0.2s ease;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          font-family: inherit;
        }

        .panel-number {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--color-primary);
          font-variant-numeric: tabular-nums;
          min-width: 24px;
          opacity: 0.6;
        }

        .panel--open .panel-number {
          opacity: 1;
        }

        .panel-title {
          flex: 1;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--color-white);
          letter-spacing: -0.01em;
        }

        .panel-chevron {
          width: 18px;
          height: 18px;
          color: var(--color-gray);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s ease;
          flex-shrink: 0;
        }

        .panel--open .panel-chevron {
          transform: rotate(180deg);
          color: var(--color-primary);
        }

        .panel-trigger:hover .panel-title {
          color: var(--color-primary);
        }

        .panel-content {
          padding: 0 0 24px 40px;
          animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .panel-text {
          font-size: 0.9375rem;
          line-height: 1.7;
          color: var(--color-gray);
          margin: 0;
          max-width: 640px;
        }

        .panel-list {
          list-style: none;
          padding: 0;
          margin: 20px 0 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .panel-list li {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--color-white-10);
          border-radius: 8px;
        }

        .panel-list li strong {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-white);
        }

        .panel-list li span {
          font-size: 0.8125rem;
          color: var(--color-gray);
          line-height: 1.5;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 640px) {
          .accordion-section { padding: 40px 20px; }
          .accordion-heading { font-size: 1.5rem; margin-bottom: 28px; }
          .panel-trigger { padding: 16px 0; }
          .panel-title { font-size: 1rem; }
          .panel-content { padding: 0 0 20px 0; }
          .panel-list { grid-template-columns: 1fr; }
        }

        /* ═══════════════════════════════════════════ */
        /* INVEST NUMBERS                             */
        /* ═══════════════════════════════════════════ */
        .invest-numbers {
          padding: 64px 24px;
          position: relative;
        }

        .invest-numbers::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--color-white-10), transparent);
        }

        .numbers-container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .numbers-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--color-primary);
          margin-bottom: 12px;
        }

        .numbers-heading {
          font-size: 2rem;
          font-weight: 600;
          color: var(--color-white);
          letter-spacing: -0.02em;
          margin: 0 0 40px;
        }

        .numbers-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-bottom: 48px;
        }

        .block-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .block-title {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-gray);
          margin: 0;
        }

        .verified-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          border-radius: 100px;
          border: 1px solid rgba(74, 222, 128, 0.25);
          background: rgba(74, 222, 128, 0.06);
          color: #4ade80;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .terms-list {
          display: flex;
          flex-direction: column;
        }

        .term-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 10px 0;
          border-bottom: 1px solid var(--color-white-10);
        }

        .term-row:last-child {
          border-bottom: none;
        }

        .term-key {
          font-size: 0.8125rem;
          color: var(--color-gray);
        }

        .term-val {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--color-white);
          font-variant-numeric: tabular-nums;
        }

        .term-val--gold {
          color: var(--color-primary);
        }

        .participation-row {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .part-option {
          flex: 1;
          padding: 14px;
          border: 1px solid var(--color-white-10);
          border-radius: 10px;
          position: relative;
        }

        .part-option--active {
          border-color: rgba(248, 176, 59, 0.3);
          background: rgba(248, 176, 59, 0.04);
        }

        .part-badge {
          position: absolute;
          top: -8px;
          right: 12px;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-primary);
          background: var(--color-black);
          padding: 2px 8px;
          border: 1px solid rgba(248, 176, 59, 0.3);
          border-radius: 100px;
        }

        .part-type {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-white);
          margin-bottom: 4px;
        }

        .part-desc {
          font-size: 0.75rem;
          color: var(--color-gray);
          line-height: 1.5;
        }

        .funds-bars {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .fund-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .fund-info {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .fund-pct {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-white);
          font-variant-numeric: tabular-nums;
          min-width: 36px;
        }

        .fund-name {
          font-size: 0.8125rem;
          color: var(--color-gray);
        }

        .fund-track {
          height: 8px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 4px;
          overflow: hidden;
        }

        .fund-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-primary), rgba(248, 176, 59, 0.7));
          border-radius: 4px;
          transition: width 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .numbers-cta {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .num-cta-primary {
          display: inline-flex;
          align-items: center;
          padding: 14px 40px;
          background: var(--color-primary);
          color: var(--color-black);
          font-size: 0.9375rem;
          font-weight: 700;
          border-radius: 12px;
          text-decoration: none;
          transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }

        .num-cta-primary:hover {
          background: #ffbe4d;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(248, 176, 59, 0.25);
        }

        .num-cta-secondary {
          display: inline-flex;
          align-items: center;
          padding: 14px 32px;
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9375rem;
          font-weight: 600;
          border: 1px solid var(--color-white-20);
          border-radius: 12px;
          text-decoration: none;
          backdrop-filter: blur(8px);
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
        }

        .num-cta-secondary:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }

        .numbers-contact {
          text-align: center;
          font-size: 0.8125rem;
          color: rgba(255, 255, 255, 0.35);
          margin: 0;
        }

        .numbers-contact a {
          color: rgba(255, 255, 255, 0.5);
          text-decoration: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          transition: color 0.2s ease, border-color 0.2s ease;
        }

        .numbers-contact a:hover {
          color: var(--color-primary);
          border-color: var(--color-primary);
        }

        @media (max-width: 768px) {
          .invest-numbers { padding: 40px 20px; }
          .numbers-heading { font-size: 1.5rem; }
          .numbers-grid { grid-template-columns: 1fr; gap: 40px; }
          .participation-row { flex-direction: column; }
          .numbers-cta { flex-direction: column; align-items: center; }
          .num-cta-primary, .num-cta-secondary { width: 100%; max-width: 340px; justify-content: center; }
        }

        @media (max-width: 480px) {
          .invest-numbers { padding: 32px 16px; }
          .numbers-heading { font-size: 1.25rem; }
          .term-row { flex-direction: column; gap: 4px; padding: 10px 0; }
          .term-key { font-size: 0.75rem; }
          .fund-name { font-size: 0.75rem; word-break: break-word; }
          .fund-pct { font-size: 0.8125rem; min-width: 30px; }
          .numbers-contact { font-size: 0.8125rem; }
          .num-cta-primary, .num-cta-secondary { font-size: 14px; padding: 14px 20px; }
        }

        /* ═══════════════════════════════════════════ */
        /* FINAL CTA                                  */
        /* ═══════════════════════════════════════════ */
        .final-cta {
          position: relative;
          overflow: hidden;
          padding: 80px 24px 56px;
          text-align: center;
        }

        .final-cta__glow {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 1200px;
          height: 520px;
          background: radial-gradient(
            ellipse 80% 55% at 50% 0%,
            rgba(248, 176, 59, 0.08) 0%,
            transparent 100%
          );
          pointer-events: none;
        }

        .final-cta__inner {
          position: relative;
          z-index: 1;
          max-width: 800px;
          margin: 0 auto;
        }

        .final-cta__statements {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 32px;
        }

        .final-cta__line {
          font-size: 1.5rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.72);
          letter-spacing: -0.01em;
          line-height: 1.4;
          margin: 0;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .final-cta__line.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .final-cta__divider {
          width: 40px;
          height: 2px;
          background: var(--color-primary);
          margin: 0 auto 32px;
          opacity: 0;
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .final-cta__divider.is-visible {
          opacity: 1;
        }

        .final-cta__declaration-gold {
          color: var(--color-primary);
        }

        .final-cta__declaration {
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-white);
          line-height: 1.3;
          letter-spacing: -0.025em;
          margin: 0 0 48px;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .final-cta__declaration.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .invest-form-wrap {
          text-align: left;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .invest-form-wrap.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .invest-form-card {
          background: linear-gradient(
            165deg,
            rgba(255, 255, 255, 0.06) 0%,
            rgba(255, 255, 255, 0.02) 100%
          );
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 16px 64px rgba(0, 0, 0, 0.3),
                      inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .invest-form-header {
          margin-bottom: 32px;
          text-align: center;
        }

        .invest-form-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-white);
          margin: 0 0 8px;
          letter-spacing: -0.02em;
        }

        .invest-form-subtitle {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.45);
          margin: 0;
        }

        .invest-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: relative;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group--full {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .form-optional {
          font-weight: 400;
          text-transform: none;
          letter-spacing: 0;
          color: rgba(255, 255, 255, 0.3);
        }

        .form-input {
          width: 100%;
          padding: 13px 16px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: var(--color-white);
          font-size: 0.9375rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.2);
        }

        .form-input:focus {
          border-color: rgba(248, 176, 59, 0.5);
          background: rgba(255, 255, 255, 0.06);
          box-shadow: 0 0 0 3px rgba(248, 176, 59, 0.08);
        }

        .form-input.has-error {
          border-color: rgba(248, 113, 113, 0.6);
        }

        .form-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 40px;
          cursor: pointer;
        }

        .form-select option {
          background: #1a1a1a;
          color: #fff;
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 16px 32px;
          background: var(--color-primary);
          color: var(--color-black);
          font-size: 1rem;
          font-weight: 700;
          font-family: inherit;
          letter-spacing: -0.01em;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          transition: background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
          margin-top: 4px;
        }

        .form-submit:hover {
          background: #ffbe4d;
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(248, 176, 59, 0.3);
        }

        .form-submit:active {
          transform: translateY(0);
        }

        .form-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .form-submit-arrow {
          transition: transform 0.3s ease;
        }

        .form-submit:hover .form-submit-arrow {
          transform: translateX(4px);
        }

        .form-success {
          display: none;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 32px 20px;
          text-align: center;
        }

        .form-success.is-active {
          display: flex;
        }

        .form-success p {
          font-size: 1.05rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }

        .form-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          padding-top: 24px;
          margin-top: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .form-footer-item {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.4);
          white-space: nowrap;
        }

        .form-footer-item svg {
          color: #4ade80;
        }

        .form-footer-sep {
          width: 1px;
          height: 14px;
          background: rgba(255, 255, 255, 0.08);
        }

        .form-alt-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 24px;
          flex-wrap: wrap;
        }

        .form-alt-text {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.35);
        }

        .form-alt-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .form-alt-link:hover {
          color: var(--color-primary);
        }

        .form-alt-sep {
          color: rgba(255, 255, 255, 0.2);
          font-size: 0.85rem;
        }

        @media (max-width: 640px) {
          .final-cta { padding: 56px 20px 40px; }
          .final-cta__line { font-size: 1.25rem; }
          .final-cta__declaration { font-size: 1.55rem; margin-bottom: 44px; }
          .invest-form-card { padding: 28px 20px; border-radius: 16px; }
          .form-row { grid-template-columns: 1fr; gap: 16px; }
          .form-footer { flex-direction: column; gap: 8px; }
          .form-footer-sep { display: none; }
          .form-alt-actions { flex-direction: column; gap: 8px; }
        }

        @media (max-width: 420px) {
          .final-cta { padding: 44px 14px 32px; }
          .final-cta__line { font-size: 1.0625rem; }
          .final-cta__declaration { font-size: 1.3rem; margin-bottom: 36px; }
          .invest-form-card { padding: 22px 14px; }
          .form-submit { padding: 14px 20px; font-size: 0.9375rem; }
          .form-footer-item { white-space: normal; font-size: 0.75rem; }
        }
      `}</style>
    </>
  );
}
