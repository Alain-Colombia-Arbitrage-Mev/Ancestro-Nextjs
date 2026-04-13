import { t } from '@/i18n/translations';
import { IMG_BIZ } from '../EnergyBusinessPage';

export default function ControlCost({ lang }: { lang: string }) {
  return (
    <section
      className="eb-control"
      style={{ backgroundImage: `linear-gradient(180deg, transparent 0%, rgba(0,0,0,.85) 100%), url(${IMG_BIZ}/control-cost.webp)` }}
    >
      <div className="eb-control-inner">
        <h2 className="eb-control-title">{t(lang, 'energyBiz.controlCost.title')}</h2>
        <p className="eb-control-desc">{t(lang, 'energyBiz.controlCost.desc')}</p>
      </div>
    </section>
  );
}
