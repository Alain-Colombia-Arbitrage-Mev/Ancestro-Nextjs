import { t } from '@/i18n/translations';
import { IMG_L3 } from '../constants';

export default function HeroL3({ lang }: { lang: string }) {
  return (
    <section className="cl3-hero">
      <video
        className="cl3-hero-video"
        src={`${IMG_L3}/hero-video.mp4`}
        poster={`${IMG_L3}/hero-bg.webp`}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div className="cl3-hero-overlay" />
      <div className="cl3-hero-content">
        <h1 className="cl3-hero-title">{t(lang, 'chargingL3.hero.title')}</h1>
        <p className="cl3-hero-sub">{t(lang, 'chargingL3.hero.sub')}</p>
        <p className="cl3-hero-desc">{t(lang, 'chargingL3.hero.desc')}</p>
      </div>
      <div className="cl3-hero-cta-wrap">
        <a href={`/${lang}/join?profile=host`} className="cl3-cta-primary">{t(lang, 'chargingL3.hero.cta')}</a>
      </div>
    </section>
  );
}
