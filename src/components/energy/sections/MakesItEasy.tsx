import { t } from '@/i18n/translations';
import { IMG } from '../EnergyHomePage';

export default function MakesItEasy({ lang }: { lang: string }) {
  return (
    <section className="eh-easy">
      <div className="eh-easy-inner">
        <div className="eh-easy-text">
          <h2 className="eh-easy-title">{t(lang, 'energyHome.makesEasy.title')}</h2>
          <p className="eh-easy-desc">{t(lang, 'energyHome.makesEasy.desc')}</p>
        </div>
        <div className="eh-easy-img-wrap">
          <img src={`${IMG}/installer-man.webp`} alt="" className="eh-easy-img" />
        </div>
      </div>
    </section>
  );
}
