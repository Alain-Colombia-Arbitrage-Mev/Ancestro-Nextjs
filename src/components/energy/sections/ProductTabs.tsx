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
    </section>
  );
}
