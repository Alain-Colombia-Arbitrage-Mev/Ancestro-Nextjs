import { t } from '@/i18n/translations';
import { IMG } from '../EnergyHomePage';

export default function MakesItEasy({ lang }: { lang: string }) {
  return (
    <section className="eh-easy">
      <div className="eh-easy-inner">
        <div className="eh-easy-text">
          <h2 className="eh-easy-title">{t(lang, 'energyHome.makesEasy.title')}</h2>
          <p className="eh-easy-desc">{t(lang, 'energyHome.makesEasy.desc')}</p>
        </div>
        <div className="eh-easy-img-wrap">
          <img src={`${IMG}/installer-man.webp`} alt="" className="eh-easy-img" />
        </div>
      </div>

      <style>{`
        .eh-easy{background:#000;overflow:hidden;padding:100px 0}
        .eh-easy-inner{display:flex;align-items:center;max-width:1280px;margin:0 auto;gap:80px}
        .eh-easy-text{flex:0 0 auto;padding:0 0 0 40px;max-width:500px}
        .eh-easy-title{font-size:34px;font-weight:500;color:#fff;margin:0 0 20px}
        .eh-easy-desc{font-size:14px;color:#a3a3a3;line-height:1.78;margin:0;max-width:650px}
        .eh-easy-img-wrap{flex:1;display:flex;justify-content:flex-end}
        .eh-easy-img{width:100%;max-height:500px;object-fit:cover;object-position:center;border-radius:20px 0 0 20px;display:block}
        @media(max-width:1024px){
          .eh-easy{padding:80px 0}
          .eh-easy-inner{gap:40px}
          .eh-easy-title{font-size:28px}
          .eh-easy-desc{font-size:14px}
        }
        @media(max-width:768px){
          .eh-easy{padding:60px 0}
          .eh-easy-inner{flex-direction:column;gap:30px}
          .eh-easy-text{padding:0 40px;max-width:100%}
          .eh-easy-title{font-size:24px}
          .eh-easy-img-wrap{width:100%;justify-content:center;padding:0 40px}
          .eh-easy-img{width:100%;height:auto;max-height:400px;border-radius:20px}
        }
        @media(max-width:480px){
          .eh-easy-text{padding:0 24px}
          .eh-easy-img-wrap{padding:0 24px}
        }
      `}</style>
    </section>
  );
}
