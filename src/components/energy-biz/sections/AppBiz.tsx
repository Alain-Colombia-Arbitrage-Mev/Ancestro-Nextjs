import { t } from '@/i18n/translations';
import { IMG } from '../EnergyBusinessPage';

export default function AppBiz({ lang }: { lang: string }) {
  return (
    <section className="eb-app">
      <div className="eb-app-inner">
        <h2 className="eb-app-title">{t(lang, 'energyBiz.app.title')}</h2>
        <p className="eb-app-desc">{t(lang, 'energyBiz.app.desc')}</p>
        <div className="eb-app-phones">
          <div className="eb-app-phone-wrap">
            <img src={`${IMG}/app-phone-v2.webp`} alt="" className="eb-app-phone" />
            <div className="eb-app-phone-fade" />
          </div>
          <div className="eb-app-phone-wrap">
            <img src={`${IMG}/app-phone-v2.webp`} alt="" className="eb-app-phone" />
            <div className="eb-app-phone-fade" />
          </div>
        </div>
      </div>
    </section>
  );
}
