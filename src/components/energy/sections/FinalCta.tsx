import { t } from '@/i18n/translations';

export default function FinalCta({ lang }: { lang: string }) {
  return (
    <section className="eh-final">
      <div className="eh-final-inner">
        <h2 className="eh-final-title">{t(lang, 'energyHome.finalCta.title')}</h2>
        <p className="eh-final-desc">{t(lang, 'energyHome.finalCta.desc')}</p>
        <button type="button" className="eh-final-cta">{t(lang, 'energyHome.finalCta.cta')}</button>
      </div>

      <style>{`
        .eh-final{background:#000;display:flex;align-items:center;justify-content:center;padding:100px 59px 35px}
        .eh-final-inner{display:flex;flex-direction:column;align-items:center;gap:20px;text-align:center;max-width:700px}
        .eh-final-title{font-size:30px;font-weight:600;color:#fff;margin:0}
        .eh-final-desc{font-size:17px;font-weight:400;color:#fff;margin:0;max-width:618px;line-height:1.5}
        .eh-final-cta{padding:15px 60px;background:rgba(255,255,255,.1);backdrop-filter:blur(26px);-webkit-backdrop-filter:blur(26px);border:1px solid rgba(255,255,255,.15);border-radius:15px;color:#fff;font-size:16px;font-weight:600;cursor:pointer;transition:all .3s ease}
        .eh-final-cta:hover{background:rgba(248,176,59,.2);border-color:rgba(248,176,59,.5)}
        @media(max-width:768px){
          .eh-final{padding:80px 40px 30px}
          .eh-final-title{font-size:26px}
          .eh-final-desc{font-size:15px}
          .eh-final-cta{padding:14px 40px}
        }
        @media(max-width:480px){
          .eh-final{padding:60px 24px 30px}
          .eh-final-title{font-size:24px}
          .eh-final-desc{font-size:15px}
        }
      `}</style>
    </section>
  );
}
