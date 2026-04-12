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
        .eh-power{position:relative;width:100%;min-height:1080px;display:flex;align-items:flex-end;overflow:hidden}
        .eh-power-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .eh-power-overlay{position:absolute;inset:0;background:linear-gradient(180deg,transparent 0%,rgba(0,0,0,.85) 100%)}
        .eh-power-inner{position:relative;z-index:1;padding:0 50px 80px;max-width:1200px}
        .eh-power-title{font-size:34px;font-weight:500;color:#fff;margin:0 0 16px}
        .eh-power-desc{font-size:14px;color:#a3a3a3;line-height:1.57;margin:0}
        @media(max-width:768px){
          .eh-power{min-height:700px}
          .eh-power-inner{padding:0 24px 50px}
          .eh-power-title{font-size:26px}
        }
      `}</style>
    </section>
  );
}
