'use client';
import { t } from '@/i18n/translations';
import { Ic } from '@/components/dashboard/shared';
import type { InvestorOnboardingState, RiskProfile, Sector } from '../InvestorOnboardingWizard';

interface Props {
  lang: string;
  data: InvestorOnboardingState;
  update: (patch: Partial<InvestorOnboardingState>) => void;
}

const PROFILES: { id: RiskProfile; titleKey: string; subKey: string; irr: string; tone: string }[] = [
  { id: 'conservative', titleKey: 'onb.inv.risk.conservative.title', subKey: 'onb.inv.risk.conservative.sub', irr: '12–13%', tone: '#02C076' },
  { id: 'balanced',     titleKey: 'onb.inv.risk.balanced.title',     subKey: 'onb.inv.risk.balanced.sub',     irr: '13–14%', tone: '#F59E0B' },
  { id: 'aggressive',   titleKey: 'onb.inv.risk.aggressive.title',   subKey: 'onb.inv.risk.aggressive.sub',   irr: '14–15%', tone: '#A78BFA' },
];

const SECTORS: { id: Sector; icon: 'home' | 'zap' | 'briefcase'; labelKey: string }[] = [
  { id: 'residential',    icon: 'home',      labelKey: 'onb.inv.risk.sector.residential' },
  { id: 'electrolineras', icon: 'zap',       labelKey: 'onb.inv.risk.sector.electrolineras' },
  { id: 'commercial',     icon: 'briefcase', labelKey: 'onb.inv.risk.sector.commercial' },
];

export function Step2InvestorRisk({ lang, data, update }: Props) {
  const toggleSector = (s: Sector) => {
    const cur = new Set(data.sectors || []);
    if (cur.has(s)) cur.delete(s); else cur.add(s);
    update({ sectors: Array.from(cur) });
  };

  return (
    <>
      <div className="onb-callout">
        <Ic n="trending-up" s={14} c="#02C076" />
        {t(lang, 'onb.inv.risk.callout')}
      </div>

      <span style={{ color: '#5E6673', fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase' }}>
        {t(lang, 'onb.inv.risk.profileLabel')}
      </span>
      {PROFILES.map((p) => {
        const active = data.riskProfile === p.id;
        return (
          <button
            key={p.id}
            type="button"
            className={`onb-card ${active ? 'is-active' : ''}`}
            onClick={() => update({ riskProfile: p.id })}
            style={{ textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
              <div className="onb-card-icon" style={{ background: `${p.tone}18`, borderColor: `${p.tone}40` }}>
                <Ic n="percent" s={18} c={p.tone} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 800 }}>{t(lang, p.titleKey)}</span>
                <span style={{ color: '#5E6673', fontSize: 11 }}>{t(lang, p.subKey)}</span>
              </div>
            </div>
            <span style={{ color: p.tone, fontSize: 13, fontWeight: 800 }}>{p.irr} IRR</span>
          </button>
        );
      })}

      {/* Horizon */}
      <div className="onb-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="onb-card-icon" style={{ background: '#F59E0B18', borderColor: '#F59E0B40' }}>
            <Ic n="clock" s={18} c="#F59E0B" />
          </div>
          <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 700, flex: 1 }}>
            {t(lang, 'onb.inv.risk.horizon')}
          </span>
          <span style={{ color: '#F59E0B', fontSize: 14, fontWeight: 800 }}>
            {data.horizonYears ?? 5} {t(lang, 'onb.inv.risk.years')}
          </span>
        </div>
        <input
          type="range"
          min={1} max={20} step={1}
          value={data.horizonYears ?? 5}
          onChange={(e) => update({ horizonYears: Number(e.target.value) })}
          style={{ width: '100%', accentColor: '#F59E0B' }}
        />
      </div>

      {/* Sectors */}
      <div className="onb-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="onb-card-icon" style={{ background: '#A78BFA18', borderColor: '#A78BFA40' }}>
            <Ic n="briefcase" s={18} c="#A78BFA" />
          </div>
          <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 700, flex: 1 }}>
            {t(lang, 'onb.inv.risk.sectors')}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {SECTORS.map((s) => {
            const active = data.sectors?.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleSector(s.id)}
                className="onb-btn-ghost"
                style={{
                  height: 56, flexDirection: 'column', gap: 4, padding: '0 6px', fontSize: 11,
                  background: active ? '#A78BFA20' : 'transparent',
                  border: `1px solid ${active ? '#A78BFA' : '#1A1A1A'}`,
                  color: active ? '#A78BFA' : '#A1A1AA',
                  fontWeight: 700,
                }}
              >
                <Ic n={s.icon} s={16} />
                {t(lang, s.labelKey)}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
