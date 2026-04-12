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
        .eh-easy{background:#000;overflow:hidden}
        .eh-easy-inner{display:flex;align-items:center;max-width:1920px;margin:0 auto}
        .eh-easy-text{flex:0 0 auto;padding:60px 50px;max-width:500px}
        .eh-easy-title{font-size:24px;font-weight:500;color:#fff;margin:0 0 20px}
        .eh-easy-desc{font-size:14px;color:#a3a3a3;line-height:1.78;margin:0}
        .eh-easy-img-wrap{flex:1;margin-left:161px;display:flex;justify-content:flex-end}
        .eh-easy-img{width:977px;height:614px;object-fit:cover;border-radius:20px 0 0 20px;display:block}
        @media(max-width:768px){
          .eh-easy-inner{flex-direction:column}
          .eh-easy-text{padding:40px 24px;max-width:100%}
          .eh-easy-img-wrap{margin-left:0;width:100%;justify-content:center}
          .eh-easy-img{width:100%;height:auto;border-radius:20px}
        }
      `}</style>
    </section>
  );
}
