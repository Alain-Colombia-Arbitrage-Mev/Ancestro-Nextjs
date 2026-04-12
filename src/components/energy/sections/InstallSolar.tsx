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
        .eh-install{background:#000;display:flex;align-items:center;padding:100px 0}
        .eh-install-inner{display:flex;align-items:center;gap:60px;max-width:1280px;margin:0 auto;padding:0 40px;width:100%}
        .eh-install-text{flex:1;max-width:618px}
        .eh-install-title{font-size:34px;font-weight:600;color:#fff;margin:0 0 20px}
        .eh-install-desc{font-size:20px;color:#a3a3a3;margin:0 0 30px;line-height:1.6;max-width:650px}
        .eh-install-cta{padding:14px 40px;min-height:44px;border-radius:30px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#fff;font-size:16px;cursor:pointer;backdrop-filter:blur(10px);transition:all .3s ease}
        .eh-install-cta:hover{background:rgba(255,255,255,.2)}
        .eh-install-img-wrap{flex:1;display:flex;justify-content:center}
        .eh-install-img{max-width:438px;width:100%;max-height:500px;object-fit:contain;display:block;filter:drop-shadow(0 20px 40px rgba(0,0,0,.5))}
        @media(max-width:1024px){
          .eh-install{padding:80px 0}
          .eh-install-inner{gap:40px;padding:0 40px}
          .eh-install-title{font-size:28px}
          .eh-install-desc{font-size:18px}
        }
        @media(max-width:768px){
          .eh-install{padding:60px 0}
          .eh-install-inner{flex-direction:column;padding:0 40px;text-align:center}
          .eh-install-text{max-width:100%}
          .eh-install-title{font-size:24px}
          .eh-install-desc{font-size:16px}
          .eh-install-img{max-width:280px;max-height:400px}
        }
        @media(max-width:480px){
          .eh-install-inner{padding:0 24px}
          .eh-install-title{font-size:24px}
          .eh-install-desc{font-size:16px}
        }
      `}</style>
    </section>
  );
}
