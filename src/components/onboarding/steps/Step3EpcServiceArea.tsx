'use client';
import { useState } from 'react';
import { t } from '@/i18n/translations';
import { Ic } from '@/components/dashboard/shared';
import type { EpcOnboardingState } from '../EpcOnboardingWizard';

interface Props {
  lang: string;
  data: EpcOnboardingState;
  update: (patch: Partial<EpcOnboardingState>) => void;
}

export function Step3EpcServiceArea({ lang, data, update }: Props) {
  const [zip, setZip] = useState('');

  const addZip = () => {
    const v = zip.trim();
    if (!v) return;
    if ((data.zipCodes || []).includes(v)) return;
    update({ zipCodes: [...(data.zipCodes || []), v] });
    setZip('');
  };
  const removeZip = (z: string) => update({ zipCodes: (data.zipCodes || []).filter(x => x !== z) });

  return (
    <>
      <div className="onb-callout">
        <Ic n="map" s={14} c="#02C076" />
        {t(lang, 'onb.epc.area.callout')}
      </div>

      {/* Center city */}
      <div className="onb-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="onb-card-icon" style={{ background: '#F59E0B18', borderColor: '#F59E0B40' }}>
            <Ic n="map" s={18} c="#F59E0B" />
          </div>
          <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 700, flex: 1 }}>
            {t(lang, 'onb.epc.area.centerLabel')}
          </span>
        </div>
        <input
          type="text"
          className="onb-input"
          placeholder={t(lang, 'onb.epc.area.centerPh')}
          value={data.serviceCenter || ''}
          onChange={(e) => update({ serviceCenter: e.target.value })}
        />
      </div>

      {/* Radius */}
      <div className="onb-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="onb-card-icon" style={{ background: '#02C07618', borderColor: '#02C07640' }}>
            <Ic n="trending-up" s={18} c="#02C076" />
          </div>
          <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 700, flex: 1 }}>
            {t(lang, 'onb.epc.area.radiusLabel')}
          </span>
          <span style={{ color: '#02C076', fontSize: 14, fontWeight: 800 }}>
            {data.serviceRadiusKm ?? 25} km
          </span>
        </div>
        <input
          type="range"
          min={5} max={200} step={5}
          value={data.serviceRadiusKm ?? 25}
          onChange={(e) => update({ serviceRadiusKm: Number(e.target.value) })}
          style={{ width: '100%', accentColor: '#02C076' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#5E6673', fontSize: 10 }}>
          <span>5 km</span><span>50 km</span><span>100 km</span><span>200 km</span>
        </div>
      </div>

      {/* ZIPs */}
      <div className="onb-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="onb-card-icon" style={{ background: '#A78BFA18', borderColor: '#A78BFA40' }}>
            <Ic n="hardhat" s={18} c="#A78BFA" />
          </div>
          <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 700, flex: 1 }}>
            {t(lang, 'onb.epc.area.zipsLabel')}
          </span>
          <span style={{ color: '#848E9C', fontSize: 11 }}>
            {(data.zipCodes || []).length} {t(lang, 'onb.epc.area.zipsAdded')}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            className="onb-input"
            placeholder={t(lang, 'onb.epc.area.zipPh')}
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addZip())}
            style={{ flex: 1 }}
          />
          <button type="button" className="onb-btn-ghost" onClick={addZip} style={{ height: 44, padding: '0 14px', fontSize: 12 }}>
            <Ic n="plus" s={12} /> {t(lang, 'onb.epc.area.add')}
          </button>
        </div>
        {!!data.zipCodes?.length && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {data.zipCodes.map(z => (
              <span key={z} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '4px 10px', borderRadius: 999,
                background: '#A78BFA18', border: '1px solid #A78BFA40',
                color: '#A78BFA', fontSize: 11, fontWeight: 700,
              }}>
                {z}
                <button type="button" onClick={() => removeZip(z)} style={{ background: 'transparent', border: 'none', color: '#A78BFA', cursor: 'pointer', padding: 0, display: 'flex' }}>
                  <Ic n="check" s={10} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
