'use client';
import { useState } from 'react';
import { t } from '@/i18n/translations';
import { imgUrl } from '../cdn';

const solarFeats = [
  { titleKey: 'energyHome.solarFeat.aesthetic.title', descKey: 'energyHome.solarFeat.aesthetic.desc', img: 'solar-aesthetic' },
  { titleKey: 'energyHome.solarFeat.weather.title',   descKey: 'energyHome.solarFeat.weather.desc',   img: 'solar-weather'   },
  { titleKey: 'energyHome.solarFeat.easy.title',      descKey: 'energyHome.solarFeat.easy.desc',      img: 'solar-easy'      },
  { titleKey: 'energyHome.solarFeat.profile.title',   descKey: 'energyHome.solarFeat.profile.desc',   img: 'solar-profile'   },
];
const batteryFeats = [
  { titleKey: 'energyHome.batteryFeat.noOutages.title', descKey: 'energyHome.batteryFeat.noOutages.desc', img: 'battery-noOutages' },
  { titleKey: 'energyHome.batteryFeat.peace.title',     descKey: 'energyHome.batteryFeat.peace.desc',     img: 'battery-peace'     },
  { titleKey: 'energyHome.batteryFeat.easy.title',      descKey: 'energyHome.batteryFeat.easy.desc',      img: 'battery-easy'      },
  { titleKey: 'energyHome.batteryFeat.weather.title',   descKey: 'energyHome.batteryFeat.weather.desc',   img: 'battery-weather'   },
];

export default function ProductTabs({ lang }: { lang: string }) {
  const [tab, setTab] = useState<'solar' | 'battery'>('solar');
  const [activeFeat, setActiveFeat] = useState(0);
  const feats = tab === 'solar' ? solarFeats : batteryFeats;
  const active = feats[activeFeat];

  const switchTab = (next: 'solar' | 'battery') => {
    setTab(next);
    setActiveFeat(0);
  };

  return (
    <section className="eh-ptabs">
      <div className="eh-ptabs-inner">
        <div className="eh-ptabs-nav">
          <button type="button" className={`eh-ptab ${tab === 'solar' ? 'active' : ''}`} onClick={() => switchTab('solar')}>{t(lang, 'energyHome.product.solar')}</button>
          <button type="button" className={`eh-ptab ${tab === 'battery' ? 'active' : ''}`} onClick={() => switchTab('battery')}>{t(lang, 'energyHome.product.battery')}</button>
        </div>
        <div className="eh-ptabs-img">
          <img src={imgUrl(`${active.img}.webp`)} alt={t(lang, active.titleKey)} />
        </div>
        <div className="eh-ptabs-feats">
          {feats.map((f, i) => (
            <button
              key={f.titleKey}
              type="button"
              className={`eh-ptabs-feat ${i === activeFeat ? 'active' : ''}`}
              onClick={() => setActiveFeat(i)}
              aria-pressed={i === activeFeat}
            >
              <h4 className="eh-ptabs-feat-t">{t(lang, f.titleKey)}</h4>
              <p className="eh-ptabs-feat-d">{t(lang, f.descKey)}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
