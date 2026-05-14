'use client';
import { t } from '@/i18n/translations';
import { Ic } from '@/components/dashboard/shared';
import type { OnboardingState } from '../CustomerOnboardingWizard';

interface Props {
  lang: string;
  data: OnboardingState;
  update: (patch: Partial<OnboardingState>) => void;
}

const PEAKS: Array<OnboardingState['peakUsage']> = ['morning', 'afternoon', 'evening', 'night'];

export function Step2EnergyUse({ lang, data, update }: Props) {
  return (
    <>
      <div className="onb-callout">
        <Ic n="trending-up" s={14} c="#02C076" />
        {t(lang, 'onb.cust.energy.callout')}
      </div>

      {/* Upload bills */}
      <div className="onb-card">
        <div className="onb-card-icon" style={{ background: '#F59E0B18', borderColor: '#F59E0B40' }}>
          <Ic n="upload" s={18} c="#F59E0B" />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 700 }}>
            {t(lang, 'onb.cust.energy.upload.title')}
          </span>
          <span style={{ color: '#5E6673', fontSize: 11 }}>
            {t(lang, 'onb.cust.energy.upload.sub')}
          </span>
        </div>
        <button
          className="onb-btn-ghost"
          style={{ height: 36, padding: '0 14px', fontSize: 12 }}
          onClick={() => update({ hasUtilityBills: true })}
        >
          {data.hasUtilityBills ? <><Ic n="check" s={12} c="#02C076" /> {t(lang, 'onb.cust.energy.uploaded')}</> : t(lang, 'onb.cust.energy.upload.cta')}
        </button>
      </div>

      {/* Manual kWh entry */}
      <div className={`onb-card ${typeof data.monthlyKwh === 'number' ? 'is-active' : ''}`}>
        <div className="onb-card-icon" style={{ background: '#02C07618', borderColor: '#02C07640' }}>
          <Ic n="zap" s={18} c="#02C076" />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 700 }}>
            {t(lang, 'onb.cust.energy.manual.title')}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="number"
              className="onb-input"
              placeholder="850"
              value={data.monthlyKwh ?? ''}
              onChange={(e) => update({ monthlyKwh: e.target.value ? Number(e.target.value) : undefined })}
              style={{ width: 120, height: 36 }}
            />
            <span style={{ color: '#848E9C', fontSize: 12, fontWeight: 600 }}>kWh / {t(lang, 'onb.cust.energy.month')}</span>
          </div>
        </div>
      </div>

      {/* Peak usage */}
      <div className="onb-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%' }}>
          <div className="onb-card-icon" style={{ background: '#A78BFA18', borderColor: '#A78BFA40' }}>
            <Ic n="clock" s={18} c="#A78BFA" />
          </div>
          <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 700, flex: 1 }}>
            {t(lang, 'onb.cust.energy.peak.title')}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, width: '100%' }}>
          {PEAKS.map((p) => {
            const active = data.peakUsage === p;
            return (
              <button
                key={p}
                className="onb-btn-ghost"
                onClick={() => update({ peakUsage: p })}
                style={{
                  height: 36, padding: '0 8px', fontSize: 11, fontWeight: 700,
                  background: active ? '#A78BFA20' : 'transparent',
                  border: `1px solid ${active ? '#A78BFA' : '#1A1A1A'}`,
                  color: active ? '#A78BFA' : '#A1A1AA',
                }}
              >
                {t(lang, `onb.cust.energy.peak.${p}`)}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
