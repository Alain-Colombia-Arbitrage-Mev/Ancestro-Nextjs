import { t } from '@/i18n/translations';
import { IMG_BIZ } from '../EnergyBusinessPage';

export default function NoRoof({ lang }: { lang: string }) {
  return (
    <section
      className="eb-noroof"
      style={{ backgroundImage: `linear-gradient(180deg, transparent 0%, rgba(0,0,0,.85) 100%), url(${IMG_BIZ}/no-roof.webp)` }}
    >
      <div className="eb-noroof-inner">
        <h2 className="eb-noroof-title">{t(lang, 'energyBiz.noRoof.title')}</h2>
        <p className="eb-noroof-desc">{t(lang, 'energyBiz.noRoof.desc')}</p>
      </div>
    </section>
  );
}
