import { t } from '@/i18n/translations';
import { IMG } from '../EnergyHomePage';

export default function AncestroApp({ lang }: { lang: string }) {
  const features = [
    { key: 'customize' },
    { key: 'monitor' },
    { key: 'alerts' },
  ];

  return (
    <section className="eh-app">
      <div className="eh-app-top">
        <div className="eh-app-text">
          <h2 className="eh-app-title">{t(lang, 'energyHome.app.title')}</h2>
          <p className="eh-app-desc">{t(lang, 'energyHome.app.desc')}</p>
          <img
            src={`${IMG}/google-play-badge.webp`}
            alt="Google Play"
            className="eh-app-badge"
          />
        </div>
        <div className="eh-app-phone-wrap">
          <img src={`${IMG}/app-phone-v2.webp`} alt="" className="eh-app-phone" />
          <div className="eh-app-phone-fade" />
        </div>
      </div>

      <div className="eh-app-features">
        {features.map((f) => (
          <div key={f.key} className="eh-app-feat">
            <h3 className="eh-app-feat-title">{t(lang, `energyHome.appFeat.${f.key}.title`)}</h3>
            <p className="eh-app-feat-desc">{t(lang, `energyHome.appFeat.${f.key}.desc`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
