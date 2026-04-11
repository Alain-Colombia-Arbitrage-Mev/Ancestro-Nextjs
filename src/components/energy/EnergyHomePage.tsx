'use client';
import { useState } from 'react';
import { t } from '@/i18n/translations';
import { CDN_URL } from '@/lib/cdn';

interface Props { lang: string }

const IMG = `${CDN_URL}/energy-home`;

const energyFlowSteps = [
  { key: 'generate', titleKey: 'energyHome.flow.generate.title', descKey: 'energyHome.flow.generate.desc' },
  { key: 'use', titleKey: 'energyHome.flow.use.title', descKey: 'energyHome.flow.use.desc' },
  { key: 'store', titleKey: 'energyHome.flow.store.title', descKey: 'energyHome.flow.store.desc' },
  { key: 'charge', titleKey: 'energyHome.flow.charge.title', descKey: 'energyHome.flow.charge.desc' },
];

export default function EnergyHomePage({ lang }: Props) {
  const [activeFlow, setActiveFlow] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { key: 'solar', labelKey: 'energyHome.tabs.solar' },
    { key: 'battery', labelKey: 'energyHome.tabs.battery' },
    { key: 'charging', labelKey: 'energyHome.tabs.charging' },
  ];

  return (
    <div className="eh-page">
      {/* HERO SECTION */}
      <section className="eh-hero">
        <div className="eh-hero-bg">
          <img src={`${IMG}/hero-bg.webp`} alt="" />
          <div className="eh-hero-gradient" />
        </div>
        <div className="eh-hero-content">
          <h1 className="eh-hero-title">{t(lang, 'energyHome.hero.title')}</h1>
          <p className="eh-hero-subtitle">{t(lang, 'energyHome.hero.subtitle')}</p>
          <div className="eh-hero-cta-wrap">
            <button className="eh-cta-glass">{t(lang, 'energyHome.hero.cta')}</button>
          </div>
        </div>
      </section>

      {/* CLEAN ENERGY HEADLINE */}
      <section className="eh-section eh-clean">
        <div className="eh-container">
          <h2 className="eh-h2">{t(lang, 'energyHome.clean.title')}</h2>
          <p className="eh-lead">{t(lang, 'energyHome.clean.desc')}</p>
        </div>
      </section>

      {/* INSTALL SOLAR PANELS + ENERGY FLOW */}
      <section className="eh-section eh-flow">
        <div className="eh-container">
          <h2 className="eh-h2 eh-h2-md">{t(lang, 'energyHome.install.title')}</h2>
          <p className="eh-lead eh-lead-sm">{t(lang, 'energyHome.install.desc')}</p>
        </div>
        <div className="eh-flow-stage">
          <img src={`${IMG}/night-house-bg.webp`} alt="" className="eh-flow-bg" />
          <div className="eh-flow-overlay" />
          <div className="eh-flow-panel">
            <h3 className="eh-flow-title">{t(lang, energyFlowSteps[activeFlow].titleKey)}</h3>
            <p className="eh-flow-desc">{t(lang, energyFlowSteps[activeFlow].descKey)}</p>
            <button className="eh-btn-pill">{t(lang, 'energyHome.flow.cta')}</button>
          </div>
          <div className="eh-flow-dots">
            {energyFlowSteps.map((step, i) => (
              <button
                key={step.key}
                className={`eh-dot ${i === activeFlow ? 'active' : ''}`}
                onClick={() => setActiveFlow(i)}
                aria-label={t(lang, step.titleKey)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT TABS */}
      <section className="eh-section eh-tabs-section">
        <div className="eh-container">
          <div className="eh-tabs-nav">
            {tabs.map((tab, i) => (
              <button
                key={tab.key}
                className={`eh-tab ${i === activeTab ? 'active' : ''}`}
                onClick={() => setActiveTab(i)}
              >
                {t(lang, tab.labelKey)}
              </button>
            ))}
          </div>
          <div className="eh-tabs-stage">
            <img src={`${IMG}/tabs-bg.webp`} alt="" className="eh-tabs-bg" />
            <div className="eh-tabs-content">
              <h3 className="eh-h3">{t(lang, `energyHome.tabs.${tabs[activeTab].key}.title`)}</h3>
              <p className="eh-muted">{t(lang, `energyHome.tabs.${tabs[activeTab].key}.desc`)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* SOLAR PANELS BANNER */}
      <section className="eh-section eh-banner">
        <img src={`${IMG}/solar-panels-bg.webp`} alt="" className="eh-banner-bg" />
        <div className="eh-banner-overlay" />
        <div className="eh-container eh-banner-content">
          <h2 className="eh-h2">{t(lang, 'energyHome.solar.title')}</h2>
          <p className="eh-lead eh-lead-sm">{t(lang, 'energyHome.solar.desc')}</p>
        </div>
      </section>

      {/* GRID DOWN LIGHTS ON */}
      <section className="eh-section eh-grid-down">
        <img src={`${IMG}/clean-energy-bg.webp`} alt="" className="eh-fullbg" />
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
            <h2 className="eh-h2">{t(lang, 'energyHome.app.title')}</h2>
            <p className="eh-muted">{t(lang, 'energyHome.app.desc')}</p>
          </div>
          <div className="eh-app-phone">
            <img src={`${IMG}/battery-product.webp`} alt="Ancestro App" />
          </div>
          <div className="eh-app-features">
            <div className="eh-feature">
              <h4 className="eh-feature-title">{t(lang, 'energyHome.app.feat1.title')}</h4>
              <p className="eh-muted eh-muted-sm">{t(lang, 'energyHome.app.feat1.desc')}</p>
            </div>
            <div className="eh-feature">
              <h4 className="eh-feature-title">{t(lang, 'energyHome.app.feat2.title')}</h4>
              <p className="eh-muted eh-muted-sm">{t(lang, 'energyHome.app.feat2.desc')}</p>
            </div>
            <div className="eh-feature">
              <h4 className="eh-feature-title">{t(lang, 'energyHome.app.feat3.title')}</h4>
              <p className="eh-muted eh-muted-sm">{t(lang, 'energyHome.app.feat3.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* GETTING TO POWER ON */}
      <section className="eh-section eh-powerOn">
        <img src={`${IMG}/night-house-bg.webp`} alt="" className="eh-fullbg" />
        <div className="eh-dark-overlay" />
        <div className="eh-container eh-powerOn-content">
          <h2 className="eh-h2">{t(lang, 'energyHome.powerOn.title')}</h2>
          <p className="eh-muted">{t(lang, 'energyHome.powerOn.desc')}</p>
        </div>
      </section>

      {/* INSTALLER SECTION */}
      <section className="eh-section eh-installer">
        <div className="eh-container eh-installer-wrap">
          <div className="eh-installer-text">
            <h2 className="eh-h2">{t(lang, 'energyHome.installer.title')}</h2>
            <p className="eh-muted">{t(lang, 'energyHome.installer.desc')}</p>
          </div>
          <div className="eh-installer-image">
            <img src={`${IMG}/installer-bg.webp`} alt="Ancestro installer" />
          </div>
        </div>
      </section>

      {/* BATTERY SYSTEM SPECS */}
      <section className="eh-section eh-specs">
        <div className="eh-container">
          <h2 className="eh-h2 eh-h2-center">{t(lang, 'energyHome.specs.title')}</h2>
          <div className="eh-specs-wrap">
            <div className="eh-specs-image">
              <img src={`${IMG}/battery-product.webp`} alt="Ancestro Battery" />
            </div>
            <ul className="eh-specs-list">
              <li><span>{t(lang, 'energyHome.specs.capacity.label')}</span><strong>13.5 kWh</strong></li>
              <li><span>{t(lang, 'energyHome.specs.power.label')}</span><strong>7 kW</strong></li>
              <li><span>{t(lang, 'energyHome.specs.backup.label')}</span><strong>24h+</strong></li>
              <li><span>{t(lang, 'energyHome.specs.warranty.label')}</span><strong>10 {t(lang, 'energyHome.specs.years')}</strong></li>
              <li><span>{t(lang, 'energyHome.specs.dimensions.label')}</span><strong>1150×755×155 mm</strong></li>
              <li><span>{t(lang, 'energyHome.specs.weight.label')}</span><strong>114 kg</strong></li>
            </ul>
          </div>
        </div>
      </section>

      {/* LATAM MAP SECTION */}
      <section className="eh-section eh-latam">
        <img src={`${IMG}/latam-map-bg.webp`} alt="" className="eh-fullbg" />
        <div className="eh-dark-overlay" />
        <div className="eh-container eh-latam-content">
          <h2 className="eh-h2 eh-h2-center">{t(lang, 'energyHome.latam.title')}</h2>
          <p className="eh-muted eh-muted-center">{t(lang, 'energyHome.latam.desc')}</p>
          <div className="eh-stats">
            <div className="eh-stat">
              <span className="eh-stat-num">18+</span>
              <span className="eh-stat-label">{t(lang, 'energyHome.latam.countries')}</span>
            </div>
            <div className="eh-stat">
              <span className="eh-stat-num">25,000+</span>
              <span className="eh-stat-label">{t(lang, 'energyHome.latam.installations')}</span>
            </div>
            <div className="eh-stat">
              <span className="eh-stat-num">500+</span>
              <span className="eh-stat-label">{t(lang, 'energyHome.latam.installers')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="eh-section eh-finalcta">
        <img src={`${IMG}/solar-panels-bg.webp`} alt="" className="eh-fullbg" />
        <div className="eh-dark-overlay" />
        <div className="eh-container eh-finalcta-content">
          <h2 className="eh-h2 eh-h2-center">{t(lang, 'energyHome.finalCta.title')}</h2>
          <p className="eh-muted eh-muted-center">{t(lang, 'energyHome.finalCta.desc')}</p>
          <button className="eh-btn-primary">{t(lang, 'energyHome.finalCta.cta')}</button>
        </div>
      </section>

      <style>{`
        .eh-page{background:var(--color-black);color:var(--color-white);font-family:var(--font-family);overflow-x:hidden}
        .eh-container{max-width:1280px;margin:0 auto;padding:0 24px;width:100%}
        .eh-section{position:relative;padding:120px 0}

        /* HEADINGS */
        .eh-h2{font-size:clamp(26px,4vw,50px);font-weight:600;line-height:1.15;letter-spacing:-0.02em;margin:0 0 20px;color:var(--color-white);word-wrap:break-word;overflow-wrap:break-word;hyphens:auto}
        .eh-h2-md{font-size:clamp(24px,3vw,34px)}
        .eh-h2-center{text-align:center}
        .eh-h3{font-size:clamp(22px,2.4vw,28px);font-weight:600;letter-spacing:-0.01em;margin:0 0 12px}
        .eh-lead{font-size:clamp(16px,1.5vw,20px);line-height:1.6;color:var(--color-gray);max-width:900px;margin:0 auto}
        .eh-lead-sm{font-size:clamp(14px,1.2vw,16px);max-width:820px}
        .eh-muted{color:var(--color-gray);font-size:15px;line-height:1.7}
        .eh-muted-sm{font-size:13px}
        .eh-muted-center{text-align:center;max-width:760px;margin-left:auto;margin-right:auto}

        /* BUTTONS */
        .eh-cta-glass{padding:14px 32px;background:rgba(255,255,255,0.1);backdrop-filter:blur(26px);-webkit-backdrop-filter:blur(26px);border:1px solid rgba(255,255,255,0.15);border-radius:15px;color:var(--color-white);font-family:inherit;font-size:15px;font-weight:600;cursor:pointer;transition:all 0.3s ease}
        .eh-cta-glass:hover{background:rgba(248,176,59,0.2);border-color:rgba(248,176,59,0.5)}
        .eh-btn-pill{padding:12px 28px;background:var(--color-primary);border:none;border-radius:999px;color:var(--color-black);font-family:inherit;font-size:14px;font-weight:700;cursor:pointer;transition:all 0.2s ease;margin-top:16px}
        .eh-btn-pill:hover{background:#ffbf50;transform:translateY(-2px)}
        .eh-btn-primary{padding:16px 36px;background:var(--color-primary);border:none;border-radius:12px;color:var(--color-black);font-family:inherit;font-size:16px;font-weight:700;cursor:pointer;transition:all 0.25s ease;margin-top:30px}
        .eh-btn-primary:hover{background:#ffbf50;transform:translateY(-3px);box-shadow:0 12px 30px rgba(248,176,59,0.4)}

        /* HERO */
        .eh-hero{position:relative;height:100vh;min-height:720px;display:flex;align-items:center;justify-content:center;overflow:hidden}
        .eh-hero-bg{position:absolute;inset:0;z-index:0}
        .eh-hero-bg img{width:100%;height:100%;object-fit:cover}
        .eh-hero-gradient{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.6) 0%,rgba(0,0,0,0.3) 35%,rgba(0,0,0,0.85) 100%)}
        .eh-hero-content{position:relative;z-index:1;text-align:center;padding:0 24px;max-width:1100px;display:flex;flex-direction:column;align-items:center;gap:16px}
        .eh-hero-title{font-size:clamp(36px,5vw,64px);font-weight:600;line-height:1.05;letter-spacing:-0.03em;margin:0;color:var(--color-white)}
        .eh-hero-subtitle{font-size:clamp(16px,1.6vw,22px);color:rgba(255,255,255,0.85);font-weight:500;margin:0 0 32px}
        .eh-hero-cta-wrap{margin-top:auto}

        /* CLEAN SECTION */
        .eh-clean{text-align:center;padding:140px 0 120px}
        .eh-clean .eh-h2{max-width:900px;margin-left:auto;margin-right:auto}

        /* ENERGY FLOW */
        .eh-flow{text-align:center;padding-bottom:0}
        .eh-flow-stage{position:relative;width:100%;height:820px;margin-top:60px;overflow:hidden}
        .eh-flow-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .eh-flow-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.6) 0%,rgba(0,0,0,0) 40%,rgba(0,0,0,0.9) 100%)}
        .eh-flow-panel{position:absolute;left:50%;bottom:120px;transform:translateX(-50%);text-align:center;max-width:800px;padding:0 24px}
        .eh-flow-title{font-size:clamp(28px,3vw,40px);font-weight:600;margin:0 0 12px;color:var(--color-white)}
        .eh-flow-desc{font-size:15px;color:rgba(255,255,255,0.8);line-height:1.6;margin:0}
        .eh-flow-dots{position:absolute;left:50%;bottom:60px;transform:translateX(-50%);display:flex;gap:10px}
        .eh-dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.3);border:none;cursor:pointer;transition:all 0.3s ease;padding:0}
        .eh-dot.active{background:var(--color-primary);width:28px;border-radius:999px}
        .eh-dot:hover:not(.active){background:rgba(255,255,255,0.5)}

        /* TABS SECTION */
        .eh-tabs-section{padding:100px 0}
        .eh-tabs-nav{display:flex;justify-content:center;gap:12px;margin-bottom:40px;flex-wrap:wrap}
        .eh-tab{padding:12px 28px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;color:rgba(255,255,255,0.7);font-family:inherit;font-size:15px;font-weight:600;cursor:pointer;transition:all 0.25s ease}
        .eh-tab:hover{background:rgba(255,255,255,0.08);color:var(--color-white)}
        .eh-tab.active{background:rgba(248,176,59,0.15);border-color:rgba(248,176,59,0.4);color:var(--color-primary)}
        .eh-tabs-stage{position:relative;width:100%;aspect-ratio:16/9;max-height:720px;border-radius:24px;overflow:hidden;background:var(--color-white-10)}
        .eh-tabs-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .eh-tabs-content{position:absolute;left:0;right:0;bottom:0;padding:40px 48px;background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0.85) 100%)}

        /* BANNER */
        .eh-banner{position:relative;min-height:560px;padding:140px 0;display:flex;align-items:center}
        .eh-banner-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .eh-banner-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.55) 0%,rgba(0,0,0,0.85) 100%)}
        .eh-banner-content{position:relative;text-align:center}

        /* GRID DOWN */
        .eh-grid-down{position:relative;min-height:640px;padding:200px 0;display:flex;align-items:flex-end}
        .eh-fullbg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .eh-grid-down-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.3) 0%,rgba(0,0,0,0.95) 100%)}
        .eh-grid-down-content{position:relative}
        .eh-dark-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.55)}

        /* APP */
        .eh-app{padding:140px 0}
        .eh-app-wrap{display:grid;grid-template-columns:1fr;gap:60px;text-align:center}
        .eh-app-header{max-width:820px;margin:0 auto}
        .eh-app-phone{display:flex;justify-content:center}
        .eh-app-phone img{max-width:320px;height:auto;filter:drop-shadow(0 30px 80px rgba(248,176,59,0.2))}
        .eh-app-features{display:grid;grid-template-columns:repeat(3,1fr);gap:32px;max-width:1000px;margin:0 auto;text-align:left}
        .eh-feature-title{font-size:16px;font-weight:600;margin:0 0 10px;color:var(--color-white)}

        /* POWER ON */
        .eh-powerOn{position:relative;min-height:640px;padding:200px 0;display:flex;align-items:flex-end}
        .eh-powerOn-content{position:relative}

        /* INSTALLER */
        .eh-installer{padding:120px 0}
        .eh-installer-wrap{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
        .eh-installer-image img{width:100%;height:auto;border-radius:24px}

        /* SPECS */
        .eh-specs{padding:120px 0}
        .eh-specs-wrap{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;margin-top:50px}
        .eh-specs-image{display:flex;justify-content:center}
        .eh-specs-image img{max-width:380px;height:auto;filter:drop-shadow(0 30px 80px rgba(0,0,0,0.6))}
        .eh-specs-list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0}
        .eh-specs-list li{display:flex;justify-content:space-between;align-items:center;padding:18px 0;border-bottom:1px solid rgba(255,255,255,0.08)}
        .eh-specs-list li span{color:var(--color-gray);font-size:14px}
        .eh-specs-list li strong{font-size:18px;font-weight:600;color:var(--color-white)}

        /* LATAM */
        .eh-latam{position:relative;min-height:720px;padding:140px 0;display:flex;align-items:center}
        .eh-latam-content{position:relative;text-align:center}
        .eh-stats{display:flex;justify-content:center;gap:60px;margin-top:60px;flex-wrap:wrap}
        .eh-stat{display:flex;flex-direction:column;align-items:center;gap:8px;padding:24px 40px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);min-width:180px}
        .eh-stat-num{font-size:40px;font-weight:700;color:var(--color-primary);line-height:1}
        .eh-stat-label{font-size:14px;color:var(--color-gray)}

        /* FINAL CTA */
        .eh-finalcta{position:relative;min-height:560px;padding:140px 0;display:flex;align-items:center}
        .eh-finalcta-content{position:relative;text-align:center}

        @media(max-width:1024px){
          .eh-section{padding:80px 0}
          .eh-hero{min-height:600px;height:auto;padding:120px 0 80px}
          .eh-flow-stage{height:600px}
          .eh-app-features{grid-template-columns:1fr;gap:24px}
          .eh-installer-wrap,.eh-specs-wrap{grid-template-columns:1fr;gap:40px}
          .eh-installer-wrap{text-align:center}
          .eh-stats{gap:20px}
          .eh-stat{min-width:140px;padding:20px 24px}
          .eh-stat-num{font-size:32px}
          .eh-tabs-content{padding:24px}
        }
        @media(max-width:640px){
          .eh-section{padding:60px 0}
          .eh-container{padding:0 20px}
          .eh-flow-stage{height:500px}
          .eh-flow-panel{bottom:90px}
          .eh-hero-title{font-size:34px}
          .eh-tabs-nav{gap:8px}
          .eh-tab{padding:10px 18px;font-size:13px}
          .eh-stat-num{font-size:26px}
          .eh-stats{flex-direction:column;align-items:center}
          .eh-stat{width:100%;max-width:280px}
        }
      `}</style>
    </div>
  );
}
