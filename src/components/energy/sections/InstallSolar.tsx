import { t } from '@/i18n/translations';
import { imgUrl } from '../cdn';

export default function InstallSolar({ lang }: { lang: string }) {
  return (
    <section className="eh-install">
      <div className="eh-install-inner">
        <div className="eh-install-text">
          <h2 className="eh-install-title">{t(lang, 'energyHome.installCta.title')}</h2>
          <p className="eh-install-desc">{t(lang, 'energyHome.installCta.desc')}</p>
          <button className="eh-install-cta">{t(lang, 'energyHome.installCta.cta')}</button>
        </div>
        <div className="eh-install-img-wrap">
          <img src={imgUrl('battery-product.webp')} alt="" className="eh-install-img" />
        </div>
      </div>
    </section>
  );
}
