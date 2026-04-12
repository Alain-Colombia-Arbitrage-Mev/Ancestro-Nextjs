import { t } from '@/i18n/translations';
import { IMG } from '../EnergyHomePage';

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
          <img src={`${IMG}/battery-product.webp`} alt="" className="eh-install-img" />
        </div>
      </div>

      <style>{`
        .eh-install{background:#000;display:flex;align-items:center;min-height:600px}
        .eh-install-inner{display:flex;align-items:center;max-width:1920px;margin:0 auto;padding-left:50px;width:100%}
        .eh-install-text{flex:1;max-width:618px}
        .eh-install-title{font-size:34px;font-weight:600;color:#fff;margin:0 0 20px}
        .eh-install-desc{font-size:20px;color:#a3a3a3;margin:0 0 30px;line-height:1.6}
        .eh-install-cta{padding:15px 60px;border-radius:30px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#fff;font-size:16px;cursor:pointer;backdrop-filter:blur(10px)}
        .eh-install-cta:hover{background:rgba(255,255,255,.2)}
        .eh-install-img-wrap{flex:1;display:flex;justify-content:center}
        .eh-install-img{width:438px;height:657px;object-fit:contain;filter:drop-shadow(0 20px 40px rgba(0,0,0,.5))}
        @media(max-width:768px){
          .eh-install-inner{flex-direction:column;padding:40px 24px;text-align:center}
          .eh-install-text{max-width:100%}
          .eh-install-img{width:280px;height:auto}
        }
      `}</style>
    </section>
  );
}
