import { t } from '@/i18n/translations';
import { IMG } from '../EnergyHomePage';

export default function PowerOn({ lang }: { lang: string }) {
  return (
    <section className="eh-power">
      <img src={`${IMG}/power-on-bg.webp`} alt="" className="eh-power-bg" />
      <div className="eh-power-overlay" />
      <div className="eh-power-inner">
        <h2 className="eh-power-title">{t(lang, 'energyHome.powerOn.title')}</h2>
        <p className="eh-power-desc">{t(lang, 'energyHome.powerOn.desc')}</p>
      </div>

      <style>{`
        .eh-power{position:relative;width:100%;min-height:800px;display:flex;align-items:flex-end;overflow:hidden}
        .eh-power-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;display:block}
        .eh-power-overlay{position:absolute;inset:0;background:linear-gradient(180deg,transparent 0%,rgba(0,0,0,.85) 100%)}
        .eh-power-inner{position:relative;z-index:1;padding:0 40px 80px;max-width:1280px}
        .eh-power-title{font-size:30px;font-weight:500;color:#fff;margin:0 0 16px}
        .eh-power-desc{font-size:14px;color:#a3a3a3;line-height:1.57;margin:0;max-width:600px}
        @media(max-width:1024px){
          .eh-power{min-height:650px}
          .eh-power-inner{padding:0 40px 60px}
          .eh-power-title{font-size:26px}
        }
        @media(max-width:768px){
          .eh-power{min-height:550px}
          .eh-power-inner{padding:0 40px 60px}
          .eh-power-title{font-size:24px}
        }
        @media(max-width:480px){
          .eh-power{min-height:450px}
          .eh-power-inner{padding:0 24px 40px}
          .eh-power-title{font-size:24px}
        }
      `}</style>
    </section>
  );
}
