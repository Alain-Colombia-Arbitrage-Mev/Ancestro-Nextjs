import { t } from '@/i18n/translations';
import { IMG } from '../cdn';

export default function HeroSection({ lang }: { lang: string }) {
  return (
    <section className="eh-hero">
      <div className="eh-hero-bg">
        <video
          className="eh-hero-video"
          src={`${IMG}/hero-video.mp4`}
          autoPlay muted loop playsInline
          preload="metadata"
          poster={`${IMG}/hero-bg.webp`}
          aria-hidden="true"
        />
        <div className="eh-hero-gradient" />
      </div>
      <div className="eh-hero-content">
        <h1 className="eh-hero-title">{t(lang, 'energyHome.hero.title')}</h1>
        <p className="eh-hero-sub">{t(lang, 'energyHome.hero.subtitle')}</p>
      </div>
      <div className="eh-hero-cta-wrap">
        <a href={`/${lang}/join`} className="eh-cta-glass">{t(lang, 'energyHome.hero.cta')}</a>
      </div>
    </section>
  );
}
