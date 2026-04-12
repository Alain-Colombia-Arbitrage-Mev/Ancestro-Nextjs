import { t } from '@/i18n/translations';
import { IMG } from '../EnergyHomePage';

export default function PowerOn({ lang }: { lang: string }) {
  return (
    <section className="eh-power">
      <img src={`${IMG}/power-on-bg.webp`} alt="" className="eh-power-bg" />
      <div className="eh-power-overlay" />
      <div className="eh-power-inner">
        <h2 className="eh-power-title">{t(lang, 'energyHome.powerOn.title')}</h2>
        <p className="eh-power-desc">{t(lang, 'energyHome.powerOn.desc')}</p>
      </div>
    </section>
  );
}
