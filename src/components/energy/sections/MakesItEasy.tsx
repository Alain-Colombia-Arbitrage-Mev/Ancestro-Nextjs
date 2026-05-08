import { t } from '@/i18n/translations';
import { imgUrl } from '../cdn';

export default function MakesItEasy({ lang }: { lang: string }) {
  return (
    <section className="eh-easy">
      <div className="eh-easy-inner">
        <div className="eh-easy-text">
          <h2 className="eh-easy-title">{t(lang, 'energyHome.makesEasy.title')}</h2>
          <p className="eh-easy-desc">{t(lang, 'energyHome.makesEasy.desc')}</p>
        </div>
        <div className="eh-easy-img-wrap">
          <img src={imgUrl('installer-man.webp')} alt="" className="eh-easy-img" />
        </div>
      </div>
    </section>
  );
}
