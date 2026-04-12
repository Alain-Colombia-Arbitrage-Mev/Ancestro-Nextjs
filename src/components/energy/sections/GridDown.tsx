import { t } from '@/i18n/translations';
import { IMG } from '../EnergyHomePage';

export default function GridDown({ lang }: { lang: string }) {
  return (
    <section className="eh-grid">
      <img src={`${IMG}/grid-down-bg.webp`} alt="" className="eh-grid-bg" />
      <div className="eh-grid-overlay" />
      <div className="eh-grid-inner">
        <h2 className="eh-grid-title">{t(lang, 'energyHome.gridDown.title')}</h2>
        <p className="eh-grid-desc">{t(lang, 'energyHome.gridDown.desc')}</p>
      </div>

      <style>{`
        .eh-grid{position:relative;width:100%;min-height:720px;display:flex;align-items:flex-end;overflow:hidden}
        .eh-grid-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .eh-grid-overlay{position:absolute;inset:0;background:linear-gradient(180deg,transparent 0%,#000 95%)}
        .eh-grid-inner{position:relative;z-index:1;padding:0 50px 60px;max-width:1200px}
        .eh-grid-title{font-size:34px;font-weight:500;color:#fff;margin:0 0 12px}
        .eh-grid-desc{font-size:14px;color:#a3a3a3;margin:0}
        @media(max-width:768px){
          .eh-grid{min-height:500px}
          .eh-grid-inner{padding:0 24px 40px}
          .eh-grid-title{font-size:26px}
        }
      `}</style>
    </section>
  );
}
