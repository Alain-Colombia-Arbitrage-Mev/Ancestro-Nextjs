'use client';
import { t } from '@/i18n/translations';
import { Ic } from '@/components/dashboard/shared';
import type { OnboardingState } from '../CustomerOnboardingWizard';

interface Props {
  lang: string;
  data: OnboardingState;
  update: (patch: Partial<OnboardingState>) => void;
}

export function Step1Location({ lang, data, update }: Props) {
  return (
    <>
      <div className="onb-callout">
        <Ic n="map" s={14} c="#02C076" />
        {t(lang, 'onb.cust.location.callout')}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span style={{ color: '#5E6673', fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase' }}>
          {t(lang, 'onb.cust.location.addressLabel')}
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            className="onb-input"
            placeholder={t(lang, 'onb.cust.location.addressPlaceholder')}
            value={data.address || ''}
            onChange={(e) => update({ address: e.target.value })}
            style={{ flex: 1 }}
          />
          <button className="onb-btn-ghost" style={{ height: 44, padding: '0 14px', fontSize: 12 }}>
            <Ic n="map" s={14} /> {t(lang, 'onb.cust.location.useGps')}
          </button>
        </div>
      </div>

      {/* Map placeholder — to be replaced with a real map (Leaflet/Mapbox). */}
      <div style={{
        position: 'relative', height: 260, borderRadius: 14, overflow: 'hidden',
        background: 'linear-gradient(135deg, #1A2E1A 0%, #0E1E0E 50%, #0A0A0A 100%)',
        border: '1px solid #1A1A1A',
      }}>
        <div style={{ position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(2,192,118,0.15), transparent 60%), radial-gradient(circle at 70% 70%, rgba(245,158,11,0.10), transparent 60%)',
        }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.75))' }}>
          <span style={{ color: '#F5F3FF', fontSize: 12, fontWeight: 600 }}>
            {data.address || t(lang, 'onb.cust.location.dropPin')}
          </span>
          <span style={{ color: '#02C076', fontSize: 11, fontWeight: 700 }}>
            <Ic n="check" s={12} c="#02C076" /> {t(lang, 'onb.cust.location.precise')}
          </span>
        </div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <Ic n="map" s={32} c="#F59E0B" />
          <span style={{ background: '#0A0A0A', color: '#F5F3FF', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6, border: '1px solid #1A1A1A' }}>
            {t(lang, 'onb.cust.location.dragToAdjust')}
          </span>
        </div>
      </div>

      {/* Quick stats once the address is picked */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {[
          { v: '3.6', u: 'kW·m²', l: 'irradiance' },
          { v: '13°', u: '/year', l: 'roof tilt' },
          { v: '9/12', u: 'months', l: 'sun' },
          { v: '72 m²', u: '', l: 'roof area' },
        ].map((s, i) => (
          <div key={i} style={{
            padding: 12, background: '#0E0E10', border: '1px solid #1A1A1A', borderRadius: 10,
            display: 'flex', flexDirection: 'column', gap: 2,
          }}>
            <span style={{ color: '#F5F3FF', fontSize: 16, fontWeight: 800 }}>{s.v}<span style={{ color: '#848E9C', fontSize: 10, marginLeft: 4 }}>{s.u}</span></span>
            <span style={{ color: '#5E6673', fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase' }}>{s.l}</span>
          </div>
        ))}
      </div>
    </>
  );
}
