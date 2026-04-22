import './charging-home.css';
import { t } from '@/i18n/translations';
import AskBox from '@/components/AskBox';
import { IMG_HOME, IMG_L3 } from './constants';

export default function ChargingHomePage({ lang }: { lang: string }) {
  return (
    <div style={{ background: '#000', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      {/* ─── Hero ─── */}
      <section className="chome-hero">
        <img
          className="chome-hero-bg"
          src={`${IMG_HOME}/hero-bg.webp?v=3`}
          alt=""
          aria-hidden="true"
        />
        <div className="chome-hero-overlay" />
        <div className="chome-hero-content">
          <h1 className="chome-hero-title">{t(lang, 'chargingHome.hero.title')}</h1>
          <p className="chome-hero-sub">{t(lang, 'chargingHome.hero.sub')}</p>
        </div>
        <div className="chome-hero-ctas">
          <a href={`/${lang}/join?profile=host`} className="chome-cta-primary">
            {t(lang, 'chargingHome.hero.ctaOrder')}
          </a>
        </div>
      </section>

      <div style={{ position: 'relative', zIndex: 2, marginTop: -52 }}>
        <AskBox lang={lang} />
      </div>

      {/* ─── Why Home Charging Works ─── */}
      <section className="chome-why">
        <img
          className="chome-why-bg"
          src={`${IMG_HOME}/why-home-bg.webp?v=2`}
          alt=""
          aria-hidden="true"
        />
        <div className="chome-why-overlay" />
        <div className="chome-why-content">
          <h2 className="chome-why-title">{t(lang, 'chargingHome.why.title')}</h2>
          <p className="chome-why-desc">{t(lang, 'chargingHome.why.desc1')}</p>
          <p className="chome-why-desc">{t(lang, 'chargingHome.why.desc2')}</p>
        </div>
      </section>

      {/* ─── Charging Speed ─── */}
      <section className="chome-section chome-speed">
        <div className="chome-container">
          <h2 className="chome-section-title">{t(lang, 'chargingHome.speed.title')}</h2>
          <div className="chome-speed-grid">
            <div className="chome-speed-card">
              <img src={`${IMG_L3}/icon-level1.png`} alt="" className="chome-speed-icon" />
              <h3 className="chome-speed-name">{t(lang, 'chargingHome.speed.level1')}</h3>
              <p className="chome-speed-time">{t(lang, 'chargingHome.speed.level1Time')}</p>
              <p className="chome-speed-note">{t(lang, 'chargingHome.speed.level1Note')}</p>
            </div>
            <div className="chome-speed-card featured">
              <img src={`${IMG_L3}/icon-level2.png`} alt="" className="chome-speed-icon" />
              <h3 className="chome-speed-name">{t(lang, 'chargingHome.speed.level2')}</h3>
              <p className="chome-speed-time">{t(lang, 'chargingHome.speed.level2Time')}</p>
              <p className="chome-speed-note">{t(lang, 'chargingHome.speed.level2Note')}</p>
            </div>
            <div className="chome-speed-card">
              <img src={`${IMG_L3}/icon-level3.png`} alt="" className="chome-speed-icon" />
              <h3 className="chome-speed-name">{t(lang, 'chargingHome.speed.level3')}</h3>
              <p className="chome-speed-time">{t(lang, 'chargingHome.speed.level3Time')}</p>
              <p className="chome-speed-note">{t(lang, 'chargingHome.speed.level3Note')}</p>
            </div>
          </div>
          <p className="chome-speed-foot">{t(lang, 'chargingHome.speed.note')}</p>
        </div>
      </section>

      {/* ─── Built For Everyday Operation ─── */}
      <section className="chome-everyday">
        <div className="chome-container">
          <h2 className="chome-section-title">{t(lang, 'chargingHome.everyday.title')}</h2>
          <p className="chome-everyday-intro">{t(lang, 'chargingHome.everyday.desc')}</p>
          <div className="chome-features">
            <div className="chome-feature-card">
              <img src={`${IMG_L3}/icon-smart.png`} alt="" className="chome-feature-icon" />
              <h3 className="chome-feature-title">{t(lang, 'chargingHome.everyday.quiet')}</h3>
            </div>
            <div className="chome-feature-card">
              <img src={`${IMG_L3}/icon-speed.png`} alt="" className="chome-feature-icon" />
              <h3 className="chome-feature-title">{t(lang, 'chargingHome.everyday.reliable')}</h3>
            </div>
            <div className="chome-feature-card">
              <img src={`${IMG_L3}/icon-design.png`} alt="" className="chome-feature-icon" />
              <h3 className="chome-feature-title">{t(lang, 'chargingHome.everyday.compatibility')}</h3>
            </div>
          </div>
          <p className="chome-feature-note">{t(lang, 'chargingHome.everyday.note')}</p>
        </div>
      </section>

      {/* ─── Easy to Install ─── */}
      <section style={{ background: '#000', padding: '40px 0' }}>
        <div className="chome-split">
          <div className="chome-split-text">
            <h2>{t(lang, 'chargingHome.install.title')}</h2>
            <p>{t(lang, 'chargingHome.install.desc')}</p>
          </div>
          <div
            className="chome-split-img right"
            style={{ backgroundImage: `url(${IMG_HOME}/easy-install.webp?v=2)` }}
          />
        </div>
      </section>

      {/* ─── Smart Charging ─── */}
      <section className="chome-smart">
        <div className="chome-smart-inner">
          <div className="chome-smart-text">
            <h2>{t(lang, 'chargingHome.smart.title')}</h2>
            <p>{t(lang, 'chargingHome.smart.desc1')}</p>
            <p>{t(lang, 'chargingHome.smart.desc2')}</p>
          </div>
          <div className="chome-smart-img">
            <img src={`${IMG_HOME}/smart-app.webp`} alt="" />
          </div>
        </div>
      </section>

      {/* ─── Grow With Your Energy Setup ─── */}
      <section style={{ background: '#000', padding: '40px 0' }}>
        <div className="chome-split reverse">
          <div
            className="chome-split-img left"
            style={{ backgroundImage: `url(${IMG_HOME}/grow-energy.webp?v=2)` }}
          />
          <div className="chome-split-text">
            <h2>{t(lang, 'chargingHome.grow.title')}</h2>
            <p>{t(lang, 'chargingHome.grow.desc')}</p>
          </div>
        </div>
      </section>

      {/* ─── Home Charging, Done Right (Final CTA) ─── */}
      <section className="chome-finalcta">
        <img
          className="chome-finalcta-bg"
          src={`${IMG_HOME}/final-bg.webp`}
          alt=""
          aria-hidden="true"
        />
        <div className="chome-finalcta-overlay" />
        <div className="chome-finalcta-inner">
          <h2 className="chome-finalcta-title">{t(lang, 'chargingHome.cta.title')}</h2>
          <p className="chome-finalcta-desc">{t(lang, 'chargingHome.cta.desc')}</p>
          <div className="chome-finalcta-ctas">
            <a href={`/${lang}/join?profile=host`} className="chome-cta-primary">
              {t(lang, 'chargingHome.hero.ctaOrder')}
            </a>
            <a href={`/${lang}/chat`} className="chome-cta-secondary">
              {t(lang, 'chargingHome.cta.ctaGrog')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
