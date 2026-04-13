import { t } from '@/i18n/translations';
import { IMG_BIZ } from '../EnergyBusinessPage';

export default function HeroBiz({ lang }: { lang: string }) {
  return (
    <section
      className="eb-hero"
      style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.5) 0%, transparent 40%, rgba(0,0,0,.85) 100%), url(${IMG_BIZ}/hero-biz.webp)` }}
    >
      <div className="eb-hero-content">
        <h1 className="eb-hero-title">{t(lang, 'energyBiz.hero.title')}</h1>
        <p className="eb-hero-sub">{t(lang, 'energyBiz.hero.subtitle')}</p>
      </div>
      <div className="eb-hero-cta-wrap">
        <button type="button" className="eb-cta-glass">{t(lang, 'energyBiz.hero.cta')}</button>
      </div>
    </section>
  );
}
