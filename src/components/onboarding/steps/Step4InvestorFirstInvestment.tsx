'use client';
import { useMemo } from 'react';
import { t } from '@/i18n/translations';
import { Ic } from '@/components/dashboard/shared';
import type { InvestorOnboardingState } from '../InvestorOnboardingWizard';

interface Props {
  lang: string;
  data: InvestorOnboardingState;
  update: (patch: Partial<InvestorOnboardingState>) => void;
}

interface Project {
  id: string;
  name: string;
  type: 'Residential' | 'Electrolinera' | 'Commercial';
  city: string;
  size: string;
  irr: number;          // expected IRR %
  minStake: number;     // USD
  funded: number;       // 0..1
  tone: string;
}

const PROJECTS: Project[] = [
  { id: 'phx-9-6',  name: 'Phoenix · 9.6 kW residential', type: 'Residential',    city: 'Phoenix AZ',  size: '9.6 kW',   irr: 12.4, minStake: 500,  funded: 0.62, tone: '#F59E0B' },
  { id: 'cdmx-st4', name: 'CDMX · Station 04 expansion',  type: 'Electrolinera',  city: 'CDMX',        size: '3× 120kW', irr: 14.6, minStake: 1000, funded: 0.34, tone: '#02C076' },
  { id: 'bcs-roof', name: 'BCS · Commercial roof PPA',    type: 'Commercial',     city: 'Bogotá',      size: '120 kW',   irr: 13.6, minStake: 2500, funded: 0.78, tone: '#A78BFA' },
];

const PRESETS = [500, 1000, 2500, 5000, 10000];

export function Step4InvestorFirstInvestment({ lang, data, update }: Props) {
  const selected = useMemo(() => PROJECTS.find(p => p.id === data.firstProjectId), [data.firstProjectId]);

  return (
    <>
      <div className="onb-callout">
        <Ic n="zap" s={14} c="#02C076" />
        {t(lang, 'onb.inv.invest.callout')}
      </div>

      {PROJECTS.map((p) => {
        const active = data.firstProjectId === p.id;
        return (
          <button
            key={p.id}
            type="button"
            className={`onb-card ${active ? 'is-active' : ''}`}
            onClick={() => update({
              firstProjectId: p.id,
              firstAmount: Math.max(p.minStake, data.firstAmount ?? p.minStake),
            })}
            style={{ textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', flexDirection: 'column', alignItems: 'stretch', gap: 8 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div className="onb-card-icon" style={{ background: `${p.tone}18`, borderColor: `${p.tone}40` }}>
                <Ic n={p.type === 'Electrolinera' ? 'zap' : p.type === 'Commercial' ? 'briefcase' : 'home'} s={18} c={p.tone} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 800 }}>{p.name}</span>
                <span style={{ color: '#5E6673', fontSize: 11 }}>{p.size} · {p.city}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                <span style={{ color: p.tone, fontSize: 16, fontWeight: 800 }}>{p.irr}%</span>
                <span style={{ color: '#5E6673', fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>IRR</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, height: 5, borderRadius: 5, background: '#1A1A1A', overflow: 'hidden' }}>
                <div style={{ width: `${Math.round(p.funded * 100)}%`, height: '100%', background: p.tone }} />
              </div>
              <span style={{ color: '#848E9C', fontSize: 11 }}>
                {Math.round(p.funded * 100)}% {t(lang, 'onb.inv.invest.funded')}
              </span>
              <span style={{ color: '#5E6673', fontSize: 11 }}>
                {t(lang, 'onb.inv.invest.minStake')} ${p.minStake.toLocaleString('en-US')}
              </span>
            </div>
          </button>
        );
      })}

      {/* Stake input — shown once a project is selected */}
      {selected && (
        <div className="onb-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="onb-card-icon" style={{ background: '#FBBF2420', borderColor: '#F59E0B40' }}>
              <Ic n="dollar-sign" s={18} c="#F59E0B" />
            </div>
            <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 700, flex: 1 }}>
              {t(lang, 'onb.inv.invest.yourStake')}
            </span>
            <span style={{ color: '#F59E0B', fontSize: 16, fontWeight: 800 }}>
              ${(data.firstAmount ?? selected.minStake).toLocaleString('en-US')}
            </span>
          </div>
          <input
            type="range"
            min={selected.minStake}
            max={Math.max(selected.minStake * 20, 50000)}
            step={selected.minStake / 2}
            value={data.firstAmount ?? selected.minStake}
            onChange={(e) => update({ firstAmount: Number(e.target.value) })}
            style={{ width: '100%', accentColor: '#F59E0B' }}
          />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {PRESETS.filter(p => p >= selected.minStake).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => update({ firstAmount: p })}
                className="onb-btn-ghost"
                style={{
                  height: 28, padding: '0 10px', fontSize: 11, fontWeight: 700,
                  background: data.firstAmount === p ? '#F59E0B20' : 'transparent',
                  borderColor: data.firstAmount === p ? '#F59E0B' : '#1A1A1A',
                  color: data.firstAmount === p ? '#F59E0B' : '#A1A1AA',
                }}
              >
                ${p.toLocaleString('en-US')}
              </button>
            ))}
          </div>
          <div style={{
            padding: 10, borderRadius: 8,
            background: '#0A0A0A', border: '1px solid #1A1A1A',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ color: '#5E6673', fontSize: 11 }}>{t(lang, 'onb.inv.invest.estReturn')}</span>
            <span style={{ color: '#02C076', fontSize: 13, fontWeight: 800 }}>
              ${Math.round((data.firstAmount ?? selected.minStake) * (selected.irr / 100)).toLocaleString('en-US')} / {t(lang, 'onb.inv.invest.year')}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
