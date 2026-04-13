import { t } from '@/i18n/translations';
import { IMG_BIZ } from '../EnergyBusinessPage';

export default function NoCapital({ lang }: { lang: string }) {
  return (
    <section
      className="eb-nocap"
      style={{ backgroundImage: `linear-gradient(180deg, transparent 0%, rgba(0,0,0,.85) 100%), url(${IMG_BIZ}/no-capital.webp)` }}
    >
      <div className="eb-nocap-inner">
        <h2 className="eb-nocap-title">{t(lang, 'energyBiz.noCapital.title')}</h2>
        <p className="eb-nocap-desc">{t(lang, 'energyBiz.noCapital.desc')}</p>
      </div>
    </section>
  );
}
