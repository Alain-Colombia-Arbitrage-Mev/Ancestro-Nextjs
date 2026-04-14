import { t } from '@/i18n/translations';
import { IMG_L3 } from '../constants';

export default function HeroL3({ lang }: { lang: string }) {
  return (
    <section
      className="cl3-hero"
      style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.5) 0%, rgba(0,0,0,.35) 40%, rgba(0,0,0,.8) 100%), url(${IMG_L3}/hero-bg.webp)` }}
    >
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
