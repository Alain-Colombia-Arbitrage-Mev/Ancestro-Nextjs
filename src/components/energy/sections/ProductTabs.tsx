'use client';
import { useState } from 'react';
import { t } from '@/i18n/translations';
import { IMG } from '../EnergyHomePage';

const solarFeats = [
  { titleKey: 'energyHome.solarFeat.aesthetic.title', descKey: 'energyHome.solarFeat.aesthetic.desc' },
  { titleKey: 'energyHome.solarFeat.weather.title', descKey: 'energyHome.solarFeat.weather.desc' },
  { titleKey: 'energyHome.solarFeat.easy.title', descKey: 'energyHome.solarFeat.easy.desc' },
  { titleKey: 'energyHome.solarFeat.profile.title', descKey: 'energyHome.solarFeat.profile.desc' },
];
const batteryFeats = [
  { titleKey: 'energyHome.batteryFeat.noOutages.title', descKey: 'energyHome.batteryFeat.noOutages.desc' },
  { titleKey: 'energyHome.batteryFeat.peace.title', descKey: 'energyHome.batteryFeat.peace.desc' },
  { titleKey: 'energyHome.batteryFeat.easy.title', descKey: 'energyHome.batteryFeat.easy.desc' },
  { titleKey: 'energyHome.batteryFeat.weather.title', descKey: 'energyHome.batteryFeat.weather.desc' },
];

export default function ProductTabs({ lang }: { lang: string }) {
  const [tab, setTab] = useState<'solar'|'battery'>('solar');
  const feats = tab === 'solar' ? solarFeats : batteryFeats;

  return (
    <section className="eh-ptabs">
      <div className="eh-ptabs-inner">
        <div className="eh-ptabs-nav">
          <button type="button" className={`eh-ptab ${tab === 'solar' ? 'active' : ''}`} onClick={() => setTab('solar')}>{t(lang, 'energyHome.product.solar')}</button>
          <button type="button" className={`eh-ptab ${tab === 'battery' ? 'active' : ''}`} onClick={() => setTab('battery')}>{t(lang, 'energyHome.product.battery')}</button>
        </div>
        <div className="eh-ptabs-img">
          <img src={`${IMG}/${tab === 'solar' ? 'product-solar' : 'product-battery'}.webp`} alt="" />
        </div>
        <div className="eh-ptabs-feats">
          {feats.map((f, i) => (
            <div key={f.titleKey} className={`eh-ptabs-feat ${i === 0 ? 'active' : ''}`}>
              <h4 className="eh-ptabs-feat-t">{t(lang, f.titleKey)}</h4>
              <p className="eh-ptabs-feat-d">{t(lang, f.descKey)}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .eh-ptabs{padding:100px 40px}
        .eh-ptabs-inner{max-width:1280px;margin:0 auto}
        .eh-ptabs-nav{display:flex;justify-content:center;gap:10px;margin-bottom:30px}
        .eh-ptab{padding:12px 32px;min-height:44px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.1);border-radius:999px;color:rgba(255,255,255,.8);font-family:inherit;font-size:15px;font-weight:600;cursor:pointer;transition:all .25s}
        .eh-ptab:hover{background:rgba(255,255,255,.15);color:#fff}
        .eh-ptab.active{background:#f8b03b;border-color:#f8b03b;color:#000}
        .eh-ptabs-img{width:100%;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,.1);margin-bottom:26px;aspect-ratio:16/9}
        .eh-ptabs-img img{width:100%;height:100%;object-fit:cover;display:block}
        .eh-ptabs-feats{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;border-top:2px solid #424242;padding-top:24px}
        .eh-ptabs-feat{border-top:2px solid transparent;padding-top:10px;margin-top:-14px}
        .eh-ptabs-feat.active{border-top-color:#f8b03b}
        .eh-ptabs-feat-t{font-size:24px;font-weight:600;color:#a3a3a3;margin:0 0 15px}
        .eh-ptabs-feat.active .eh-ptabs-feat-t{color:#f8b03b}
        .eh-ptabs-feat-d{font-size:16px;font-weight:400;color:#a3a3a3;line-height:1.6;margin:0;max-width:300px}
        .eh-ptabs-feat.active .eh-ptabs-feat-d{color:#fff}
        @media(max-width:1024px){
          .eh-ptabs{padding:80px 40px}
          .eh-ptabs-feats{grid-template-columns:repeat(2,1fr)}
          .eh-ptabs-feat-t{font-size:20px}
          .eh-ptabs-feat-d{font-size:14px}
        }
        @media(max-width:768px){
          .eh-ptabs{padding:60px 40px}
          .eh-ptabs-feats{grid-template-columns:repeat(2,1fr)}
          .eh-ptabs-feat-t{font-size:20px}
          .eh-ptabs-feat-d{font-size:14px}
        }
        @media(max-width:480px){
          .eh-ptabs{padding:60px 24px}
          .eh-ptabs-feats{grid-template-columns:1fr}
          .eh-ptab{padding:10px 20px;font-size:13px}
          .eh-ptabs-feat-t{font-size:18px}
          .eh-ptabs-feat-d{font-size:14px}
        }
      `}</style>
    </section>
  );
}
