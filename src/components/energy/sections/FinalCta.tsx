import { t } from '@/i18n/translations';
import { IMG } from '../EnergyHomePage';

export default function FinalCta({ lang }: { lang: string }) {
  return (
    <section className="eh-final">
      <img src={`${IMG}/final-cta-bg.webp`} alt="" className="eh-final-bg" />
      <div className="eh-final-overlay" />
      <div className="eh-final-inner">
        <h2 className="eh-final-title">{t(lang, 'energyHome.finalCta.title')}</h2>
        <p className="eh-final-desc">{t(lang, 'energyHome.finalCta.desc')}</p>
        <button className="eh-final-cta">{t(lang, 'energyHome.finalCta.cta')}</button>
      </div>

      <style>{`
        .eh-final{position:relative;width:100%;min-height:560px;display:flex;align-items:center;justify-content:center;overflow:hidden}
        .eh-final-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;display:block}
        .eh-final-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.7) 0%,rgba(0,0,0,.5) 100%)}
        .eh-final-inner{position:relative;z-index:1;text-align:center;padding:100px 40px;max-width:700px}
        .eh-final-title{font-size:30px;font-weight:500;color:#fff;margin:0 0 16px}
        .eh-final-desc{font-size:14px;color:#a3a3a3;margin:0 0 30px;max-width:650px;line-height:1.6}
        .eh-final-cta{padding:14px 40px;min-height:44px;border-radius:30px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#fff;font-size:15px;cursor:pointer;backdrop-filter:blur(10px);transition:all .3s ease}
        .eh-final-cta:hover{background:rgba(255,255,255,.2)}
        @media(max-width:1024px){
          .eh-final-inner{padding:80px 40px}
          .eh-final-title{font-size:26px}
        }
        @media(max-width:768px){
          .eh-final-inner{padding:60px 40px}
          .eh-final-title{font-size:24px}
        }
        @media(max-width:480px){
          .eh-final-inner{padding:60px 24px}
          .eh-final-title{font-size:24px}
          .eh-final-desc{font-size:13px}
        }
      `}</style>
    </section>
  );
}
