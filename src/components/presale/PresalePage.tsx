'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { t } from '@/i18n/translations';

// ─── Token Configuration ───
const TOKEN = {
  symbol: 'ANC',
  name: 'Ancestro',
  presalePrice: 0.88,
  listingPrice: 1.25,
  totalSupply: '100,000,000',
  presaleAllocation: '15,000,000',
};

// ─── Presale Configuration ───
const PRESALE = {
  hardCap: '$13,200,000',
  raised: '$8,883,600',
  progress: 67.3,
  daysRemaining: 150,
  minBuy: 100,
  maxBuy: 50000,
};

// ─── Donut chart helpers ───
const CIRCUMFERENCE = 2 * Math.PI * 80;

function formatNumber(n: number): string {
  return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function formatInt(n: number): string {
  return n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ═══════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════

export default function PresalePage({ lang }: { lang: string }) {
  // ─── Countdown state ───
  const [countdown, setCountdown] = useState({ days: PRESALE.daysRemaining, hours: 0, minutes: 0, seconds: 0 });

  // ─── FAQ state ───
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // ─── Manifesto expand state ───
  const [manifestoExpanded, setManifestoExpanded] = useState(false);

  // ─── Staking Calculator state ───
  const [stakeAmount, setStakeAmount] = useState(10000);
  const [stakePlan, setStakePlan] = useState(23);

  // ─── Buy Form state ───
  const [buyAmount, setBuyAmount] = useState(1000);
  const [activePayment, setActivePayment] = useState('usdt');

  // ─── Presale Bar visibility ───
  const [barVisible, setBarVisible] = useState(false);

  // ─── Derived values ───
  const savings = Math.round((1 - TOKEN.presalePrice / TOKEN.listingPrice) * 100);
  const tokensPreview = buyAmount / TOKEN.presalePrice;

  // ─── Staking calculator derived ───
  const yearlyReward = stakeAmount * (stakePlan / 100);
  const monthlyReward = yearlyReward / 12;
  const usdValue = yearlyReward * TOKEN.presalePrice;

  // ─── Data arrays (translated) ───
  const benefits = useMemo(() => [
    { icon: t(lang, 'presale.benefit1.icon'), title: t(lang, 'presale.benefit1.title'), description: t(lang, 'presale.benefit1.description') },
    { icon: t(lang, 'presale.benefit2.icon'), title: t(lang, 'presale.benefit2.title'), description: t(lang, 'presale.benefit2.description') },
    { icon: t(lang, 'presale.benefit3.icon'), title: t(lang, 'presale.benefit3.title'), description: t(lang, 'presale.benefit3.description') },
    { icon: t(lang, 'presale.benefit4.icon'), title: t(lang, 'presale.benefit4.title'), description: t(lang, 'presale.benefit4.description') },
  ], [lang]);

  const allocations = useMemo(() => [
    { name: t(lang, 'presale.tokenomics.presale'), percent: 15, amount: '15M ANC', color: '#f8b03b' },
    { name: t(lang, 'presale.tokenomics.liquidity'), percent: 20, amount: '20M ANC', color: '#e9a235' },
    { name: t(lang, 'presale.tokenomics.staking'), percent: 20, amount: '20M ANC', color: '#d4912e' },
    { name: t(lang, 'presale.tokenomics.team'), percent: 15, amount: '15M ANC', color: '#bf8027' },
    { name: t(lang, 'presale.tokenomics.reserve'), percent: 10, amount: '10M ANC', color: '#8b5a1b' },
    { name: t(lang, 'presale.tokenomics.ecosystem'), percent: 20, amount: '20M ANC', color: '#5c3d12' },
  ], [lang]);

  const vestingSchedule = useMemo(() => [
    { phase: t(lang, 'presale.vesting.tge'), percent: 15, description: t(lang, 'presale.vesting.tgeDesc') },
    { phase: t(lang, 'presale.vesting.month12'), percent: 17, description: t(lang, 'presale.vesting.month12Desc') },
    { phase: t(lang, 'presale.vesting.month34'), percent: 17, description: t(lang, 'presale.vesting.month34Desc') },
    { phase: t(lang, 'presale.vesting.month56'), percent: 17, description: t(lang, 'presale.vesting.month56Desc') },
    { phase: t(lang, 'presale.vesting.month78'), percent: 17, description: t(lang, 'presale.vesting.month78Desc') },
    { phase: t(lang, 'presale.vesting.month910'), percent: 17, description: t(lang, 'presale.vesting.month910Desc') },
  ], [lang]);

  const stakingTiers = useMemo(() => [
    {
      name: t(lang, 'presale.staking.flexible.name'), apy: 12, bonus: 5,
      lock: t(lang, 'presale.staking.flexible.lock'),
      description: t(lang, 'presale.staking.flexible.description'),
      features: [t(lang, 'presale.staking.flexible.feature1'), t(lang, 'presale.staking.flexible.feature2'), t(lang, 'presale.staking.flexible.feature3')],
      recommended: false,
    },
    {
      name: t(lang, 'presale.staking.holder.name'), apy: 18, bonus: 5,
      lock: t(lang, 'presale.staking.holder.lock'),
      description: t(lang, 'presale.staking.holder.description'),
      features: [t(lang, 'presale.staking.holder.feature1'), t(lang, 'presale.staking.holder.feature2'), t(lang, 'presale.staking.holder.feature3'), t(lang, 'presale.staking.holder.feature4')],
      recommended: true,
    },
    {
      name: t(lang, 'presale.staking.diamond.name'), apy: 28, bonus: 5,
      lock: t(lang, 'presale.staking.diamond.lock'),
      description: t(lang, 'presale.staking.diamond.description'),
      features: [t(lang, 'presale.staking.diamond.feature1'), t(lang, 'presale.staking.diamond.feature2'), t(lang, 'presale.staking.diamond.feature3'), t(lang, 'presale.staking.diamond.feature4'), t(lang, 'presale.staking.diamond.feature5')],
      recommended: false,
    },
  ], [lang]);

  const faqs = useMemo(() => [
    { question: t(lang, 'presale.faq1.question'), answer: t(lang, 'presale.faq1.answer') },
    { question: t(lang, 'presale.faq2.question'), answer: t(lang, 'presale.faq2.answer') },
    { question: t(lang, 'presale.faq3.question'), answer: t(lang, 'presale.faq3.answer') },
    { question: t(lang, 'presale.faq4.question'), answer: t(lang, 'presale.faq4.answer') },
    { question: t(lang, 'presale.faq5.question'), answer: t(lang, 'presale.faq5.answer') },
    { question: t(lang, 'presale.faq6.question'), answer: t(lang, 'presale.faq6.answer') },
  ], [lang]);

  // ─── Donut chart segments ───
  const segments = useMemo(() => {
    let offset = 0;
    return allocations.map(alloc => {
      const dashArray = (alloc.percent / 100) * CIRCUMFERENCE;
      const segment = { ...alloc, dashArray, dashOffset: -offset };
      offset += dashArray;
      return segment;
    });
  }, [allocations]);

  // ─── Countdown timer ───
  useEffect(() => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + PRESALE.daysRemaining);

    function tick() {
      const now = Date.now();
      const distance = endDate.getTime() - now;
      if (distance < 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // ─── Scroll listener for presale bar ───
  useEffect(() => {
    function onScroll() {
      setBarVisible(window.pageYOffset > 400);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  const handleBuySubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    alert(t(lang, 'presale.buy.comingSoon') || 'Coming soon!');
  }, [lang]);

  // ═══════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════
  return (
    <>
      {/* ────────────── HERO SECTION ────────────── */}
      <section className="presale-hero">
        <div className="hero-bg">
          <div className="hero-glow"></div>
          <div className="hero-grid"></div>
        </div>

        <div className="hero-content">
          <div className="token-badge">
            <span className="token-icon">&#x25C8;</span>
            <span className="token-symbol">{TOKEN.symbol}</span>
            <span className="token-status">{t(lang, 'presale.hero.badge')}</span>
          </div>

          <h1 className="hero-title">
            {t(lang, 'presale.hero.title')}
            <span className="highlight">{t(lang, 'presale.hero.titleHighlight')}</span>
          </h1>

          <p className="hero-subtitle">
            {t(lang, 'presale.hero.subtitle').replace('{token}', TOKEN.symbol)}
          </p>

          {/* Price Display */}
          <div className="price-display">
            <div className="current-price">
              <span className="price-label">{t(lang, 'presale.hero.priceLabel')}</span>
              <span className="price-value">${TOKEN.presalePrice}</span>
              <span className="price-unit">USD</span>
            </div>
            <div className="price-divider"></div>
            <div className="listing-price">
              <span className="price-label">{t(lang, 'presale.hero.listingLabel')}</span>
              <span className="price-value-striked">${TOKEN.listingPrice}</span>
              <span className="price-savings">{t(lang, 'presale.hero.savingsLabel').replace('{percent}', String(savings))}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-section">
            <div className="progress-header">
              <span>{t(lang, 'presale.hero.progressLabel')}</span>
              <span className="progress-percent">{PRESALE.progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${PRESALE.progress}%` }}></div>
            </div>
            <div className="progress-stats">
              <span><strong>{PRESALE.raised}</strong> {t(lang, 'presale.hero.raised')}</span>
              <span>{t(lang, 'presale.hero.hardCap')}: <strong>{PRESALE.hardCap}</strong></span>
            </div>
          </div>

          {/* Countdown */}
          <div className="countdown-wrapper">
            <p className="countdown-label">{t(lang, 'presale.hero.countdownLabel')}</p>
            <div className="countdown">
              <div className="countdown-item">
                <span className="countdown-number">{pad(countdown.days)}</span>
                <span className="countdown-text">{t(lang, 'presale.hero.days')}</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number">{pad(countdown.hours)}</span>
                <span className="countdown-text">{t(lang, 'presale.hero.hours')}</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number">{pad(countdown.minutes)}</span>
                <span className="countdown-text">{t(lang, 'presale.hero.minutes')}</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number">{pad(countdown.seconds)}</span>
                <span className="countdown-text">{t(lang, 'presale.hero.seconds')}</span>
              </div>
            </div>
          </div>

          <div className="hero-ctas">
            <a href="#buy" className="cta-primary">
              {t(lang, 'presale.hero.buyButton').replace('{token}', TOKEN.symbol)}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
            <a href="#tokenomics" className="cta-secondary">{t(lang, 'presale.hero.tokenomicsButton')}</a>
          </div>
        </div>
      </section>

      {/* ────────────── BENEFITS SECTION ────────────── */}
      <section className="benefits-section">
        <div className="benefits-container">
          {benefits.map((b, i) => (
            <div className="benefit-card" key={i}>
              <span className="benefit-icon">{b.icon}</span>
              <h3 className="benefit-title">{b.title}</h3>
              <p className="benefit-description">{b.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ────────────── MANIFESTO SECTION ────────────── */}
      <section className="manifesto-section">
        <div className="manifesto-container">
          <div className="manifesto-badge">{t(lang, 'presale.manifesto.badge')}</div>
          <h2 className="manifesto-title">{t(lang, 'presale.manifesto.title')}</h2>
          <p className="manifesto-lead">{t(lang, 'presale.manifesto.lead')}</p>

          <div className={`manifesto-collapsible${manifestoExpanded ? ' expanded' : ''}`}>
            <div className="manifesto-content">
              <p>{t(lang, 'presale.manifesto.p1')}</p>
              <p>{t(lang, 'presale.manifesto.p2')}</p>
              <p>{t(lang, 'presale.manifesto.p3')}</p>
              <p className="manifesto-highlight">{t(lang, 'presale.manifesto.highlight')}</p>
              <p>{t(lang, 'presale.manifesto.p4')}</p>
              <div className="manifesto-question">
                <p>{t(lang, 'presale.manifesto.question1')}</p>
                <p className="question-main">{t(lang, 'presale.manifesto.question2')}</p>
                <p className="question-sub">{t(lang, 'presale.manifesto.question3')}</p>
              </div>
            </div>
          </div>

          <button
            className={`expand-btn${manifestoExpanded ? ' expanded' : ''}`}
            type="button"
            onClick={() => setManifestoExpanded(!manifestoExpanded)}
          >
            <span className="expand-text">
              {manifestoExpanded ? t(lang, 'presale.manifesto.readLess') : t(lang, 'presale.manifesto.readMore')}
            </span>
            <svg className="expand-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="manifesto-stats">
            <div className="stat-item">
              <span className="stat-number">{t(lang, 'presale.manifesto.stat1.number')}</span>
              <span className="stat-label">{t(lang, 'presale.manifesto.stat1.label')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{t(lang, 'presale.manifesto.stat2.number')}</span>
              <span className="stat-label">{t(lang, 'presale.manifesto.stat2.label')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{t(lang, 'presale.manifesto.stat3.number')}</span>
              <span className="stat-label">{t(lang, 'presale.manifesto.stat3.label')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{t(lang, 'presale.manifesto.stat4.number')}</span>
              <span className="stat-label">{t(lang, 'presale.manifesto.stat4.label')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────── TOKENOMICS SECTION ────────────── */}
      <section className="tokenomics-section" id="tokenomics">
        <div className="section-header">
          <span className="section-badge">Tokenomics</span>
          <h2 className="section-title">{t(lang, 'presale.tokenomics.title')}</h2>
          <p className="section-subtitle">{t(lang, 'presale.tokenomics.subtitle')}</p>
        </div>

        <div className="tokenomics-grid">
          <div className="tokenomics-chart">
            <div className="chart-visual">
              <svg viewBox="0 0 200 200" className="donut-chart">
                <circle cx="100" cy="100" r="80" fill="none" stroke="#1a1a1a" strokeWidth="30"/>
                {segments.map((seg, i) => (
                  <circle
                    key={i}
                    cx="100" cy="100" r="80"
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="30"
                    strokeDasharray={`${seg.dashArray} ${CIRCUMFERENCE - seg.dashArray}`}
                    strokeDashoffset={seg.dashOffset}
                    className="chart-segment"
                  />
                ))}
              </svg>
              <div className="chart-center">
                <span className="chart-total">{TOKEN.totalSupply}</span>
                <span className="chart-label">Total Supply</span>
              </div>
            </div>
          </div>

          <div className="tokenomics-breakdown">
            <div className="token-allocation">
              {allocations.map((alloc, i) => (
                <div className="allocation-item" key={i}>
                  <div className="allocation-color" style={{ background: alloc.color }}></div>
                  <div className="allocation-info">
                    <span className="allocation-name">{alloc.name}</span>
                    <span className="allocation-percent">{alloc.percent}%</span>
                  </div>
                  <span className="allocation-amount">{alloc.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ────────────── VESTING SCHEDULE ────────────── */}
      <section className="vesting-section" id="vesting">
        <div className="section-header">
          <span className="section-badge">Vesting</span>
          <h2 className="section-title">{t(lang, 'presale.vesting.title')}</h2>
          <p className="section-subtitle">{t(lang, 'presale.vesting.subtitle')}</p>
        </div>

        <div className="vesting-container">
          <div className="vesting-info">
            <div className="vesting-highlight">
              <div className="highlight-icon">&#x1F513;</div>
              <div className="highlight-content">
                <h3>{t(lang, 'presale.vesting.highlight1Title')}</h3>
                <p>{t(lang, 'presale.vesting.highlight1Desc')}</p>
              </div>
            </div>
            <div className="vesting-highlight">
              <div className="highlight-icon">&#x1F4C5;</div>
              <div className="highlight-content">
                <h3>{t(lang, 'presale.vesting.highlight2Title')}</h3>
                <p>{t(lang, 'presale.vesting.highlight2Desc')}</p>
              </div>
            </div>
            <div className="vesting-highlight">
              <div className="highlight-icon">&#x2728;</div>
              <div className="highlight-content">
                <h3>{t(lang, 'presale.vesting.highlight3Title')}</h3>
                <p>{t(lang, 'presale.vesting.highlight3Desc')}</p>
              </div>
            </div>
          </div>

          <div className="vesting-timeline">
            <div className="timeline-header">
              <span>{t(lang, 'presale.vesting.timelineTitle')}</span>
            </div>
            {vestingSchedule.map((item, i) => (
              <div className="timeline-item" key={i}>
                <div className="timeline-phase">{item.phase}</div>
                <div className="timeline-bar">
                  <div className="timeline-fill" style={{ width: `${item.percent}%` }}></div>
                </div>
                <div className="timeline-percent">{item.percent}%</div>
              </div>
            ))}
            <div className="timeline-total">
              <span>{t(lang, 'presale.vesting.totalLabel')}</span>
              <span className="total-percent">100%</span>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────── STAKING TIERS ────────────── */}
      <section className="staking-section" id="staking">
        <div className="section-header">
          <span className="section-badge">Staking</span>
          <h2 className="section-title">{t(lang, 'presale.staking.title')}</h2>
          <p className="section-subtitle">{t(lang, 'presale.staking.subtitle')}</p>
        </div>

        <div className="staking-bonus-banner">
          <span className="bonus-icon-banner">&#x1F381;</span>
          <span className="bonus-text" dangerouslySetInnerHTML={{ __html: t(lang, 'presale.staking.bonusBanner') }} />
        </div>

        <div className="staking-grid">
          {stakingTiers.map((tier, i) => (
            <div className={`staking-card${tier.recommended ? ' recommended' : ''}`} key={i}>
              {tier.recommended && <span className="recommended-badge">{t(lang, 'presale.staking.recommended')}</span>}
              <div className="staking-header">
                <h3 className="staking-name">{tier.name}</h3>
                <p className="staking-desc">{tier.description}</p>
              </div>

              <div className="staking-apy">
                <span className="apy-value">{tier.apy}%</span>
                <span className="apy-label">APY Base</span>
              </div>

              <div className="staking-bonus">
                <span className="bonus-badge">+{tier.bonus}% Presale Bonus</span>
                <span className="total-apy">= {tier.apy + tier.bonus}% APY Total</span>
              </div>

              <div className="staking-lock">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>{tier.lock}</span>
              </div>

              <ul className="staking-features">
                {tier.features.map((feat, fi) => (
                  <li key={fi}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17L4 12" stroke="#f8b03b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>

              <button className="staking-cta">{t(lang, 'presale.staking.selectPlan')}</button>
            </div>
          ))}
        </div>
      </section>

      {/* ────────────── STAKING CALCULATOR ────────────── */}
      <div className="calculator-wrapper">
        <div className="staking-calculator">
          <h4>{t(lang, 'presale.calculator.title')}</h4>
          <div className="calc-inputs">
            <div className="calc-group">
              <label htmlFor="stake-amount">{t(lang, 'presale.calculator.amountLabel')}</label>
              <input
                type="number"
                id="stake-amount"
                value={stakeAmount}
                min={100}
                onChange={e => setStakeAmount(Number(e.target.value) || 0)}
              />
            </div>
            <div className="calc-group">
              <label htmlFor="stake-plan">{t(lang, 'presale.calculator.planLabel')}</label>
              <select
                id="stake-plan"
                value={stakePlan}
                onChange={e => setStakePlan(Number(e.target.value))}
              >
                <option value={17}>{t(lang, 'presale.calculator.flexible')}</option>
                <option value={23}>{t(lang, 'presale.calculator.holder')}</option>
                <option value={33}>{t(lang, 'presale.calculator.diamond')}</option>
              </select>
            </div>
          </div>
          <div className="calc-results">
            <div className="calc-result">
              <span className="result-label">{t(lang, 'presale.calculator.monthlyReward')}</span>
              <span className="result-value">{formatNumber(monthlyReward)} ANC</span>
            </div>
            <div className="calc-result">
              <span className="result-label">{t(lang, 'presale.calculator.yearlyReward')}</span>
              <span className="result-value">{formatInt(yearlyReward)} ANC</span>
            </div>
            <div className="calc-result calc-highlight">
              <span className="result-label">{t(lang, 'presale.calculator.usdValue')}</span>
              <span className="result-value">${formatInt(usdValue)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ────────────── BUY FORM SECTION ────────────── */}
      <section className="buy-section" id="buy">
        <div className="section-header">
          <span className="section-badge">{TOKEN.symbol}</span>
          <h2 className="section-title">{t(lang, 'presale.buy.title')}</h2>
          <p className="section-subtitle">{t(lang, 'presale.buy.subtitle')}</p>
        </div>

        <div className="buy-container">
          <div className="buy-card">
            <div className="buy-header">
              <div className="buy-price">
                <span className="buy-price-label">{t(lang, 'presale.buy.priceLabel')}</span>
                <span className="buy-price-value">${TOKEN.presalePrice} USD</span>
              </div>
              <div className="buy-limits">
                <span>{t(lang, 'presale.buy.min')}: ${PRESALE.minBuy} USD</span>
                <span>{t(lang, 'presale.buy.max')}: ${PRESALE.maxBuy.toLocaleString()} USD</span>
              </div>
            </div>

            <form className="buy-form" onSubmit={handleBuySubmit}>
              <div className="form-group">
                <label>{t(lang, 'presale.buy.amountLabel')}</label>
                <div className="input-with-max">
                  <input
                    type="number"
                    min={PRESALE.minBuy}
                    max={PRESALE.maxBuy}
                    value={buyAmount}
                    onChange={e => setBuyAmount(Number(e.target.value) || 0)}
                    required
                  />
                  <button
                    type="button"
                    className="max-btn"
                    onClick={() => setBuyAmount(PRESALE.maxBuy)}
                  >
                    {t(lang, 'presale.buy.maxButton')}
                  </button>
                </div>
              </div>

              <div className="tokens-preview">
                <span>{t(lang, 'presale.buy.receiveLabel')}</span>
                <span className="tokens-amount">{formatNumber(tokensPreview)} {TOKEN.symbol}</span>
              </div>

              <div className="form-group">
                <label>{t(lang, 'presale.buy.walletLabel')}</label>
                <input type="text" placeholder="0x..." required />
              </div>

              <div className="form-group">
                <label>{t(lang, 'presale.buy.emailLabel')}</label>
                <input type="email" placeholder={t(lang, 'presale.buy.emailPlaceholder')} required />
              </div>

              <div className="payment-methods">
                <span className="payment-label">{t(lang, 'presale.buy.paymentLabel')}</span>
                <div className="payment-options">
                  {['usdt', 'usdc', 'eth', 'card'].map(m => (
                    <button
                      key={m}
                      type="button"
                      className={`payment-btn${activePayment === m ? ' active' : ''}`}
                      onClick={() => setActivePayment(m)}
                    >
                      {m.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group checkbox-group">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">
                  {t(lang, 'presale.buy.termsAccept')} <a href="#">{t(lang, 'presale.buy.termsLink')}</a> {t(lang, 'presale.buy.termsAnd')} <a href="#">{t(lang, 'presale.buy.privacyLink')}</a>
                </label>
              </div>

              <button type="submit" className="buy-submit">
                {t(lang, 'presale.buy.buyButton').replace('{token}', TOKEN.symbol)}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>

            <div className="buy-security">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>{t(lang, 'presale.buy.secureTransaction')}</span>
            </div>
          </div>

          <div className="buy-info">
            <h3>{t(lang, 'presale.buy.whyBuyTitle').replace('{token}', TOKEN.symbol)}</h3>

            <div className="info-cards">
              <div className="info-card">
                <div className="info-card-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M2 12H22M12 2C14.5 4.5 16 8 16 12C16 16 14.5 19.5 12 22C9.5 19.5 8 16 8 12C8 8 9.5 4.5 12 2Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h4>{t(lang, 'presale.buy.utilityTitle')}</h4>
                <p>{t(lang, 'presale.buy.utilityDesc').replace('{token}', TOKEN.symbol)}</p>
              </div>

              <div className="info-card">
                <div className="info-card-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 7H21V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h4>{t(lang, 'presale.buy.growthTitle')}</h4>
                <p>{t(lang, 'presale.buy.growthDesc').replace('{token}', TOKEN.symbol)}</p>
              </div>

              <div className="info-card">
                <div className="info-card-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h4>{t(lang, 'presale.buy.securityTitle')}</h4>
                <p>{t(lang, 'presale.buy.securityDesc')}</p>
              </div>
            </div>

            <div className="roadmap-preview">
              <div className="roadmap-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <h4>{t(lang, 'presale.buy.milestonesTitle')}</h4>
              </div>
              <div className="milestones">
                <div className="milestone">
                  <span className="milestone-dot"></span>
                  <div className="milestone-content">
                    <span className="milestone-date">{t(lang, 'presale.buy.milestone1Date')}</span>
                    <span className="milestone-text">{t(lang, 'presale.buy.milestone1Text')}</span>
                  </div>
                </div>
                <div className="milestone">
                  <span className="milestone-dot"></span>
                  <div className="milestone-content">
                    <span className="milestone-date">{t(lang, 'presale.buy.milestone2Date')}</span>
                    <span className="milestone-text">{t(lang, 'presale.buy.milestone2Text')}</span>
                  </div>
                </div>
                <div className="milestone">
                  <span className="milestone-dot"></span>
                  <div className="milestone-content">
                    <span className="milestone-date">{t(lang, 'presale.buy.milestone3Date')}</span>
                    <span className="milestone-text">{t(lang, 'presale.buy.milestone3Text')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────── FAQ SECTION ────────────── */}
      <section className="faq-section">
        <div className="section-header">
          <h2 className="section-title">{t(lang, 'presale.faq.title')}</h2>
        </div>

        <div className="faq-accordion">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`faq-item${openFaq === i ? ' open' : ''}`}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div className="faq-question">
                <span className="faq-number">{(i + 1).toString().padStart(2, '0')}</span>
                <span className="faq-text">{faq.question}</span>
                <span className="faq-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </span>
              </div>
              {openFaq === i && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ────────────── STICKY PRESALE BAR ────────────── */}
      <div className={`presale-bar${barVisible ? ' visible' : ''}`}>
        <div className="presale-bar-content">
          <div className="bar-progress">
            <div className="bar-progress-info">
              <span className="bar-progress-label">{t(lang, 'presale.bar.progressLabel')}</span>
              <span className="bar-progress-value">{PRESALE.progress}%</span>
            </div>
            <div className="progress-track">
              <div className="bar-progress-fill" style={{ width: `${PRESALE.progress}%` }}></div>
            </div>
          </div>

          <div className="bar-countdown">
            <span className="bar-countdown-label">{t(lang, 'presale.bar.endsIn')}</span>
            <div className="countdown-numbers">
              <div className="countdown-box">
                <span className="countdown-box-value">{countdown.days}</span>
                <span className="countdown-unit">d</span>
              </div>
              <span className="countdown-sep">:</span>
              <div className="countdown-box">
                <span className="countdown-box-value">{pad(countdown.hours)}</span>
                <span className="countdown-unit">h</span>
              </div>
              <span className="countdown-sep">:</span>
              <div className="countdown-box">
                <span className="countdown-box-value">{pad(countdown.minutes)}</span>
                <span className="countdown-unit">m</span>
              </div>
              <span className="countdown-sep">:</span>
              <div className="countdown-box">
                <span className="countdown-box-value">{pad(countdown.seconds)}</span>
                <span className="countdown-unit">s</span>
              </div>
            </div>
          </div>

          <a href="#buy" className="bar-cta">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
            {t(lang, 'presale.bar.buyButton').replace('{token}', TOKEN.symbol)}
          </a>
        </div>
      </div>

      {/* ════════════ ALL STYLES ════════════ */}
      <style>{`
        /* ─── HERO ─── */
        .presale-hero{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:60px 20px;position:relative;overflow:hidden}
        .hero-bg{position:absolute;inset:0;pointer-events:none}
        .hero-glow{position:absolute;top:-50%;left:50%;transform:translateX(-50%);width:150%;height:100%;background:radial-gradient(ellipse at center,rgba(248,176,59,.15) 0%,transparent 50%)}
        .hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(248,176,59,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(248,176,59,.03) 1px,transparent 1px);background-size:60px 60px;mask-image:radial-gradient(ellipse at center,black 30%,transparent 70%)}
        .hero-content{max-width:900px;text-align:center;position:relative;z-index:1}
        .token-badge{display:inline-flex;align-items:center;gap:10px;padding:10px 24px;background:rgba(248,176,59,.1);border:1px solid rgba(248,176,59,.3);border-radius:50px;margin-bottom:30px}
        .token-icon{font-size:20px;color:var(--color-primary)}
        .token-symbol{font-size:18px;font-weight:700;color:var(--color-white)}
        .token-status{font-size:12px;font-weight:600;color:#4ade80;text-transform:uppercase;letter-spacing:1px}
        .hero-title{font-size:clamp(36px,6vw,64px);font-weight:700;color:var(--color-white);line-height:1.1;margin-bottom:24px}
        .hero-title .highlight{display:block;color:var(--color-primary)}
        .hero-subtitle{font-size:clamp(16px,2vw,20px);color:var(--color-gray);line-height:1.6;max-width:700px;margin:0 auto 40px}
        .price-display{display:flex;align-items:center;justify-content:center;gap:40px;margin-bottom:40px;flex-wrap:wrap}
        .current-price,.listing-price{text-align:center}
        .price-label{display:block;font-size:14px;color:var(--color-gray);margin-bottom:8px;text-transform:uppercase;letter-spacing:1px}
        .price-value{font-size:48px;font-weight:700;color:var(--color-primary)}
        .price-unit{font-size:18px;color:var(--color-gray);margin-left:5px}
        .price-divider{width:1px;height:60px;background:var(--color-white-10)}
        .price-value-striked{font-size:32px;font-weight:600;color:var(--color-gray);text-decoration:line-through}
        .price-savings{display:block;margin-top:8px;padding:4px 12px;background:rgba(74,222,128,.2);border-radius:20px;color:#4ade80;font-size:14px;font-weight:600}
        .progress-section{max-width:500px;margin:0 auto 40px}
        .progress-header{display:flex;justify-content:space-between;margin-bottom:10px;font-size:14px;color:var(--color-gray)}
        .progress-percent{color:var(--color-primary);font-weight:600}
        .progress-bar{height:12px;background:var(--color-dark-gray);border-radius:10px;overflow:hidden}
        .progress-fill{height:100%;background:linear-gradient(90deg,var(--color-primary),#e9a235);border-radius:10px;transition:width .5s ease}
        .progress-stats{display:flex;justify-content:space-between;margin-top:10px;font-size:13px;color:var(--color-gray)}
        .progress-stats strong{color:var(--color-white)}
        .countdown-wrapper{margin-bottom:40px}
        .countdown-label{font-size:14px;color:var(--color-gray);margin-bottom:15px;text-transform:uppercase;letter-spacing:2px}
        .countdown{display:flex;justify-content:center;gap:15px}
        .countdown-item{display:flex;flex-direction:column;align-items:center;background:rgba(255,255,255,.05);border:1px solid var(--color-white-10);border-radius:12px;padding:20px;min-width:80px}
        .countdown-number{font-size:36px;font-weight:700;color:var(--color-white);font-variant-numeric:tabular-nums}
        .countdown-text{font-size:12px;color:var(--color-gray);text-transform:uppercase;letter-spacing:1px;margin-top:5px}
        .hero-ctas{display:flex;gap:16px;justify-content:center;flex-wrap:wrap}
        .cta-primary,.cta-secondary{display:inline-flex;align-items:center;gap:10px;padding:16px 32px;border-radius:12px;font-size:16px;font-weight:600;text-decoration:none;transition:all .3s ease}
        .cta-primary{background:var(--color-primary);color:var(--color-black)}
        .cta-primary:hover{background:#e9a235;transform:translateY(-2px);box-shadow:0 10px 30px rgba(248,176,59,.3)}
        .cta-secondary{background:rgba(255,255,255,.1);border:1px solid var(--color-white-20);color:var(--color-white)}
        .cta-secondary:hover{background:rgba(255,255,255,.15);border-color:var(--color-primary)}
        @media(max-width:768px){
          .price-display{flex-direction:column;gap:20px}
          .price-divider{width:60px;height:1px}
          .countdown{gap:10px}
          .countdown-item{padding:15px 12px;min-width:65px}
          .countdown-number{font-size:28px}
        }
        @media(max-width:480px){
          .hero-ctas{flex-direction:column;width:100%}
          .cta-primary,.cta-secondary{width:100%;justify-content:center}
          .countdown-item{padding:12px 8px;min-width:55px}
          .countdown-number{font-size:24px}
          .price-value{font-size:40px}
        }

        /* ─── BENEFITS ─── */
        .benefits-section{padding:80px 20px;background:rgba(248,176,59,.03)}
        .benefits-container{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
        .benefit-card{background:rgba(255,255,255,.03);border:1px solid var(--color-white-10);border-radius:16px;padding:30px;text-align:center;transition:all .3s ease}
        .benefit-card:hover{border-color:rgba(248,176,59,.3);transform:translateY(-5px)}
        .benefit-icon{font-size:40px;display:block;margin-bottom:16px}
        .benefit-title{font-size:18px;font-weight:600;color:var(--color-white);margin-bottom:10px}
        .benefit-description{font-size:14px;color:var(--color-gray);line-height:1.5}
        @media(max-width:1024px){.benefits-container{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:600px){.benefits-container{grid-template-columns:1fr}}

        /* ─── MANIFESTO ─── */
        .manifesto-section{padding:120px 20px;background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(248,176,59,.03) 50%,rgba(0,0,0,0) 100%)}
        .manifesto-container{max-width:800px;margin:0 auto}
        .manifesto-badge{display:inline-block;padding:8px 20px;background:rgba(248,176,59,.1);border:1px solid rgba(248,176,59,.3);border-radius:50px;font-size:12px;font-weight:600;color:var(--color-primary);letter-spacing:2px;margin-bottom:30px}
        .manifesto-title{font-size:clamp(32px,5vw,56px);font-weight:700;color:var(--color-white);line-height:1.1;margin-bottom:30px}
        .manifesto-lead{font-size:22px;color:var(--color-white);font-weight:500;line-height:1.6;margin-bottom:30px}
        .manifesto-collapsible{max-height:0;overflow:hidden;transition:max-height .5s ease,opacity .3s ease;opacity:0}
        .manifesto-collapsible.expanded{max-height:1500px;opacity:1}
        .manifesto-content{font-size:18px;line-height:1.8;color:var(--color-gray);padding-top:20px}
        .manifesto-content p{margin-bottom:24px}
        .manifesto-content strong{color:var(--color-white)}
        .manifesto-highlight{font-size:24px;font-weight:600;color:var(--color-primary);padding:30px 0;border-top:1px solid var(--color-white-10);border-bottom:1px solid var(--color-white-10);margin:40px 0;text-align:center}
        .manifesto-question{background:rgba(255,255,255,.03);border:1px solid var(--color-white-10);border-radius:20px;padding:40px;margin-top:50px;text-align:center}
        .manifesto-question p{margin-bottom:10px}
        .question-main{font-size:28px;font-weight:700;color:var(--color-white);margin:20px 0}
        .question-sub{font-size:16px;color:var(--color-gray);font-style:italic}
        .expand-btn{display:inline-flex;align-items:center;gap:8px;padding:12px 24px;background:rgba(248,176,59,.1);border:1px solid rgba(248,176,59,.3);border-radius:30px;color:var(--color-primary);font-size:14px;font-weight:600;cursor:pointer;transition:all .3s ease;margin-bottom:40px}
        .expand-btn:hover{background:rgba(248,176,59,.2)}
        .expand-icon{transition:transform .3s ease}
        .expand-btn.expanded .expand-icon{transform:rotate(180deg)}
        .manifesto-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:30px;margin-top:40px;padding-top:60px;border-top:1px solid var(--color-white-10)}
        .stat-item{text-align:center}
        .stat-number{display:block;font-size:42px;font-weight:700;color:var(--color-primary);margin-bottom:10px}
        .stat-label{font-size:14px;color:var(--color-gray);line-height:1.4}
        @media(max-width:768px){
          .manifesto-section{padding:80px 20px}
          .manifesto-lead{font-size:18px}
          .manifesto-content{font-size:16px}
          .manifesto-highlight{font-size:20px}
          .question-main{font-size:22px}
          .manifesto-stats{grid-template-columns:repeat(2,1fr);gap:30px 20px}
          .stat-number{font-size:32px}
        }
        @media(max-width:480px){
          .manifesto-question{padding:30px 20px}
          .manifesto-stats{grid-template-columns:1fr 1fr}
        }

        /* ─── SECTION HEADER (shared) ─── */
        .section-header{text-align:center;margin-bottom:60px}
        .section-badge{display:inline-block;padding:8px 20px;background:rgba(248,176,59,.15);border:1px solid rgba(248,176,59,.3);border-radius:50px;color:var(--color-primary);font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-bottom:20px}
        .section-title{font-size:clamp(28px,4vw,48px);font-weight:700;color:var(--color-white);margin-bottom:16px}
        .section-subtitle{font-size:clamp(16px,2vw,18px);color:var(--color-gray);max-width:600px;margin:0 auto}

        /* ─── TOKENOMICS ─── */
        .tokenomics-section{padding:100px 20px;max-width:1200px;margin:0 auto}
        .tokenomics-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
        .chart-visual{position:relative;max-width:300px;margin:0 auto}
        .donut-chart{width:100%;transform:rotate(-90deg)}
        .chart-segment{transition:opacity .3s ease}
        .chart-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center}
        .chart-total{display:block;font-size:20px;font-weight:700;color:var(--color-white)}
        .chart-label{font-size:12px;color:var(--color-gray);text-transform:uppercase}
        .token-allocation{display:flex;flex-direction:column;gap:16px}
        .allocation-item{display:flex;align-items:center;gap:16px;padding:16px;background:rgba(255,255,255,.03);border-radius:12px;transition:all .3s ease}
        .allocation-item:hover{background:rgba(255,255,255,.06)}
        .allocation-color{width:16px;height:16px;border-radius:4px;flex-shrink:0}
        .allocation-info{flex:1}
        .allocation-name{display:block;font-size:15px;color:var(--color-white);font-weight:500}
        .allocation-percent{font-size:13px;color:var(--color-gray)}
        .allocation-amount{font-size:14px;color:var(--color-primary);font-weight:600}
        @media(max-width:1024px){.tokenomics-grid{grid-template-columns:1fr;gap:40px}}

        /* ─── VESTING ─── */
        .vesting-section{padding:100px 20px;background:rgba(248,176,59,.03)}
        .vesting-container{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1.2fr;gap:60px;align-items:start}
        .vesting-highlight{display:flex;gap:20px;padding:24px;background:rgba(255,255,255,.03);border:1px solid var(--color-white-10);border-radius:16px;margin-bottom:20px;transition:all .3s ease}
        .vesting-highlight:hover{border-color:rgba(248,176,59,.3)}
        .highlight-icon{font-size:32px;flex-shrink:0}
        .highlight-content h3{font-size:18px;color:var(--color-white);margin-bottom:8px}
        .highlight-content p{font-size:14px;color:var(--color-gray);line-height:1.5;margin:0}
        .vesting-timeline{background:rgba(255,255,255,.03);border:1px solid var(--color-white-10);border-radius:20px;padding:30px}
        .timeline-header{font-size:16px;font-weight:600;color:var(--color-white);margin-bottom:24px}
        .timeline-item{display:grid;grid-template-columns:80px 1fr 50px;gap:16px;align-items:center;margin-bottom:16px}
        .timeline-phase{font-size:14px;color:var(--color-gray)}
        .timeline-bar{height:24px;background:rgba(255,255,255,.1);border-radius:12px;overflow:hidden}
        .timeline-fill{height:100%;background:linear-gradient(90deg,var(--color-primary),#e9a235);border-radius:12px;transition:width .5s ease}
        .timeline-percent{font-size:14px;font-weight:600;color:var(--color-primary);text-align:right}
        .timeline-total{display:flex;justify-content:space-between;align-items:center;margin-top:24px;padding-top:20px;border-top:1px solid var(--color-white-10);font-size:15px;color:var(--color-white)}
        .total-percent{font-size:20px;font-weight:700;color:var(--color-primary)}
        @media(max-width:1024px){.vesting-container{grid-template-columns:1fr}}

        /* ─── STAKING TIERS ─── */
        .staking-section{padding:100px 20px;max-width:1200px;margin:0 auto}
        .staking-bonus-banner{display:flex;align-items:center;justify-content:center;gap:12px;padding:16px 24px;background:linear-gradient(90deg,rgba(248,176,59,.15),rgba(248,176,59,.05));border:1px solid rgba(248,176,59,.3);border-radius:12px;margin-bottom:40px}
        .bonus-icon-banner{font-size:24px}
        .bonus-text{font-size:16px;color:var(--color-white)}
        .staking-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
        .staking-card{background:rgba(255,255,255,.03);border:1px solid var(--color-white-10);border-radius:20px;padding:32px;position:relative;transition:all .3s ease}
        .staking-card:hover{border-color:rgba(248,176,59,.3);transform:translateY(-5px)}
        .staking-card.recommended{border-color:var(--color-primary);background:rgba(248,176,59,.05)}
        .recommended-badge{position:absolute;top:-12px;left:50%;transform:translateX(-50%);padding:6px 16px;background:var(--color-primary);color:var(--color-black);font-size:12px;font-weight:700;border-radius:20px;text-transform:uppercase}
        .staking-header{text-align:center;margin-bottom:24px}
        .staking-name{font-size:24px;font-weight:700;color:var(--color-white);margin-bottom:6px}
        .staking-desc{font-size:14px;color:var(--color-gray)}
        .staking-apy{text-align:center;margin-bottom:16px}
        .apy-value{font-size:48px;font-weight:700;color:var(--color-primary)}
        .apy-label{display:block;font-size:14px;color:var(--color-gray)}
        .staking-bonus{text-align:center;margin-bottom:20px}
        .bonus-badge{display:inline-block;padding:4px 12px;background:rgba(74,222,128,.2);color:#4ade80;font-size:13px;font-weight:600;border-radius:20px}
        .total-apy{display:block;margin-top:8px;font-size:16px;font-weight:600;color:var(--color-white)}
        .staking-lock{display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;background:rgba(255,255,255,.05);border-radius:10px;margin-bottom:20px;color:var(--color-gray);font-size:14px}
        .staking-features{list-style:none;padding:0;margin:0 0 24px 0}
        .staking-features li{display:flex;align-items:center;gap:10px;padding:10px 0;font-size:14px;color:var(--color-white);border-bottom:1px solid var(--color-white-10)}
        .staking-features li:last-child{border-bottom:none}
        .staking-cta{width:100%;padding:14px;background:var(--color-primary);border:none;border-radius:12px;color:var(--color-black);font-size:16px;font-weight:600;cursor:pointer;transition:all .3s ease}
        .staking-cta:hover{background:#e9a235;transform:translateY(-2px)}
        @media(max-width:1024px){.staking-grid{grid-template-columns:1fr;max-width:400px;margin-left:auto;margin-right:auto}}
        @media(max-width:600px){.staking-bonus-banner{flex-direction:column;text-align:center;gap:8px}.apy-value{font-size:40px}}

        /* ─── STAKING CALCULATOR ─── */
        .calculator-wrapper{max-width:1200px;margin:0 auto;padding:0 20px 100px}
        .staking-calculator{background:rgba(255,255,255,.03);border:1px solid var(--color-white-10);border-radius:20px;padding:32px;margin-top:60px}
        .staking-calculator h4{font-size:20px;color:var(--color-white);margin-bottom:24px;text-align:center}
        .calc-inputs{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px}
        .calc-group label{display:block;font-size:14px;color:var(--color-gray);margin-bottom:8px}
        .calc-group input,.calc-group select{width:100%;padding:14px 16px;background:rgba(255,255,255,.05);border:1px solid var(--color-white-10);border-radius:10px;color:var(--color-white);font-size:16px;font-family:inherit;transition:all .3s ease;box-sizing:border-box}
        .calc-group select{cursor:pointer}
        .calc-group input:focus,.calc-group select:focus{outline:none;border-color:var(--color-primary)}
        .calc-results{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
        .calc-result{text-align:center;padding:20px;background:rgba(255,255,255,.03);border-radius:12px;transition:all .3s ease}
        .calc-result:hover{background:rgba(255,255,255,.05)}
        .calc-result.calc-highlight{background:rgba(248,176,59,.1);border:1px solid rgba(248,176,59,.3)}
        .result-label{display:block;font-size:13px;color:var(--color-gray);margin-bottom:8px}
        .result-value{font-size:20px;font-weight:700;color:var(--color-white)}
        .calc-result.calc-highlight .result-value{color:var(--color-primary)}
        @media(max-width:768px){.calc-inputs{grid-template-columns:1fr}.calc-results{grid-template-columns:1fr}}

        /* ─── BUY FORM ─── */
        .buy-section{padding:100px 20px;background:rgba(248,176,59,.03)}
        .buy-container{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:start}
        .buy-card{background:rgba(255,255,255,.03);border:2px solid var(--color-primary);border-radius:24px;padding:32px}
        .buy-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid var(--color-white-10)}
        .buy-price-label{display:block;font-size:13px;color:var(--color-gray);margin-bottom:4px}
        .buy-price-value{font-size:28px;font-weight:700;color:var(--color-primary)}
        .buy-limits{text-align:right;font-size:13px;color:var(--color-gray)}
        .buy-limits span{display:block}
        .buy-form{display:flex;flex-direction:column;gap:20px}
        .form-group label{display:block;font-size:14px;color:var(--color-white);margin-bottom:8px}
        .form-group input{width:100%;padding:14px 16px;background:rgba(255,255,255,.05);border:1px solid var(--color-white-10);border-radius:10px;color:var(--color-white);font-size:16px;font-family:inherit;transition:all .3s ease;box-sizing:border-box}
        .form-group input:focus{outline:none;border-color:var(--color-primary)}
        .form-group input::placeholder{color:var(--color-gray)}
        .input-with-max{position:relative}
        .input-with-max input{padding-right:70px}
        .max-btn{position:absolute;right:10px;top:50%;transform:translateY(-50%);padding:6px 12px;background:var(--color-primary);border:none;border-radius:6px;color:var(--color-black);font-size:12px;font-weight:700;cursor:pointer;transition:all .3s ease}
        .max-btn:hover{background:#e9a235}
        .tokens-preview{display:flex;justify-content:space-between;align-items:center;padding:16px;background:rgba(248,176,59,.1);border-radius:10px;font-size:14px;color:var(--color-gray)}
        .tokens-amount{font-size:18px;font-weight:700;color:var(--color-primary)}
        .payment-methods{padding:16px 0}
        .payment-label{display:block;font-size:14px;color:var(--color-gray);margin-bottom:12px}
        .payment-options{display:flex;gap:10px}
        .payment-btn{flex:1;padding:12px;background:rgba(255,255,255,.05);border:1px solid var(--color-white-10);border-radius:10px;color:var(--color-gray);font-size:14px;font-weight:600;cursor:pointer;transition:all .3s ease}
        .payment-btn:hover{border-color:rgba(248,176,59,.5)}
        .payment-btn.active{background:rgba(248,176,59,.2);border-color:var(--color-primary);color:var(--color-primary)}
        .checkbox-group{display:flex;align-items:center;gap:12px}
        .checkbox-group input[type="checkbox"]{width:20px;height:20px;accent-color:var(--color-primary);cursor:pointer;flex-shrink:0}
        .checkbox-group label{font-size:13px;color:var(--color-gray);margin-bottom:0}
        .checkbox-group a{color:var(--color-primary);text-decoration:underline}
        .buy-submit{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:18px;background:var(--color-primary);border:none;border-radius:14px;color:var(--color-black);font-size:18px;font-weight:700;cursor:pointer;transition:all .3s ease}
        .buy-submit:hover{background:#e9a235;transform:translateY(-2px);box-shadow:0 10px 30px rgba(248,176,59,.3)}
        .buy-security{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:16px;font-size:13px;color:var(--color-gray)}
        .buy-info h3{font-size:28px;font-weight:700;color:var(--color-white);margin-bottom:32px}
        .info-cards{display:flex;flex-direction:column;gap:16px}
        .info-card{padding:24px;background:rgba(255,255,255,.03);border:1px solid var(--color-white-10);border-radius:16px;transition:all .3s ease}
        .info-card:hover{border-color:rgba(248,176,59,.4);background:rgba(248,176,59,.05);transform:translateX(8px)}
        .info-card-icon{display:flex;align-items:center;justify-content:center;width:48px;height:48px;background:rgba(248,176,59,.15);border-radius:12px;color:var(--color-primary);margin-bottom:16px}
        .info-card h4{font-size:18px;font-weight:600;color:var(--color-white);margin-bottom:10px}
        .info-card p{font-size:14px;color:var(--color-gray);line-height:1.6;margin:0}
        .roadmap-preview{margin-top:32px;padding:28px;background:linear-gradient(135deg,rgba(248,176,59,.08) 0%,rgba(248,176,59,.02) 100%);border:1px solid rgba(248,176,59,.2);border-radius:20px}
        .roadmap-header{display:flex;align-items:center;gap:12px;margin-bottom:24px;color:var(--color-primary)}
        .roadmap-header h4{font-size:18px;font-weight:600;color:var(--color-white);margin:0}
        .milestones{display:flex;flex-direction:column;gap:0;position:relative;padding-left:20px}
        .milestones::before{content:'';position:absolute;left:5px;top:8px;bottom:8px;width:2px;background:linear-gradient(180deg,var(--color-primary) 0%,rgba(248,176,59,.2) 100%);border-radius:2px}
        .milestone{display:flex;align-items:flex-start;gap:16px;padding:14px 0;position:relative}
        .milestone-dot{position:absolute;left:-20px;top:18px;width:12px;height:12px;background:var(--color-primary);border-radius:50%;box-shadow:0 0 0 4px rgba(248,176,59,.2)}
        .milestone-content{display:flex;flex-direction:column;gap:4px}
        .milestone-date{font-size:13px;font-weight:700;color:var(--color-primary);text-transform:uppercase;letter-spacing:.5px}
        .milestone-text{font-size:15px;color:var(--color-white);font-weight:500}
        @media(max-width:1024px){.buy-container{grid-template-columns:1fr}.buy-info{order:-1}}
        @media(max-width:600px){.payment-options{flex-wrap:wrap}.payment-btn{flex:1 1 calc(50% - 5px)}}

        /* ─── FAQ ─── */
        .faq-section{padding:100px 20px;max-width:800px;margin:0 auto}
        .faq-accordion{display:flex;flex-direction:column;gap:12px}
        .faq-item{background:rgba(255,255,255,.03);border:1px solid var(--color-white-10);border-radius:16px;overflow:hidden;transition:all .3s ease;cursor:pointer}
        .faq-item:hover{border-color:rgba(248,176,59,.3)}
        .faq-item.open{background:rgba(248,176,59,.05);border-color:rgba(248,176,59,.3)}
        .faq-question{display:flex;align-items:center;gap:16px;padding:24px;user-select:none}
        .faq-number{font-size:14px;font-weight:700;color:var(--color-primary);opacity:.5;min-width:24px}
        .faq-text{flex:1;font-size:17px;font-weight:500;color:var(--color-white);line-height:1.4}
        .faq-icon{display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:8px;background:rgba(255,255,255,.05);color:var(--color-gray);transition:all .3s ease;flex-shrink:0}
        .faq-item.open .faq-icon{background:var(--color-primary);color:var(--color-black);transform:rotate(45deg)}
        .faq-answer{padding:0 24px 24px 64px;animation:fadeInFaq .3s ease}
        .faq-answer p{font-size:15px;color:var(--color-gray);line-height:1.7;margin:0}
        @keyframes fadeInFaq{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
        @media(max-width:768px){
          .faq-question{padding:20px}
          .faq-answer{padding:0 20px 20px 20px}
          .faq-number{display:none}
          .faq-text{font-size:16px}
        }

        /* ─── PRESALE BAR ─── */
        .presale-bar{position:fixed;bottom:0;left:0;right:0;z-index:100;background:linear-gradient(135deg,rgba(0,0,0,.98) 0%,rgba(20,20,20,.98) 100%);backdrop-filter:blur(12px);border-top:2px solid;border-image:linear-gradient(90deg,transparent 0%,rgba(248,176,59,.6) 50%,transparent 100%) 1;box-shadow:0 -8px 32px rgba(0,0,0,.4);transform:translateY(100%);transition:transform .4s cubic-bezier(.4,0,.2,1)}
        .presale-bar.visible{transform:translateY(0)}
        .presale-bar-content{max-width:1400px;margin:0 auto;padding:20px 32px;display:grid;grid-template-columns:1fr auto auto;align-items:center;gap:40px}
        .bar-progress{min-width:200px}
        .bar-progress-info{display:flex;justify-content:space-between;margin-bottom:8px;font-size:12px}
        .bar-progress-label{color:var(--color-gray);font-weight:500}
        .bar-progress-value{color:var(--color-primary);font-weight:700}
        .progress-track{height:6px;background:rgba(255,255,255,.08);border-radius:10px;overflow:hidden}
        .bar-progress-fill{height:100%;background:linear-gradient(90deg,var(--color-primary) 0%,#e9a235 100%);border-radius:10px;transition:width .5s ease;box-shadow:0 0 12px rgba(248,176,59,.5)}
        .bar-countdown{display:flex;align-items:center;gap:16px}
        .bar-countdown-label{font-size:13px;color:var(--color-gray);font-weight:500;white-space:nowrap}
        .countdown-numbers{display:flex;align-items:center;gap:8px}
        .countdown-box{display:flex;flex-direction:column;align-items:center;background:rgba(248,176,59,.08);border:1px solid rgba(248,176,59,.2);border-radius:8px;padding:6px 10px;min-width:48px}
        .countdown-box-value{font-size:20px;font-weight:700;color:var(--color-white);font-variant-numeric:tabular-nums;line-height:1}
        .countdown-unit{font-size:10px;color:var(--color-gray);font-weight:600;text-transform:uppercase;margin-top:2px}
        .countdown-sep{font-size:18px;color:var(--color-primary);font-weight:300}
        .bar-cta{display:inline-flex;align-items:center;gap:10px;padding:14px 28px;background:linear-gradient(135deg,var(--color-primary) 0%,#e9a235 100%);border-radius:12px;color:var(--color-black);font-size:15px;font-weight:700;text-decoration:none;white-space:nowrap;transition:all .3s ease;box-shadow:0 4px 16px rgba(248,176,59,.3)}
        .bar-cta:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(248,176,59,.5)}
        .bar-cta svg{animation:barPulse 2s ease-in-out infinite}
        @keyframes barPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
        @media(max-width:1200px){.presale-bar-content{gap:24px}.bar-progress{min-width:160px}}
        @media(max-width:1024px){.presale-bar-content{grid-template-columns:1fr auto;gap:20px}.bar-progress{grid-column:1/-1}}
        @media(max-width:768px){
          .presale-bar-content{padding:16px 20px;grid-template-columns:1fr;gap:16px}
          .bar-countdown{justify-content:center}
          .bar-countdown-label{font-size:12px}
          .countdown-box{padding:4px 8px;min-width:40px}
          .countdown-box-value{font-size:18px}
          .bar-cta{width:100%;justify-content:center}
        }
        @media(max-width:480px){
          .countdown-numbers{gap:4px}
          .countdown-box{min-width:36px;padding:4px 6px}
          .countdown-box-value{font-size:16px}
          .countdown-sep{font-size:14px}
        }
      `}</style>
    </>
  );
}
