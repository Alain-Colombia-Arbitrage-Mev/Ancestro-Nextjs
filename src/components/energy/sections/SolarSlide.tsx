'use client';
import { useState } from 'react';
import { t } from '@/i18n/translations';
import { IMG } from '../EnergyHomePage';

const slides = [
  { titleKey: 'energyHome.flow.wifi.title', descKey: 'energyHome.flow.wifi.desc' },
  { titleKey: 'energyHome.flow.use.title', descKey: 'energyHome.flow.use.desc' },
  { titleKey: 'energyHome.flow.store.title', descKey: 'energyHome.flow.store.desc' },
  { titleKey: 'energyHome.flow.charge.title', descKey: 'energyHome.flow.charge.desc' },
];

export default function SolarSlide({ lang }: { lang: string }) {
  const [active, setActive] = useState(0);
  return (
    <section className="eh-slide">
      <img src={`${IMG}/night-house-bg.webp`} alt="" className="eh-slide-bg" />
      <div className="eh-slide-overlay" />
      <div className="eh-slide-content">
        <h2 className="eh-slide-heading">{t(lang, 'energyHome.install.title')}</h2>
        <p className="eh-slide-sub">{t(lang, 'energyHome.install.desc')}</p>
        <div className="eh-slide-panel">
          <h3 className="eh-slide-title">{t(lang, slides[active].titleKey)}</h3>
          <p className="eh-slide-desc">{t(lang, slides[active].descKey)}</p>
          <button type="button" className="eh-cta-glass" style={{marginTop:16}}>{t(lang, 'energyHome.flow.cta')}</button>
        </div>
        <div className="eh-slide-dots">
          {slides.map((_, i) => (
            <button key={i} type="button" className={`eh-dot ${i === active ? 'active' : ''}`} onClick={() => setActive(i)} />
          ))}
        </div>
      </div>

      <style>{`
        .eh-slide{position:relative;width:100%;height:900px;overflow:hidden}
        .eh-slide-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;display:block}
        .eh-slide-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.6) 0%,transparent 35%,transparent 65%,rgba(0,0,0,.9) 100%)}
        .eh-slide-content{position:relative;z-index:1;height:100%;display:flex;flex-direction:column;align-items:center}
        .eh-slide-heading{font-size:34px;font-weight:500;color:#fff;text-align:center;margin:0;padding-top:120px}
        .eh-slide-sub{font-size:14px;font-weight:400;color:#a3a3a3;text-align:center;max-width:650px;margin:16px auto 0;padding:0 40px}
        .eh-slide-panel{position:absolute;bottom:160px;left:50%;transform:translateX(-50%);text-align:center;display:flex;flex-direction:column;align-items:center;gap:8px;padding:0 40px;max-width:650px}
        .eh-slide-title{font-size:34px;font-weight:600;color:#fff;margin:0}
        .eh-slide-desc{font-size:20px;font-weight:400;color:#a3a3a3;margin:0;max-width:650px}
        .eh-slide-dots{position:absolute;bottom:58px;left:50%;transform:translateX(-50%);display:flex;gap:10px}
        .eh-dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.1);border:none;cursor:pointer;padding:0;transition:all .3s;min-height:44px;min-width:44px;display:flex;align-items:center;justify-content:center;background-clip:content-box;box-sizing:content-box}
        .eh-dot.active{background:#f8b03b;width:28px;border-radius:999px}
        .eh-dot:hover:not(.active){background:rgba(255,255,255,.3)}
        @media(max-width:1024px){
          .eh-slide{height:700px}
          .eh-slide-heading{font-size:28px;padding-top:100px}
          .eh-slide-panel{bottom:140px}
          .eh-slide-title{font-size:28px}
          .eh-slide-desc{font-size:18px}
        }
        @media(max-width:768px){
          .eh-slide{height:600px}
          .eh-slide-heading{font-size:24px;padding-top:80px}
          .eh-slide-panel{bottom:120px}
          .eh-slide-title{font-size:24px}
          .eh-slide-desc{font-size:16px}
        }
        @media(max-width:480px){
          .eh-slide{height:500px}
          .eh-slide-heading{font-size:24px;padding-top:60px}
          .eh-slide-sub{padding:0 24px;font-size:13px}
          .eh-slide-panel{bottom:100px;padding:0 24px}
          .eh-slide-title{font-size:24px}
          .eh-slide-desc{font-size:16px}
        }
      `}</style>
    </section>
  );
}
