import { t } from '@/i18n/translations';
import { imgUrl } from '../cdn';

export default function CleanEnergy({ lang }: { lang: string }) {
  return (
    <section className="eh-clean">
      <img src={imgUrl('clean-energy-house.webp')} alt="" className="eh-clean-bg" />
      <div className="eh-clean-overlay" />
      <div className="eh-clean-inner">
        <h2 className="eh-clean-title">{t(lang, 'energyHome.clean.title')}</h2>
        <p className="eh-clean-desc">{t(lang, 'energyHome.clean.desc')}</p>
      </div>
    </section>
  );
}
