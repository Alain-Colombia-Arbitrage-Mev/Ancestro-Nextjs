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

      <style>{`
        .eh-app{background:#000;overflow:hidden;padding:100px 40px}
        .eh-app-top{display:flex;align-items:center;gap:40px;max-width:1280px;margin:0 auto 60px}
        .eh-app-text{flex:1;max-width:428px}
        .eh-app-title{font-size:34px;font-weight:500;color:#fff;margin:0 0 16px;text-align:left}
        .eh-app-desc{font-size:14px;color:#a3a3a3;margin:0 0 24px;line-height:1.6;max-width:650px}
        .eh-app-badge{width:232px;height:69px;display:block}
        .eh-app-phone-wrap{flex:1;position:relative;display:flex;justify-content:center}
        .eh-app-phone{max-width:400px;width:100%;display:block;position:relative;z-index:1}
        .eh-app-phone-fade{position:absolute;bottom:0;left:0;right:0;height:150px;background:linear-gradient(transparent,#000);z-index:2}
        .eh-app-features{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:1280px;margin:0 auto;padding:0}
        .eh-app-feat{border-radius:12px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);padding:20px;display:flex;flex-direction:column;gap:10px;transition:all .3s ease;cursor:pointer}
        .eh-app-feat:hover{border-color:rgba(248,176,59,.4);transform:translateY(-2px)}
        .eh-app-feat-title{font-size:24px;font-weight:500;color:#fff;margin:0}
        .eh-app-feat-desc{font-size:14px;color:#a3a3a3;line-height:1.78;margin:0;max-width:650px}
        @media(max-width:1024px){
          .eh-app{padding:80px 40px}
          .eh-app-features{grid-template-columns:repeat(2,1fr)}
          .eh-app-title{font-size:28px}
          .eh-app-feat-title{font-size:20px}
        }
        @media(max-width:768px){
          .eh-app{padding:60px 40px}
          .eh-app-top{flex-direction:column;text-align:center;gap:30px}
          .eh-app-text{max-width:100%}
          .eh-app-title{text-align:center;font-size:24px}
          .eh-app-badge{margin:0 auto}
          .eh-app-phone{max-width:300px}
          .eh-app-features{grid-template-columns:1fr;gap:20px}
          .eh-app-feat-title{font-size:20px}
        }
        @media(max-width:480px){
          .eh-app{padding:60px 24px}
          .eh-app-title{font-size:24px}
          .eh-app-feat-title{font-size:18px}
        }
      `}</style>
    </section>
  );
}
