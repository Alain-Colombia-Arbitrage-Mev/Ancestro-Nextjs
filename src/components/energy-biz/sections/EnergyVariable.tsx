import { t } from '@/i18n/translations';
import { IMG_BIZ } from '../EnergyBusinessPage';

export default function EnergyVariable({ lang }: { lang: string }) {
  return (
    <section
      className="eb-variable"
      style={{ backgroundImage: `linear-gradient(180deg, transparent 0%, rgba(0,0,0,.85) 100%), url(${IMG_BIZ}/energy-variable.webp)` }}
    >
      <div className="eb-variable-inner">
        <h2 className="eb-variable-title">{t(lang, 'energyBiz.variable.title')}</h2>
        <p className="eb-variable-desc">{t(lang, 'energyBiz.variable.desc')}</p>
      </div>
    </section>
  );
}
