import { t } from '@/i18n/translations';
import { IMG } from '../EnergyHomePage';

export default function GridDown({ lang }: { lang: string }) {
  return (
    <section className="eh-grid">
      <img src={`${IMG}/grid-down-bg.webp`} alt="" className="eh-grid-bg" />
      <div className="eh-grid-overlay" />
      <div className="eh-grid-inner">
        <h2 className="eh-grid-title">{t(lang, 'energyHome.gridDown.title')}</h2>
        <p className="eh-grid-desc">{t(lang, 'energyHome.gridDown.desc')}</p>
      </div>
    </section>
  );
}
