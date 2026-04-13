import { t } from '@/i18n/translations';
import { IMG_BIZ } from '../EnergyBusinessPage';

export default function HandlesEverything({ lang }: { lang: string }) {
  return (
    <section
      className="eb-handles"
      style={{ backgroundImage: `linear-gradient(180deg, transparent 0%, rgba(0,0,0,.85) 100%), url(${IMG_BIZ}/handles-everything.webp)` }}
    >
      <div className="eb-handles-inner">
        <h2 className="eb-handles-title">{t(lang, 'energyBiz.handles.title')}</h2>
        <p className="eb-handles-desc">{t(lang, 'energyBiz.handles.desc')}</p>
      </div>
    </section>
  );
}
