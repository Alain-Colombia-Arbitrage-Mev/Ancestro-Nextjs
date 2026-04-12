import { t } from '@/i18n/translations';
import { IMG } from '../EnergyHomePage';

export default function CleanEnergy({ lang }: { lang: string }) {
  return (
    <section className="eh-clean">
      <img src={`${IMG}/clean-energy-house.webp`} alt="" className="eh-clean-bg" />
      <div className="eh-clean-overlay" />
      <div className="eh-clean-inner">
        <h2 className="eh-clean-title">{t(lang, 'energyHome.clean.title')}</h2>
        <p className="eh-clean-desc">{t(lang, 'energyHome.clean.desc')}</p>
      </div>

      <style>{`
        .eh-clean{position:relative;width:100%;min-height:800px;display:flex;align-items:flex-start;overflow:hidden}
        .eh-clean-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .eh-clean-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.7) 0%,transparent 40%,transparent 60%,rgba(0,0,0,.7) 100%)}
        .eh-clean-inner{position:relative;z-index:1;width:100%;max-width:1200px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:20px;padding:49px 24px 60px}
        .eh-clean-title{font-size:34px;font-weight:600;line-height:1.15;color:#fff;text-align:center;margin:0}
        .eh-clean-desc{font-size:20px;font-weight:400;line-height:1.6;color:#a3a3a3;text-align:center;margin:0;max-width:1162px;white-space:pre-line}
        @media(max-width:768px){
          .eh-clean{min-height:500px}
          .eh-clean-title{font-size:26px}
          .eh-clean-desc{font-size:16px}
        }
      `}</style>
    </section>
  );
}
