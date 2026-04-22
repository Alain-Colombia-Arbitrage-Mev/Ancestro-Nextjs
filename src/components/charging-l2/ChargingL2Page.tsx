import './charging-l2.css';
import { t } from '@/i18n/translations';
import AskBox from '@/components/AskBox';
import { IMG_L2, IMG_L3, FLAGS } from './constants';
import { CDN_URL } from '@/lib/cdn';

const COUNTRIES = [
  'colombia', 'panama', 'dominican-republic', 'mexico', 'peru',
  'guatemala', 'el-salvador', 'uruguay', 'costa-rica', 'brazil',
  'nicaragua', 'honduras', 'chile', 'argentina', 'bolivia',
  'belize', 'ecuador', 'paraguay',
];

export default function ChargingL2Page({ lang }: { lang: string }) {
  return (
    <div style={{ background: '#000', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      {/* ─── Hero ─── */}
      <section className="cl2-hero">
        <img
          className="cl2-hero-bg"
          src={`${IMG_L2}/hero-bg.webp`}
          alt=""
          aria-hidden="true"
        />
        <div className="cl2-hero-overlay" />
        <div className="cl2-hero-content">
          <h1 className="cl2-hero-title">{t(lang, 'chargingL2.hero.title')}</h1>
          <p className="cl2-hero-sub">{t(lang, 'chargingL2.hero.sub')}</p>
        </div>
        <div className="cl2-hero-ctas">
          <a href={`/${lang}/join?profile=host`} className="cl2-cta-primary">{t(lang, 'chargingL2.hero.ctaHost')}</a>
          <a href={`/${lang}/join?profile=energy`} className="cl2-cta-secondary">{t(lang, 'chargingL2.hero.ctaBuy')}</a>
        </div>
      </section>

      <div style={{ position: 'relative', zIndex: 2, marginTop: -52 }}>
        <AskBox lang={lang} />
      </div>

      {/* ─── Charging Speed ─── */}
      <section className="cl2-section cl2-speed">
        <div className="cl2-container">
          <h2 className="cl2-section-title">{t(lang, 'chargingL2.speed.title')}</h2>
          <div className="cl2-speed-grid">
            <div className="cl2-speed-card">
              <img src={`${IMG_L3}/icon-level1.png`} alt="" className="cl2-speed-icon" />
              <h3 className="cl2-speed-name">{t(lang, 'chargingL2.speed.level1')}</h3>
              <p className="cl2-speed-time">{t(lang, 'chargingL2.speed.level1Time')}</p>
            </div>
            <div className="cl2-speed-card featured">
              <img src={`${IMG_L3}/icon-level2.png`} alt="" className="cl2-speed-icon" />
              <h3 className="cl2-speed-name">{t(lang, 'chargingL2.speed.level2')}</h3>
              <p className="cl2-speed-time">{t(lang, 'chargingL2.speed.level2Time')}</p>
            </div>
            <div className="cl2-speed-card">
              <img src={`${IMG_L3}/icon-level3.png`} alt="" className="cl2-speed-icon" />
              <h3 className="cl2-speed-name">{t(lang, 'chargingL2.speed.level3')}</h3>
              <p className="cl2-speed-time">{t(lang, 'chargingL2.speed.level3Time')}</p>
            </div>
          </div>
          <p className="cl2-speed-note">{t(lang, 'chargingL2.speed.note')}</p>
        </div>
      </section>

      {/* ─── Destinations, Not Detours / Hotels & Resorts ─── */}
      <section className="cl2-dest">
        <img
          className="cl2-dest-bg"
          src={`${IMG_L2}/dest-bg.webp`}
          alt=""
          aria-hidden="true"
        />
        <div className="cl2-dest-overlay" />
        <div className="cl2-dest-top">
          <h2 className="cl2-dest-title">{t(lang, 'chargingL2.dest.title')}</h2>
          <p className="cl2-dest-desc">{t(lang, 'chargingL2.dest.desc')}</p>
        </div>
        <div className="cl2-dest-bottom">
          <p className="cl2-dest-category">{t(lang, 'chargingL2.dest.category')}</p>
          <p className="cl2-dest-note">{t(lang, 'chargingL2.dest.note')}</p>
        </div>
      </section>

      {/* ─── Everyday Operation ─── */}
      <section className="cl2-everyday">
        <div className="cl2-container">
          <h2 className="cl2-section-title" style={{ marginBottom: 20 }}>
            {t(lang, 'chargingL2.everyday.title')}
          </h2>
          <p className="cl2-everyday-intro">{t(lang, 'chargingL2.everyday.desc')}</p>
          <div className="cl2-features">
            <div className="cl2-feature-card">
              <img src={`${IMG_L3}/icon-speed.png`} alt="" className="cl2-feature-icon" />
              <h3 className="cl2-feature-title">{t(lang, 'chargingL2.everyday.reliability')}</h3>
            </div>
            <div className="cl2-feature-card">
              <img src={`${IMG_L3}/icon-design.png`} alt="" className="cl2-feature-icon" />
              <h3 className="cl2-feature-title">{t(lang, 'chargingL2.everyday.compatibility')}</h3>
            </div>
            <div className="cl2-feature-card">
              <img src={`${IMG_L3}/icon-smart.png`} alt="" className="cl2-feature-icon" />
              <h3 className="cl2-feature-title">{t(lang, 'chargingL2.everyday.quiet')}</h3>
            </div>
          </div>
          <p className="cl2-feature-note">{t(lang, 'chargingL2.everyday.note')}</p>
        </div>
      </section>

      {/* ─── Fully Managed End-to-End ─── */}
      <section style={{ background: '#000', padding: '40px 0' }}>
        <div className="cl2-split">
          <div className="cl2-split-text">
            <h2>{t(lang, 'chargingL2.managed.title')}</h2>
            <p>{t(lang, 'chargingL2.managed.desc1')}</p>
            <p>{t(lang, 'chargingL2.managed.desc2')}</p>
          </div>
          <div
            className="cl2-split-img left"
            style={{ backgroundImage: `url(${IMG_L2}/managed.webp)` }}
          />
        </div>
      </section>

      {/* ─── Part Of Network + Stats ─── */}
      <section className="cl2-network">
        <div className="cl2-network-inner">
          <div className="cl2-network-img">
            <img src={`${CDN_URL}/MAPA.svg`} alt="" />
          </div>
          <div className="cl2-network-text">
            <h2>{t(lang, 'chargingL2.network.title')}</h2>
            <p>{t(lang, 'chargingL2.network.desc1')}</p>
            <p>{t(lang, 'chargingL2.network.desc2')}</p>
            <div className="cl2-flags">
              {COUNTRIES.map((c) => (
                <img key={c} src={`${FLAGS}/${c}.png`} alt={c} className="cl2-flag" />
              ))}
            </div>
          </div>
        </div>
        <div className="cl2-stats">
          <div className="cl2-stat"><p className="cl2-stat-num">1800+</p><p className="cl2-stat-label">{t(lang, 'chargingL2.network.chargers')}</p></div>
          <div className="cl2-stat"><p className="cl2-stat-num">18</p><p className="cl2-stat-label">{t(lang, 'chargingL2.network.countries')}</p></div>
          <div className="cl2-stat"><p className="cl2-stat-num">305,000</p><p className="cl2-stat-label">{t(lang, 'chargingL2.network.members')}</p></div>
        </div>
      </section>

      {/* ─── One App. One Experience ─── */}
      <section className="cl2-app">
        <div className="cl2-app-inner">
          <div className="cl2-app-text">
            <h2>{t(lang, 'chargingL2.app.title')}</h2>
            <ul>
              <li>{t(lang, 'chargingL2.app.bullet1')}</li>
              <li>{t(lang, 'chargingL2.app.bullet2')}</li>
              <li>{t(lang, 'chargingL2.app.bullet3')}</li>
              <li>{t(lang, 'chargingL2.app.bullet4')}</li>
              <li>{t(lang, 'chargingL2.app.bullet5')}</li>
            </ul>
          </div>
          <div className="cl2-app-img">
            <img src={`${CDN_URL}/energy-home/app-phone-v2.webp`} alt="" />
          </div>
        </div>
      </section>

      {/* ─── Hosting vs Buying ─── */}
      <section className="cl2-hosting">
        <h2 className="cl2-section-title">{t(lang, 'chargingL2.hosting.title')}</h2>
        <div className="cl2-hosting-grid">
          <div className="cl2-hosting-card">
            <div>
              <h3 className="cl2-hosting-title">
                {t(lang, 'chargingL2.hosting.buyTitle')}
                <span className="cl2-hosting-tag">{t(lang, 'chargingL2.hosting.buyTag')}</span>
              </h3>
              <p className="cl2-hosting-desc" style={{ marginTop: 16 }}>
                {t(lang, 'chargingL2.hosting.buyDesc')}
              </p>
            </div>
            <a href={`/${lang}/join?profile=energy`} className="cl2-hosting-cta buy">
              {t(lang, 'chargingL2.hosting.buyCta')}
            </a>
          </div>
          <div className="cl2-hosting-card featured">
            <span className="cl2-hosting-badge">{t(lang, 'chargingL2.hosting.mostPopular')}</span>
            <div>
              <h3 className="cl2-hosting-title">
                {t(lang, 'chargingL2.hosting.hostTitle')}
                <span className="cl2-hosting-tag">{t(lang, 'chargingL2.hosting.hostTag')}</span>
              </h3>
              <p className="cl2-hosting-desc" style={{ marginTop: 16 }}>
                {t(lang, 'chargingL2.hosting.hostDesc')}
              </p>
            </div>
            <a href={`/${lang}/join?profile=host`} className="cl2-hosting-cta host">
              {t(lang, 'chargingL2.hosting.hostCta')}
            </a>
          </div>
        </div>
      </section>

      {/* ─── Software Advantage ─── */}
      <section style={{ background: '#000', padding: '40px 0' }}>
        <div className="cl2-split reverse">
          <div className="cl2-split-text">
            <h2>{t(lang, 'chargingL2.software.title')}</h2>
            <p>{t(lang, 'chargingL2.software.desc1')}</p>
            <p>{t(lang, 'chargingL2.software.desc2')}</p>
          </div>
          <div
            className="cl2-split-img right"
            style={{ backgroundImage: `url(${IMG_L2}/software.webp)` }}
          />
        </div>
      </section>

      {/* ─── Footer CTA ─── */}
      <section className="cl2-footercta">
        <img
          className="cl2-footercta-bg"
          src={`${IMG_L2}/footercta-bg.webp`}
          alt=""
          aria-hidden="true"
        />
        <div className="cl2-footercta-overlay" />
        <div className="cl2-footercta-inner">
          <h2 className="cl2-footercta-title">{t(lang, 'chargingL2.cta.title')}</h2>
          <p className="cl2-footercta-desc">{t(lang, 'chargingL2.cta.desc')}</p>
        </div>
        <div className="cl2-footercta-ctas">
          <a href={`/${lang}/join?profile=host`} className="cl2-cta-primary">
            {t(lang, 'chargingL2.hero.ctaHost')}
          </a>
          <a href={`/${lang}/join?profile=energy`} className="cl2-cta-secondary">
            {t(lang, 'chargingL2.hero.ctaBuy')}
          </a>
        </div>
      </section>
    </div>
  );
}
