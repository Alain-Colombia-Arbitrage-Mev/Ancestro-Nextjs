import { t } from '@/i18n/translations';
import { IMG_BIZ } from '../EnergyBusinessPage';

export default function AppBiz({ lang }: { lang: string }) {
  return (
    <section className="eb-app">
      <div className="eb-app-inner">
        <div className="eb-app-header">
          <h2 className="eb-app-title">{t(lang, 'energyBiz.app.title')}</h2>
          <p className="eb-app-desc">{t(lang, 'energyBiz.app.desc')}</p>
        </div>
        <div className="eb-app-phones">
          <img src={`${IMG_BIZ}/phone-app-1.webp`} alt="Ancestro App" className="eb-app-phone eb-app-phone-1" />
          <img src={`${IMG_BIZ}/phone-app-2.webp`} alt="Ancestro App" className="eb-app-phone eb-app-phone-2" />
        </div>
      </div>
    </section>
  );
}
