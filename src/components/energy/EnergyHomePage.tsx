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
  { key: 'noUpfront', titleKey: 'energyHome.switching.noUpfront' },
  { key: 'easy', titleKey: 'energyHome.switching.easy' },
  { key: 'lower', titleKey: 'energyHome.switching.lower' },
  { key: 'backup', titleKey: 'energyHome.switching.backup' },
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
      {/* HERO SECTION */}
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

      {/* CLEAN ENERGY HEADLINE */}
      <section className="eh-section eh-clean">
        <div className="eh-container eh-clean-inner">
          <h2 className="eh-clean-title">{t(lang, 'energyHome.clean.title')}</h2>
          <p className="eh-clean-desc">{t(lang, 'energyHome.clean.desc')}</p>
        </div>
      </section>

      {/* SWITCHING TO ANCESTRO */}
      <section className="eh-section eh-switching">
        <div className="eh-container">
          <h2 className="eh-h2 eh-h2-center">{t(lang, 'energyHome.switching.title')}</h2>
          <div className="eh-switching-grid">
            {switchingCards.map((card) => (
              <div key={card.key} className="eh-switching-card">
                <span>{t(lang, card.titleKey)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ENERGY FLOW SLIDE */}
      <section className="eh-section eh-flow">
        <div className="eh-container">
          <h2 className="eh-h2 eh-h2-md eh-h2-center">{t(lang, 'energyHome.install.title')}</h2>
          <p className="eh-lead eh-lead-sm eh-lead-center">{t(lang, 'energyHome.install.desc')}</p>
        </div>
        <div className="eh-flow-stage">
          <img src={`${IMG}/night-house-bg.webp`} alt="" className="eh-flow-bg" />
          <div className="eh-flow-overlay" />
          <div className="eh-flow-panel">
            <h3 className="eh-flow-title">{t(lang, energyFlowSteps[activeFlow].titleKey)}</h3>
            <p className="eh-flow-desc">{t(lang, energyFlowSteps[activeFlow].descKey)}</p>
            <button type="button" className="eh-btn-pill">{t(lang, 'energyHome.flow.cta')}</button>
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

      {/* CHOOSE YOUR ENERGY COVERAGE - PLANS */}
      <section className="eh-section eh-plans">
        <div className="eh-container">
          <h2 className="eh-h2 eh-h2-md eh-h2-center">{t(lang, 'energyHome.plans.title')}</h2>
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
                <button type="button" className="eh-plan-cta">{t(lang, 'energyHome.plans.cta')}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT TABS - SOLAR/BATTERY SHOWCASE */}
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

      {/* GRID DOWN LIGHTS ON */}
      <section className="eh-section eh-grid-down">
        <img src={`${IMG}/grid-down-bg.webp`} alt="" className="eh-fullbg" />
        <div className="eh-grid-down-overlay" />
        <div className="eh-container eh-grid-down-content">
          <h2 className="eh-h2">{t(lang, 'energyHome.gridDown.title')}</h2>
          <p className="eh-muted">{t(lang, 'energyHome.gridDown.desc')}</p>
        </div>
      </section>

      {/* APP SHOWCASE */}
      <section className="eh-section eh-app">
        <div className="eh-container eh-app-wrap">
          <div className="eh-app-header">
            <h2 className="eh-h2 eh-h2-center">{t(lang, 'energyHome.app.title')}</h2>
            <p className="eh-muted eh-muted-center">{t(lang, 'energyHome.app.desc')}</p>
          </div>
          <div className="eh-app-phone">
            <img src={`${IMG}/app-phone.webp`} alt="Ancestro App" />
          </div>
          <div className="eh-app-features">
            {appFeatures.map((f) => (
              <div key={f.key} className="eh-app-feature">
                <h4 className="eh-feature-title">{t(lang, f.titleKey)}</h4>
                <p className="eh-muted eh-muted-sm">{t(lang, f.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GETTING TO POWER ON */}
      <section className="eh-section eh-powerOn">
        <img src={`${IMG}/power-on-bg.webp`} alt="" className="eh-fullbg" />
        <div className="eh-powerOn-overlay" />
        <div className="eh-container eh-powerOn-content">
          <h2 className="eh-h2">{t(lang, 'energyHome.powerOn.title')}</h2>
          <p className="eh-muted">{t(lang, 'energyHome.powerOn.desc')}</p>
        </div>
      </section>

      {/* INSTALL SOLAR + BATTERY PRODUCT SHOT */}
      <section className="eh-section eh-install">
        <div className="eh-container eh-install-wrap">
          <div className="eh-install-text">
            <h2 className="eh-h2">{t(lang, 'energyHome.installCta.title')}</h2>
            <p className="eh-muted">{t(lang, 'energyHome.installCta.desc')}</p>
            <button type="button" className="eh-cta-glass eh-install-cta">{t(lang, 'energyHome.installCta.cta')}</button>
          </div>
          <div className="eh-install-image">
            <img src={`${IMG}/battery-product.webp`} alt="Ancestro Battery" />
          </div>
        </div>
      </section>

      {/* LATAM SECTION WITH FLAGS + ICONS */}
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

      {/* FINAL CTA */}
      <section className="eh-section eh-finalcta">
        <img src={`${IMG}/final-cta-bg.webp`} alt="" className="eh-fullbg" />
        <div className="eh-finalcta-overlay" />
        <div className="eh-container eh-finalcta-content">
          <h2 className="eh-h2 eh-h2-center">{t(lang, 'energyHome.finalCta.title')}</h2>
          <p className="eh-muted eh-muted-center">{t(lang, 'energyHome.finalCta.desc')}</p>
          <button type="button" className="eh-btn-primary">{t(lang, 'energyHome.finalCta.cta')}</button>
        </div>
      </section>

      <style>{`
        .eh-page{background:var(--color-black);color:var(--color-white);font-family:var(--font-family);overflow-x:hidden}
        .eh-container{max-width:1280px;margin:0 auto;padding:0 24px;width:100%}
        .eh-section{position:relative;padding:120px 0}

        /* HEADINGS */
        .eh-h2{font-size:clamp(26px,4vw,50px);font-weight:600;line-height:1.15;letter-spacing:-0.02em;margin:0 0 20px;color:var(--color-white);word-wrap:break-word;overflow-wrap:break-word}
        .eh-h2-md{font-size:clamp(24px,3vw,34px)}
        .eh-h2-center{text-align:center}
        .eh-h3{font-size:clamp(22px,2.4vw,28px);font-weight:600;letter-spacing:-0.01em;margin:0 0 12px}
        .eh-lead{font-size:clamp(16px,1.5vw,20px);line-height:1.6;color:var(--color-gray);max-width:900px;margin:0 auto}
        .eh-lead-sm{font-size:clamp(14px,1.2vw,16px);max-width:820px}
        .eh-lead-center{text-align:center}
        .eh-muted{color:var(--color-gray);font-size:15px;line-height:1.7}
        .eh-muted-sm{font-size:13px}
        .eh-muted-center{text-align:center;max-width:760px;margin-left:auto;margin-right:auto}

        /* BUTTONS */
        .eh-cta-glass{padding:14px 32px;background:rgba(255,255,255,0.1);backdrop-filter:blur(26px);-webkit-backdrop-filter:blur(26px);border:1px solid rgba(255,255,255,0.15);border-radius:15px;color:var(--color-white);font-family:inherit;font-size:15px;font-weight:600;cursor:pointer;transition:all 0.3s ease}
        .eh-cta-glass:hover{background:rgba(248,176,59,0.2);border-color:rgba(248,176,59,0.5)}
        .eh-btn-pill{padding:12px 28px;background:rgba(255,255,255,0.1);backdrop-filter:blur(26px);-webkit-backdrop-filter:blur(26px);border:1px solid rgba(255,255,255,0.2);border-radius:15px;color:var(--color-white);font-family:inherit;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.25s ease;margin-top:16px}
        .eh-btn-pill:hover{background:rgba(248,176,59,0.2);border-color:rgba(248,176,59,0.5)}
        .eh-btn-primary{padding:16px 36px;background:var(--color-primary);border:none;border-radius:12px;color:var(--color-black);font-family:inherit;font-size:16px;font-weight:700;cursor:pointer;transition:all 0.25s ease;margin-top:30px}
        .eh-btn-primary:hover{background:#ffbf50;transform:translateY(-3px);box-shadow:0 12px 30px rgba(248,176,59,0.4)}

        /* HERO */
        .eh-hero{position:relative;height:100vh;min-height:720px;display:flex;align-items:center;justify-content:center;overflow:hidden}
        .eh-hero-bg{position:absolute;inset:0;z-index:0}
        .eh-hero-bg img,.eh-hero-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none}
        .eh-hero-gradient{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.45) 0%,rgba(0,0,0,0.2) 35%,rgba(0,0,0,0.85) 100%)}
        .eh-hero-content{position:relative;z-index:1;text-align:center;padding:0 24px;max-width:1100px;display:flex;flex-direction:column;align-items:center;gap:16px}
        .eh-hero-title{font-size:clamp(36px,5vw,64px);font-weight:600;line-height:1.05;letter-spacing:-0.03em;margin:0;color:var(--color-white);text-shadow:0 2px 20px rgba(0,0,0,0.5)}
        .eh-hero-subtitle{font-size:clamp(16px,1.6vw,22px);color:rgba(255,255,255,0.92);font-weight:500;margin:0 0 32px;text-shadow:0 2px 12px rgba(0,0,0,0.5)}
        .eh-hero-cta-wrap{margin-top:auto}

        /* CLEAN SECTION */
        .eh-clean{padding:140px 0 80px}
        .eh-clean-inner{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:32px;padding:60px 24px;max-width:1200px}
        .eh-clean-title{font-family:Inter,sans-serif;font-size:clamp(32px,4vw,48px);font-weight:700;line-height:1.1;letter-spacing:-0.02em;color:#fff;text-align:center;margin:0;max-width:1100px}
        .eh-clean-desc{font-family:Inter,sans-serif;font-size:clamp(15px,1.4vw,18px);font-weight:300;line-height:1.6;color:#b0b0b0;text-align:center;margin:0;max-width:1162px;white-space:pre-line}

        /* SWITCHING TO ANCESTRO */
        .eh-switching{padding:80px 0 100px}
        .eh-switching-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;margin-top:40px}
        .eh-switching-card{padding:40px 24px;min-height:140px;background:rgba(255,255,255,0.04);backdrop-filter:blur(26px);-webkit-backdrop-filter:blur(26px);border:1px solid rgba(255,255,255,0.1);border-radius:16px;display:flex;align-items:center;justify-content:center;text-align:center;transition:all 0.3s ease}
        .eh-switching-card:hover{background:rgba(248,176,59,0.08);border-color:rgba(248,176,59,0.3);transform:translateY(-4px)}
        .eh-switching-card span{font-size:clamp(16px,1.5vw,22px);font-weight:500;color:var(--color-white);line-height:1.3;white-space:pre-line}

        /* ENERGY FLOW */
        .eh-flow{text-align:center;padding-bottom:0}
        .eh-flow-stage{position:relative;width:100%;height:820px;margin-top:60px;overflow:hidden}
        .eh-flow-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .eh-flow-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.6) 0%,rgba(0,0,0,0) 40%,rgba(0,0,0,0.9) 100%)}
        .eh-flow-panel{position:absolute;left:50%;bottom:120px;transform:translateX(-50%);text-align:center;max-width:800px;padding:0 24px;display:flex;flex-direction:column;align-items:center}
        .eh-flow-title{font-size:clamp(28px,3vw,40px);font-weight:600;margin:0 0 12px;color:var(--color-white)}
        .eh-flow-desc{font-size:15px;color:rgba(255,255,255,0.8);line-height:1.6;margin:0}
        .eh-flow-dots{position:absolute;left:50%;bottom:60px;transform:translateX(-50%);display:flex;gap:10px}
        .eh-dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.3);border:none;cursor:pointer;transition:all 0.3s ease;padding:0}
        .eh-dot.active{background:var(--color-primary);width:28px;border-radius:999px}
        .eh-dot:hover:not(.active){background:rgba(255,255,255,0.5)}

        /* PLANS */
        .eh-plans{padding:120px 0}
        .eh-plans-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:30px;margin-top:50px}
        .eh-plan-card{display:flex;flex-direction:column;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:20px;overflow:hidden;padding:10px 10px 30px;transition:all 0.3s ease}
        .eh-plan-card:hover{border-color:rgba(248,176,59,0.4);transform:translateY(-4px)}
        .eh-plan-card.featured{border-color:rgba(248,176,59,0.35)}
        .eh-plan-image{width:100%;height:220px;border-radius:16px;overflow:hidden;background:rgba(255,255,255,0.04);display:flex;align-items:center;justify-content:center}
        .eh-plan-image-cover img{width:100%;height:100%;object-fit:cover}
        .eh-plan-image-contain{background:linear-gradient(160deg,rgba(255,255,255,0.06) 0%,rgba(0,0,0,0.2) 100%)}
        .eh-plan-image-contain img{max-width:80%;max-height:90%;width:auto;height:auto;object-fit:contain}
        .eh-plan-body{padding:24px 24px 16px;flex:1}
        .eh-plan-title{font-size:22px;font-weight:600;color:var(--color-white);margin:0 0 10px}
        .eh-plan-desc{font-size:14px;color:rgba(255,255,255,0.7);line-height:1.6;margin:0 0 16px}
        .eh-plan-tagline{font-size:12px;font-style:italic;color:rgba(255,255,255,0.8);line-height:1.4;margin:0}
        .eh-plan-card.featured .eh-plan-tagline{color:var(--color-primary)}
        .eh-plan-cta{margin:0 24px;padding:12px 20px;background:rgba(255,255,255,0.08);backdrop-filter:blur(26px);-webkit-backdrop-filter:blur(26px);border:1px solid rgba(255,255,255,0.15);border-radius:15px;color:var(--color-white);font-family:inherit;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.3s ease}
        .eh-plan-cta:hover{background:rgba(248,176,59,0.2);border-color:rgba(248,176,59,0.5)}

        /* PRODUCT TABS SHOWCASE */
        .eh-product-tabs{padding:80px 0}
        .eh-product-tabs-nav{display:flex;justify-content:center;gap:10px;margin-bottom:30px}
        .eh-product-tab{padding:12px 32px;background:rgba(255,255,255,0.08);backdrop-filter:blur(26px);-webkit-backdrop-filter:blur(26px);border:1px solid rgba(255,255,255,0.12);border-radius:999px;color:rgba(255,255,255,0.8);font-family:inherit;font-size:15px;font-weight:600;cursor:pointer;transition:all 0.25s ease}
        .eh-product-tab:hover{background:rgba(255,255,255,0.12);color:var(--color-white)}
        .eh-product-tab.active{background:var(--color-primary);border-color:var(--color-primary);color:var(--color-black)}
        .eh-product-stage{width:100%;aspect-ratio:16/10;max-height:800px;border-radius:24px;overflow:hidden;background:rgba(255,255,255,0.04);margin-bottom:40px}
        .eh-product-image{width:100%;height:100%;object-fit:cover;display:block}
        .eh-product-features{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;border-top:2px solid #424242;padding-top:28px}
        .eh-product-feat{padding-top:12px;border-top:2px solid transparent;margin-top:-16px}
        .eh-product-feat.active{border-top-color:var(--color-primary)}
        .eh-product-feat-title{font-size:clamp(18px,1.8vw,24px);font-weight:600;color:var(--color-gray);margin:0 0 15px}
        .eh-product-feat.active .eh-product-feat-title{color:var(--color-primary)}
        .eh-product-feat-desc{font-size:14px;color:rgba(255,255,255,0.75);line-height:1.6;margin:0}
        .eh-product-feat.active .eh-product-feat-desc{color:var(--color-white)}

        /* GRID DOWN */
        .eh-grid-down{position:relative;min-height:720px;padding:200px 0;display:flex;align-items:flex-end}
        .eh-fullbg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .eh-grid-down-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.3) 0%,rgba(0,0,0,0.95) 100%)}
        .eh-grid-down-content{position:relative}

        /* APP */
        .eh-app{padding:140px 0}
        .eh-app-wrap{display:grid;grid-template-columns:1fr;gap:60px;text-align:center}
        .eh-app-header{max-width:820px;margin:0 auto}
        .eh-app-phone{display:flex;justify-content:center}
        .eh-app-phone img{max-width:360px;height:auto;filter:drop-shadow(0 30px 80px rgba(248,176,59,0.2))}
        .eh-app-features{display:grid;grid-template-columns:repeat(3,1fr);gap:40px;max-width:1100px;margin:0 auto;text-align:left}
        .eh-app-feature{padding:24px;background:rgba(255,255,255,0.04);backdrop-filter:blur(26px);-webkit-backdrop-filter:blur(26px);border:1px solid rgba(255,255,255,0.08);border-radius:16px}
        .eh-feature-title{font-size:clamp(18px,1.6vw,24px);font-weight:500;margin:0 0 12px;color:var(--color-white)}

        /* POWER ON */
        .eh-powerOn{position:relative;min-height:720px;padding:200px 0;display:flex;align-items:flex-end;overflow:hidden}
        .eh-powerOn-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0.5) 50%,rgba(0,0,0,0.95) 100%)}
        .eh-powerOn-content{position:relative;max-width:900px}

        /* INSTALL (Battery product showcase) */
        .eh-install{padding:120px 0}
        .eh-install-wrap{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
        .eh-install-text h2{margin-bottom:16px}
        .eh-install-text .eh-muted{margin-bottom:32px;max-width:460px}
        .eh-install-cta{margin-top:8px}
        .eh-install-image{display:flex;justify-content:center}
        .eh-install-image img{max-width:440px;width:100%;height:auto;filter:drop-shadow(0 30px 60px rgba(0,0,0,0.6))}

        /* LATAM */
        .eh-latam{position:relative;min-height:961px;padding:84px 0 80px;display:flex;align-items:center;justify-content:center;overflow:hidden}
        .eh-latam .eh-fullbg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center}
        .eh-latam-content{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;justify-content:space-between;gap:40px;width:100%;max-width:1148px;padding:10px 24px;min-height:850px}
        .eh-latam-header{display:flex;flex-direction:column;align-items:center;gap:28px;text-align:center}
        .eh-latam-title{font-family:Inter,sans-serif;font-size:clamp(26px,3vw,34px);font-weight:500;color:#fff;margin:0;letter-spacing:-0.01em}
        .eh-latam-desc{font-family:Inter,sans-serif;font-size:clamp(15px,1.4vw,18px);font-weight:400;color:#a3a3a3;margin:0;text-align:center;max-width:720px}
        .eh-flags{display:flex;flex-wrap:wrap;justify-content:center;gap:21px;max-width:634px;margin:0}
        .eh-flag{width:40px;height:27px;border-radius:6px;overflow:hidden;flex-shrink:0;box-shadow:0 2px 8px rgba(0,0,0,0.4)}
        .eh-flag img{width:100%;height:100%;object-fit:cover;display:block}
        .eh-stats{display:flex;justify-content:center;align-items:stretch;gap:41px;width:100%;max-width:1148px}
        .eh-stat{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:30px;padding:50px;background:rgba(255,255,255,0.012);border:1px solid rgba(255,255,255,0.1);border-radius:10px;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);flex:1 1 0;min-width:0}
        .eh-stat-icon{display:flex;align-items:center;justify-content:center;height:74px;flex-shrink:0}
        .eh-stat-icon img{height:74px;width:auto;object-fit:contain}
        .eh-stat-body{display:flex;flex-direction:column;align-items:center;gap:10px}
        .eh-stat-num{font-family:Inter,sans-serif;font-size:clamp(32px,3vw,40px);font-weight:600;color:#fff;line-height:1;letter-spacing:-0.02em}
        .eh-stat-label{font-family:Inter,sans-serif;font-size:14px;font-weight:400;color:#a3a3a3;text-align:center}

        /* FINAL CTA */
        .eh-finalcta{position:relative;min-height:560px;padding:140px 0;display:flex;align-items:center;overflow:hidden}
        .eh-finalcta-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.6)}
        .eh-finalcta-content{position:relative;text-align:center}

        @media(max-width:1024px){
          .eh-section{padding:80px 0}
          .eh-hero{min-height:600px;height:auto;padding:120px 0 80px}
          .eh-flow-stage{height:600px}
          .eh-app-features{grid-template-columns:1fr;gap:24px}
          .eh-switching-grid{grid-template-columns:repeat(2,1fr)}
          .eh-plans-grid{grid-template-columns:1fr;max-width:460px;margin-left:auto;margin-right:auto}
          .eh-product-features{grid-template-columns:repeat(2,1fr)}
          .eh-install-wrap{grid-template-columns:1fr;gap:40px;text-align:center}
          .eh-install-text .eh-muted{margin-left:auto;margin-right:auto}
          .eh-stats{gap:20px}
          .eh-stat{min-height:180px;padding:30px 24px}
          .eh-stat-num{font-size:32px}
        }
        @media(max-width:640px){
          .eh-section{padding:60px 0}
          .eh-container{padding:0 20px}
          .eh-flow-stage{height:520px}
          .eh-flow-panel{bottom:90px}
          .eh-hero-title{font-size:34px}
          .eh-switching-grid{grid-template-columns:1fr;gap:16px}
          .eh-product-features{grid-template-columns:1fr}
          .eh-product-tab{padding:10px 20px;font-size:13px}
          .eh-flags{gap:10px;max-width:100%}
          .eh-flag{width:32px;height:22px}
          .eh-stats{flex-direction:column;align-items:center}
          .eh-stat{width:100%;max-width:300px}
        }
      `}</style>
    </div>
  );
}
