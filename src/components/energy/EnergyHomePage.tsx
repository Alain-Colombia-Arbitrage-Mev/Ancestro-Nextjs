'use client';
import { useState } from 'react';
import { t } from '@/i18n/translations';
import { CDN_URL } from '@/lib/cdn';

interface Props { lang: string }

const IMG = `${CDN_URL}/energy-home`;
const FLAGS = `${CDN_URL}/images/flags`;

const energyFlowSteps = [
  { key: 'wifi', titleKey: 'energyHome.flow.wifi.title', descKey: 'energyHome.flow.wifi.desc' },
  { key: 'use', titleKey: 'energyHome.flow.use.title', descKey: 'energyHome.flow.use.desc' },
  { key: 'store', titleKey: 'energyHome.flow.store.title', descKey: 'energyHome.flow.store.desc' },
  { key: 'charge', titleKey: 'energyHome.flow.charge.title', descKey: 'energyHome.flow.charge.desc' },
];

const switchingCards = [
  { key: 'card1', titleKey: 'energyHome.switching.card1' },
  { key: 'card2', titleKey: 'energyHome.switching.card2' },
  { key: 'card3', titleKey: 'energyHome.switching.card3' },
  { key: 'card4', titleKey: 'energyHome.switching.card4' },
];

const plans = [
  { key: 'solar', image: 'plan-solar.webp', tagline: 'plan.solar.tagline', fit: 'cover' as const },
  { key: 'battery', image: 'battery-product.webp', tagline: 'plan.battery.tagline', fit: 'contain' as const },
  { key: 'bundle', image: 'plan-bundle.webp', tagline: 'plan.bundle.tagline', featured: true, fit: 'cover' as const },
];

const solarFeatures = [
  { key: 'aesthetic', titleKey: 'energyHome.solarFeat.aesthetic.title', descKey: 'energyHome.solarFeat.aesthetic.desc' },
  { key: 'weather', titleKey: 'energyHome.solarFeat.weather.title', descKey: 'energyHome.solarFeat.weather.desc' },
  { key: 'easy', titleKey: 'energyHome.solarFeat.easy.title', descKey: 'energyHome.solarFeat.easy.desc' },
  { key: 'profile', titleKey: 'energyHome.solarFeat.profile.title', descKey: 'energyHome.solarFeat.profile.desc' },
];

const batteryFeatures = [
  { key: 'noOutages', titleKey: 'energyHome.batteryFeat.noOutages.title', descKey: 'energyHome.batteryFeat.noOutages.desc' },
  { key: 'peace', titleKey: 'energyHome.batteryFeat.peace.title', descKey: 'energyHome.batteryFeat.peace.desc' },
  { key: 'easy', titleKey: 'energyHome.batteryFeat.easy.title', descKey: 'energyHome.batteryFeat.easy.desc' },
  { key: 'weather', titleKey: 'energyHome.batteryFeat.weather.title', descKey: 'energyHome.batteryFeat.weather.desc' },
];

const appFeatures = [
  { key: 'customize', titleKey: 'energyHome.appFeat.customize.title', descKey: 'energyHome.appFeat.customize.desc' },
  { key: 'monitor', titleKey: 'energyHome.appFeat.monitor.title', descKey: 'energyHome.appFeat.monitor.desc' },
  { key: 'alerts', titleKey: 'energyHome.appFeat.alerts.title', descKey: 'energyHome.appFeat.alerts.desc' },
];

const latamFlags = [
  'colombia', 'panama', 'dominican-republic', 'mexico', 'peru', 'guatemala',
  'el-salvador', 'uruguay', 'costa-rica', 'brazil', 'nicaragua', 'honduras',
  'chile', 'argentina', 'bolivia', 'belize', 'ecuador', 'paraguay'
];


export default function EnergyHomePage({ lang }: Props) {
  const [activeFlow, setActiveFlow] = useState(0);
  const [productTab, setProductTab] = useState<'solar' | 'battery'>('solar');

  const activeFeatures = productTab === 'solar' ? solarFeatures : batteryFeatures;

  return (
    <div className="eh-page">
      {/* 1. HERO SECTION */}
      <section className="eh-hero">
        <div className="eh-hero-bg">
          <video
            className="eh-hero-video"
            src={`${IMG}/hero-video.mp4`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={`${IMG}/hero-bg.webp`}
            aria-hidden="true"
          />
          <div className="eh-hero-gradient" />
        </div>
        <div className="eh-hero-content">
          <h1 className="eh-hero-title">{t(lang, 'energyHome.hero.title')}</h1>
          <p className="eh-hero-subtitle">{t(lang, 'energyHome.hero.subtitle')}</p>
          <div className="eh-hero-cta-wrap">
            <button type="button" className="eh-cta-glass">{t(lang, 'energyHome.hero.cta')}</button>
          </div>
        </div>
      </section>

      {/* 2. CLEAN ENERGY - with background image */}
      <section className="eh-section eh-clean">
        <img src={`${IMG}/clean-energy-house.webp`} alt="" className="eh-fullbg" />
        <div className="eh-clean-overlay" />
        <div className="eh-container eh-clean-inner">
          <h2 className="eh-clean-title">{t(lang, 'energyHome.clean.title')}</h2>
          <p className="eh-clean-desc">{t(lang, 'energyHome.clean.desc')}</p>
        </div>
      </section>

      {/* 3. SWITCHING TO ANCESTRO - 4 glass cards overlaid */}
      <section className="eh-section eh-switching">
        <div className="eh-container">
          <h2 className="eh-switching-title">{t(lang, 'energyHome.switching.title')}</h2>
          <div className="eh-switching-cards">
            {switchingCards.map((card) => (
              <div key={card.key} className="eh-switching-card">
                <span className="eh-switching-card-text">{t(lang, card.titleKey)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SOLAR FLOW CAROUSEL */}
      <section className="eh-section eh-flow">
        <img src={`${IMG}/night-house-bg.webp`} alt="" className="eh-fullbg" />
        <div className="eh-flow-overlay" />
        <div className="eh-flow-content">
          <h2 className="eh-flow-heading">{t(lang, 'energyHome.install.title')}</h2>
          <p className="eh-flow-subheading">{t(lang, 'energyHome.install.desc')}</p>
          <div className="eh-flow-panel">
            <h3 className="eh-flow-title">{t(lang, energyFlowSteps[activeFlow].titleKey)}</h3>
            <p className="eh-flow-desc">{t(lang, energyFlowSteps[activeFlow].descKey)}</p>
            <button type="button" className="eh-cta-glass">{t(lang, 'energyHome.flow.cta')}</button>
          </div>
          <div className="eh-flow-dots">
            {energyFlowSteps.map((step, i) => (
              <button
                type="button"
                key={step.key}
                className={`eh-dot ${i === activeFlow ? 'active' : ''}`}
                onClick={() => setActiveFlow(i)}
                aria-label={t(lang, step.titleKey)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. PRODUCT TABS - SOLAR/BATTERY */}
      <section className="eh-section eh-product-tabs">
        <div className="eh-container">
          <div className="eh-product-tabs-nav">
            <button
              type="button"
              className={`eh-product-tab ${productTab === 'solar' ? 'active' : ''}`}
              onClick={() => setProductTab('solar')}
            >
              {t(lang, 'energyHome.product.solar')}
            </button>
            <button
              type="button"
              className={`eh-product-tab ${productTab === 'battery' ? 'active' : ''}`}
              onClick={() => setProductTab('battery')}
            >
              {t(lang, 'energyHome.product.battery')}
            </button>
          </div>
          <div className="eh-product-stage">
            <img
              src={`${IMG}/${productTab === 'solar' ? 'product-solar.webp' : 'product-battery.webp'}`}
              alt=""
              className="eh-product-image"
            />
          </div>
          <div className="eh-product-features">
            {activeFeatures.map((f, i) => (
              <div key={f.key} className={`eh-product-feat ${i === 0 ? 'active' : ''}`}>
                <h4 className="eh-product-feat-title">{t(lang, f.titleKey)}</h4>
                <p className="eh-product-feat-desc">{t(lang, f.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CHOOSE YOUR ENERGY COVERAGE - PLANS */}
      <section className="eh-section eh-plans">
        <div className="eh-container">
          <h2 className="eh-plans-title">{t(lang, 'energyHome.plans.title')}</h2>
          <div className="eh-plans-grid">
            {plans.map((plan) => (
              <div key={plan.key} className={`eh-plan-card ${plan.featured ? 'featured' : ''}`}>
                <div className={`eh-plan-image eh-plan-image-${plan.fit}`}>
                  <img src={`${IMG}/${plan.image}`} alt={t(lang, `energyHome.plans.${plan.key}.title`)} />
                </div>
                <div className="eh-plan-body">
                  <h3 className="eh-plan-title">{t(lang, `energyHome.plans.${plan.key}.title`)}</h3>
                  <p className="eh-plan-desc">{t(lang, `energyHome.plans.${plan.key}.desc`)}</p>
                  <p className="eh-plan-tagline">{t(lang, plan.tagline)}</p>
                </div>
                <button type="button" className="eh-plan-cta eh-cta-glass">{t(lang, 'energyHome.plans.cta')}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. ANCESTRO MAKES IT EASY */}
      <section className="eh-section eh-makes-easy">
        <div className="eh-container eh-makes-easy-wrap">
          <div className="eh-makes-easy-text">
            <h2 className="eh-makes-easy-title">{t(lang, 'energyHome.makesEasy.title')}</h2>
            <p className="eh-makes-easy-desc">{t(lang, 'energyHome.makesEasy.desc')}</p>
          </div>
          <div className="eh-makes-easy-image">
            <img src={`${IMG}/installer-man.webp`} alt="" />
          </div>
        </div>
      </section>

      {/* 8. GRID GOES DOWN */}
      <section className="eh-section eh-grid-down">
        <img src={`${IMG}/grid-down-bg.webp`} alt="" className="eh-fullbg" />
        <div className="eh-grid-down-overlay" />
        <div className="eh-container eh-grid-down-content">
          <h2 className="eh-grid-down-title">{t(lang, 'energyHome.gridDown.title')}</h2>
          <p className="eh-grid-down-desc">{t(lang, 'energyHome.gridDown.desc')}</p>
        </div>
      </section>

      {/* 9. ANCESTRO APP */}
      <section className="eh-section eh-app">
        <div className="eh-container">
          <div className="eh-app-top">
            <div className="eh-app-text">
              <h2 className="eh-app-title">{t(lang, 'energyHome.app.title')}</h2>
              <p className="eh-app-desc">{t(lang, 'energyHome.app.desc')}</p>
              <a href="#" className="eh-app-badge">
                <img src={`${IMG}/google-play-badge.webp`} alt="Google Play" />
              </a>
            </div>
            <div className="eh-app-phone">
              <img src={`${IMG}/app-phone-v2.webp`} alt="Ancestro App" />
              <div className="eh-app-phone-gradient" />
            </div>
          </div>
          <div className="eh-app-features">
            {appFeatures.map((f) => (
              <div key={f.key} className="eh-app-feature">
                <h4 className="eh-app-feature-title">{t(lang, f.titleKey)}</h4>
                <p className="eh-app-feature-desc">{t(lang, f.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. GETTING TO POWER ON */}
      <section className="eh-section eh-powerOn">
        <img src={`${IMG}/power-on-bg.webp`} alt="" className="eh-fullbg" />
        <div className="eh-powerOn-overlay" />
        <div className="eh-container eh-powerOn-content">
          <h2 className="eh-powerOn-title">{t(lang, 'energyHome.powerOn.title')}</h2>
          <p className="eh-powerOn-desc">{t(lang, 'energyHome.powerOn.desc')}</p>
        </div>
      </section>

      {/* 11. INSTALL SOLAR + BATTERY */}
      <section className="eh-section eh-install">
        <div className="eh-container eh-install-wrap">
          <div className="eh-install-text">
            <h2 className="eh-install-title">{t(lang, 'energyHome.installCta.title')}</h2>
            <p className="eh-install-desc">{t(lang, 'energyHome.installCta.desc')}</p>
            <button type="button" className="eh-cta-glass eh-install-cta">{t(lang, 'energyHome.installCta.cta')}</button>
          </div>
          <div className="eh-install-image">
            <img src={`${IMG}/battery-product.webp`} alt="Ancestro Battery" />
          </div>
        </div>
      </section>

      {/* 12. LATAM MAP */}
      <section className="eh-section eh-latam">
        <img src={`${IMG}/latam-map-full.webp`} alt="" className="eh-fullbg" />
        <div className="eh-container eh-latam-content">
          <div className="eh-latam-header">
            <h2 className="eh-latam-title">{t(lang, 'energyHome.latam.title')}</h2>
            <p className="eh-latam-desc">{t(lang, 'energyHome.latam.desc')}</p>
            <div className="eh-flags">
              {latamFlags.map((flag) => (
                <div key={flag} className="eh-flag">
                  <img src={`${FLAGS}/${flag}.png`} alt={flag} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
          <div className="eh-stats">
            <div className="eh-stat">
              <div className="eh-stat-icon"><img src={`${IMG}/icon-pin.webp`} alt="" /></div>
              <div className="eh-stat-body">
                <span className="eh-stat-num">18+</span>
                <span className="eh-stat-label">{t(lang, 'energyHome.latam.countries')}</span>
              </div>
            </div>
            <div className="eh-stat">
              <div className="eh-stat-icon"><img src={`${IMG}/icon-solar.webp`} alt="" /></div>
              <div className="eh-stat-body">
                <span className="eh-stat-num">25,000+</span>
                <span className="eh-stat-label">{t(lang, 'energyHome.latam.installations')}</span>
              </div>
            </div>
            <div className="eh-stat">
              <div className="eh-stat-icon"><img src={`${IMG}/icon-helmet.webp`} alt="" /></div>
              <div className="eh-stat-body">
                <span className="eh-stat-num">500+</span>
                <span className="eh-stat-label">{t(lang, 'energyHome.latam.installers')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. FINAL CTA / FOOTER */}
      <section className="eh-section eh-finalcta">
        <img src={`${IMG}/final-cta-bg.webp`} alt="" className="eh-fullbg" />
        <div className="eh-finalcta-overlay" />
        <div className="eh-container eh-finalcta-content">
          <h2 className="eh-finalcta-title">{t(lang, 'energyHome.finalCta.title')}</h2>
          <p className="eh-finalcta-desc">{t(lang, 'energyHome.finalCta.desc')}</p>
          <button type="button" className="eh-cta-glass">{t(lang, 'energyHome.finalCta.cta')}</button>
        </div>
      </section>

      <style>{`
        .eh-page{background:#000;color:#fff;font-family:Inter,sans-serif;overflow-x:hidden}
        .eh-container{max-width:1280px;margin:0 auto;padding:0 24px;width:100%}
        .eh-section{position:relative;padding:120px 0}
        .eh-fullbg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}

        /* BUTTONS */
        .eh-cta-glass{padding:12px 30px;background:rgba(255,255,255,0.1);backdrop-filter:blur(26px);-webkit-backdrop-filter:blur(26px);border:1px solid rgba(255,255,255,0.15);border-radius:15px;color:#fff;font-family:inherit;font-size:15px;font-weight:600;cursor:pointer;transition:all 0.3s ease}
        .eh-cta-glass:hover{background:rgba(248,176,59,0.2);border-color:rgba(248,176,59,0.5)}

        /* 1. HERO */
        .eh-hero{position:relative;height:100vh;min-height:720px;display:flex;align-items:center;justify-content:center;overflow:hidden}
        .eh-hero-bg{position:absolute;inset:0;z-index:0}
        .eh-hero-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none}
        .eh-hero-gradient{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.45) 0%,rgba(0,0,0,0) 40%,rgba(0,0,0,0.85) 100%)}
        .eh-hero-content{position:relative;z-index:1;text-align:center;padding:0 24px;max-width:1100px;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:center;gap:16px}
        .eh-hero-title{font-size:50px;font-weight:600;line-height:1.05;color:#fff;margin:0;text-shadow:0 2px 20px rgba(0,0,0,0.5)}
        .eh-hero-subtitle{font-size:20px;font-weight:600;color:#fff;margin:0;text-shadow:0 2px 12px rgba(0,0,0,0.5)}
        .eh-hero-cta-wrap{position:absolute;bottom:80px;left:50%;transform:translateX(-50%)}

        /* 2. CLEAN ENERGY - with bg image */
        .eh-clean{position:relative;min-height:800px;display:flex;align-items:flex-start;padding:0;overflow:hidden}
        .eh-clean-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.7) 0%,rgba(0,0,0,0) 40%,rgba(0,0,0,0) 60%,rgba(0,0,0,0.7) 100%)}
        .eh-clean-inner{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:20px;padding:49px 24px 60px;max-width:1200px}
        .eh-clean-title{font-size:34px;font-weight:600;line-height:1.15;color:#fff;text-align:center;margin:0}
        .eh-clean-desc{font-size:20px;font-weight:400;line-height:1.6;color:#a3a3a3;text-align:center;margin:0;max-width:1162px;white-space:pre-line}

        /* 3. SWITCHING TO ANCESTRO - 4 glass cards */
        .eh-switching{position:relative;z-index:2;margin-top:-80px;padding:60px 0 80px}
        .eh-switching .eh-container{display:flex;flex-direction:column;align-items:center;gap:40px}
        .eh-switching-title{font-size:34px;font-weight:600;color:#fff;text-align:center;margin:0}
        .eh-switching-cards{display:flex;gap:50px;width:100%;justify-content:center}
        .eh-switching-card{flex:1;max-width:280px;padding:20px;background:rgba(255,255,255,0.05);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.1);border-radius:10px;display:flex;align-items:center;justify-content:center;text-align:center;min-height:100px}
        .eh-switching-card-text{font-size:24px;font-weight:500;color:#fff;white-space:pre-line;line-height:1.4}

        /* 4. SOLAR FLOW CAROUSEL */
        .eh-flow{position:relative;min-height:1080px;padding:0;display:flex;align-items:center;justify-content:center;overflow:hidden}
        .eh-flow-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.6) 0%,rgba(0,0,0,0) 35%,rgba(0,0,0,0) 65%,rgba(0,0,0,0.9) 100%)}
        .eh-flow-content{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;width:100%;height:100%;min-height:1080px;padding:0 24px}
        .eh-flow-heading{font-size:34px;font-weight:500;color:#fff;text-align:center;margin:0;padding-top:195px;width:100%}
        .eh-flow-subheading{font-size:14px;font-weight:400;color:#a3a3a3;text-align:center;margin:16px 0 0;max-width:821px}
        .eh-flow-panel{position:absolute;bottom:200px;left:50%;transform:translateX(-50%);text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px}
        .eh-flow-title{font-size:34px;font-weight:600;color:#fff;margin:0}
        .eh-flow-desc{font-size:20px;font-weight:400;color:#a3a3a3;margin:0}
        .eh-flow-dots{position:absolute;bottom:58px;left:50%;transform:translateX(-50%);display:flex;gap:10px}
        .eh-dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.1);border:none;cursor:pointer;transition:all 0.3s ease;padding:0}
        .eh-dot.active{background:#f8b03b;width:28px;border-radius:999px}
        .eh-dot:hover:not(.active){background:rgba(255,255,255,0.3)}

        /* 5. PRODUCT TABS */
        .eh-product-tabs{padding:80px 0}
        .eh-product-tabs-nav{display:flex;justify-content:center;gap:10px;margin-bottom:30px}
        .eh-product-tab{padding:12px 32px;background:rgba(255,255,255,0.1);backdrop-filter:blur(26px);-webkit-backdrop-filter:blur(26px);border:1px solid rgba(255,255,255,0.1);border-radius:999px;color:rgba(255,255,255,0.8);font-family:inherit;font-size:15px;font-weight:600;cursor:pointer;transition:all 0.25s ease}
        .eh-product-tab:hover{background:rgba(255,255,255,0.15);color:#fff}
        .eh-product-tab.active{background:#f8b03b;border-color:#f8b03b;color:#000}
        .eh-product-stage{width:100%;max-height:800px;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);margin-bottom:40px}
        .eh-product-image{width:100%;height:100%;object-fit:cover;display:block;max-height:800px}
        .eh-product-features{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;border-top:2px solid #424242;padding-top:28px}
        .eh-product-feat{padding-top:12px;border-top:2px solid transparent;margin-top:-16px}
        .eh-product-feat.active{border-top-color:#f8b03b}
        .eh-product-feat-title{font-size:24px;font-weight:600;color:#a3a3a3;margin:0 0 15px}
        .eh-product-feat.active .eh-product-feat-title{color:#f8b03b}
        .eh-product-feat-desc{font-size:16px;font-weight:400;color:#a3a3a3;line-height:1.6;margin:0}
        .eh-product-feat.active .eh-product-feat-desc{color:#fff}

        /* 6. PLANS */
        .eh-plans{padding:40px 0;background:#000}
        .eh-plans .eh-container{display:flex;flex-direction:column;align-items:center;gap:34px}
        .eh-plans-title{font-size:34px;font-weight:500;color:#fff;text-align:center;margin:0}
        .eh-plans-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:30px;width:100%}
        .eh-plan-card{display:flex;flex-direction:column;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.1);border-radius:20px;overflow:hidden;padding:10px 10px 30px 10px;gap:17px;transition:all 0.3s ease}
        .eh-plan-card:hover{border-color:rgba(248,176,59,0.4);transform:translateY(-4px)}
        .eh-plan-card.featured{border-color:rgba(248,176,59,0.35)}
        .eh-plan-image{width:100%;height:257px;border-radius:20px;overflow:hidden;background:rgba(255,255,255,0.04);display:flex;align-items:center;justify-content:center}
        .eh-plan-image-cover img{width:100%;height:100%;object-fit:cover}
        .eh-plan-image-contain{background:linear-gradient(160deg,rgba(255,255,255,0.06) 0%,rgba(0,0,0,0.2) 100%)}
        .eh-plan-image-contain img{max-width:80%;max-height:90%;width:auto;height:auto;object-fit:contain}
        .eh-plan-body{padding:15px 30px;flex:1;display:flex;flex-direction:column;gap:17px}
        .eh-plan-title{font-size:22px;font-weight:600;color:#fff;margin:0}
        .eh-plan-desc{font-size:14px;color:rgba(255,255,255,0.7);line-height:1.6;margin:0}
        .eh-plan-tagline{font-size:12px;font-style:italic;color:rgba(255,255,255,0.8);line-height:1.4;margin:0}
        .eh-plan-card.featured .eh-plan-tagline{color:#f8b03b}
        .eh-plan-cta{margin:0 30px;align-self:stretch}

        /* 7. ANCESTRO MAKES IT EASY */
        .eh-makes-easy{padding:0;overflow:hidden;background:#000}
        .eh-makes-easy-wrap{display:flex;align-items:center;gap:161px;max-width:1920px;padding:0}
        .eh-makes-easy-text{flex:0 0 auto;max-width:500px;padding:80px 0 80px 50px}
        .eh-makes-easy-title{font-size:24px;font-weight:500;color:#fff;margin:0 0 20px}
        .eh-makes-easy-desc{font-size:14px;font-weight:400;color:#a3a3a3;line-height:1.78;margin:0}
        .eh-makes-easy-image{flex:1;display:flex;justify-content:flex-end;overflow:hidden}
        .eh-makes-easy-image img{width:977px;max-width:100%;height:614px;object-fit:cover;border-radius:20px 0 0 20px}

        /* 8. GRID GOES DOWN */
        .eh-grid-down{position:relative;min-height:720px;padding:200px 0;display:flex;align-items:flex-end}
        .eh-grid-down-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.3) 0%,rgba(0,0,0,0.95) 100%)}
        .eh-grid-down-content{position:relative;z-index:1}
        .eh-grid-down-title{font-size:34px;font-weight:500;color:#fff;margin:0 0 12px}
        .eh-grid-down-desc{font-size:14px;font-weight:400;color:#a3a3a3;margin:0;line-height:1.7}

        /* 9. ANCESTRO APP - text LEFT, phone RIGHT */
        .eh-app{padding:0;background:#000;overflow:hidden}
        .eh-app .eh-container{max-width:1922px;padding:0}
        .eh-app-top{display:flex;align-items:flex-start;gap:60px;padding:80px 50px 0}
        .eh-app-text{display:flex;flex-direction:column;justify-content:space-between;height:273px;gap:10px;flex:0 0 auto;max-width:500px}
        .eh-app-title{font-size:34px;font-weight:500;color:#fff;margin:0;text-align:left}
        .eh-app-desc{font-size:14px;font-weight:400;color:#a3a3a3;line-height:1.7;margin:0;max-width:428px;text-align:left}
        .eh-app-badge{display:inline-block}
        .eh-app-badge img{width:232px;height:69px;object-fit:contain}
        .eh-app-phone{flex:1;display:flex;justify-content:center;position:relative}
        .eh-app-phone>img{width:700px;max-width:100%;height:auto;object-fit:contain}
        .eh-app-phone-gradient{position:absolute;bottom:0;left:0;right:0;height:120px;background:linear-gradient(180deg,transparent,#000)}
        .eh-app-features{display:flex;gap:50px;max-width:1128px;margin:60px auto 80px;padding:0 50px}
        .eh-app-feature{flex:1;padding:20px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.1);border-radius:10px;display:flex;flex-direction:column;gap:10px}
        .eh-app-feature-title{font-size:24px;font-weight:500;color:#fff;margin:0}
        .eh-app-feature-desc{font-size:14px;font-weight:400;color:#a3a3a3;line-height:1.78;margin:0}

        /* 10. POWER ON */
        .eh-powerOn{position:relative;min-height:1080px;padding:0;display:flex;align-items:flex-end;overflow:hidden}
        .eh-powerOn-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0.5) 50%,rgba(0,0,0,0.95) 100%)}
        .eh-powerOn-content{position:relative;z-index:1;max-width:900px;padding:0 24px 80px}
        .eh-powerOn-title{font-size:34px;font-weight:500;color:#fff;margin:0 0 12px}
        .eh-powerOn-desc{font-size:14px;font-weight:400;color:#a3a3a3;margin:0;line-height:1.7}

        /* 11. INSTALL SOLAR + BATTERY */
        .eh-install{padding:0 0 0 50px;background:#000;display:flex;align-items:center}
        .eh-install-wrap{display:flex;align-items:center;gap:80px;max-width:1920px;width:100%;padding:80px 0}
        .eh-install-text{flex:1}
        .eh-install-title{font-size:34px;font-weight:600;color:#fff;margin:0 0 16px}
        .eh-install-desc{font-size:20px;font-weight:400;color:#a3a3a3;margin:0 0 32px;max-width:460px;line-height:1.6}
        .eh-install-cta{padding:15px 60px}
        .eh-install-image{flex:0 0 auto;display:flex;justify-content:center}
        .eh-install-image img{width:438px;height:657px;object-fit:contain;filter:drop-shadow(0 30px 60px rgba(0,0,0,0.6))}

        /* 12. LATAM */
        .eh-latam{position:relative;min-height:961px;padding:84px 0 80px;display:flex;align-items:center;justify-content:center;overflow:hidden}
        .eh-latam-content{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;justify-content:space-between;gap:40px;width:100%;max-width:1148px;padding:10px 24px;min-height:850px}
        .eh-latam-header{display:flex;flex-direction:column;align-items:center;gap:28px;text-align:center}
        .eh-latam-title{font-size:34px;font-weight:500;color:#fff;margin:0}
        .eh-latam-desc{font-size:18px;font-weight:400;color:#a3a3a3;margin:0;text-align:center;max-width:720px}
        .eh-flags{display:flex;flex-wrap:wrap;justify-content:center;gap:21px;max-width:634px;margin:0}
        .eh-flag{width:40px;height:27px;border-radius:6px;overflow:hidden;flex-shrink:0;box-shadow:0 2px 8px rgba(0,0,0,0.4)}
        .eh-flag img{width:100%;height:100%;object-fit:cover;display:block}
        .eh-stats{display:flex;justify-content:center;align-items:stretch;gap:41px;width:100%;max-width:1148px}
        .eh-stat{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:30px;padding:50px;background:rgba(255,255,255,0.012);border:1px solid rgba(255,255,255,0.1);border-radius:10px;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);flex:1 1 0;min-width:0}
        .eh-stat-icon{display:flex;align-items:center;justify-content:center;height:74px;flex-shrink:0}
        .eh-stat-icon img{height:74px;width:auto;object-fit:contain}
        .eh-stat-body{display:flex;flex-direction:column;align-items:center;gap:10px}
        .eh-stat-num{font-size:40px;font-weight:600;color:#fff;line-height:1}
        .eh-stat-label{font-size:14px;font-weight:400;color:#a3a3a3;text-align:center}

        /* 13. FINAL CTA */
        .eh-finalcta{position:relative;min-height:560px;padding:140px 0;display:flex;align-items:center;overflow:hidden}
        .eh-finalcta-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.5) 100%)}
        .eh-finalcta-content{position:relative;z-index:1;text-align:center;display:flex;flex-direction:column;align-items:center;gap:16px}
        .eh-finalcta-title{font-size:34px;font-weight:500;color:#fff;margin:0;text-align:center}
        .eh-finalcta-desc{font-size:14px;font-weight:400;color:#a3a3a3;margin:0;text-align:center;max-width:760px}

        /* RESPONSIVE - 1024px */
        @media(max-width:1024px){
          .eh-section{padding:80px 0}
          .eh-hero{min-height:600px;height:auto;padding:120px 0 80px}
          .eh-hero-title{font-size:40px}
          .eh-hero-cta-wrap{position:relative;bottom:auto;left:auto;transform:none;margin-top:40px}
          .eh-clean{min-height:auto;padding:80px 0}
          .eh-clean-title{font-size:28px}
          .eh-clean-desc{font-size:16px}
          .eh-switching-cards{flex-wrap:wrap;gap:20px}
          .eh-switching-card{min-width:200px;max-width:none;flex:1 1 calc(50% - 10px)}
          .eh-switching-card-text{font-size:20px}
          .eh-flow{min-height:700px}
          .eh-flow-content{min-height:700px}
          .eh-flow-heading{padding-top:80px;font-size:28px}
          .eh-flow-panel{bottom:140px}
          .eh-flow-title{font-size:28px}
          .eh-plans-grid{grid-template-columns:1fr;max-width:460px;margin-left:auto;margin-right:auto}
          .eh-product-features{grid-template-columns:repeat(2,1fr)}
          .eh-makes-easy-wrap{flex-direction:column;gap:40px}
          .eh-makes-easy-text{padding:40px 24px;max-width:none}
          .eh-makes-easy-image{width:100%}
          .eh-makes-easy-image img{width:100%;height:auto;border-radius:20px}
          .eh-app-top{flex-direction:column;gap:40px;padding:60px 24px 0}
          .eh-app-text{height:auto;max-width:none}
          .eh-app-features{flex-direction:column;gap:20px;padding:0 24px;margin:40px auto 60px}
          .eh-install{padding:0 24px}
          .eh-install-wrap{flex-direction:column;gap:40px;text-align:center;padding:60px 0}
          .eh-install-desc{margin-left:auto;margin-right:auto}
          .eh-install-image img{width:300px;height:auto}
          .eh-stats{gap:20px}
          .eh-stat{min-height:180px;padding:30px 24px}
          .eh-stat-num{font-size:32px}
          .eh-powerOn{min-height:600px}
        }

        /* RESPONSIVE - 640px */
        @media(max-width:640px){
          .eh-section{padding:60px 0}
          .eh-container{padding:0 20px}
          .eh-hero-title{font-size:34px}
          .eh-hero-subtitle{font-size:16px}
          .eh-switching-title{font-size:26px}
          .eh-switching-cards{flex-direction:column;gap:16px;align-items:center}
          .eh-switching-card{width:100%;max-width:320px;flex:none}
          .eh-switching-card-text{font-size:18px}
          .eh-flow{min-height:520px}
          .eh-flow-content{min-height:520px}
          .eh-flow-heading{font-size:24px;padding-top:60px}
          .eh-flow-panel{bottom:100px}
          .eh-flow-title{font-size:24px}
          .eh-flow-desc{font-size:16px}
          .eh-product-features{grid-template-columns:1fr}
          .eh-product-tab{padding:10px 20px;font-size:13px}
          .eh-grid-down{min-height:500px;padding:100px 0}
          .eh-grid-down-title{font-size:26px}
          .eh-app-phone>img{width:100%}
          .eh-app-badge img{width:180px;height:auto}
          .eh-powerOn{min-height:400px}
          .eh-powerOn-title{font-size:26px}
          .eh-install-title{font-size:26px}
          .eh-install-desc{font-size:16px}
          .eh-flags{gap:10px;max-width:100%}
          .eh-flag{width:32px;height:22px}
          .eh-stats{flex-direction:column;align-items:center}
          .eh-stat{width:100%;max-width:300px}
          .eh-latam-title{font-size:26px}
          .eh-finalcta-title{font-size:26px}
          .eh-plans-title{font-size:26px}
          .eh-clean-title{font-size:24px}
          .eh-clean-desc{font-size:14px}
        }
      `}</style>
    </div>
  );
}
