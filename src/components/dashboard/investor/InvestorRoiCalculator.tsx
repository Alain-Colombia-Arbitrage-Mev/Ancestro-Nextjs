'use client';
import { useMemo, useState } from 'react';
import { t } from '@/i18n/translations';
import { Ic, goldGrad } from '../shared';
import { UserMenu } from '../UserMenu';
import { InvestorSidePanel } from './InvestorSidePanel';
import { InvestorProjectsList, type InvestorProjectRow } from './InvestorProjectsList';

interface Props { lang: string; user: { name: string; email: string } }

interface RoiInputs {
  amount: number;       // USD invested
  irr: number;          // expected annual IRR % (decimal points)
  horizonYears: number; // years
}

/**
 * Investor return model — periodic-distribution, principal-returned-at-end.
 *
 * Renewable-infrastructure investments distribute cash yearly and return
 * principal at the asset's residual sale or refinance. We DO NOT assume
 * reinvestment (compound), because each distribution becomes the investor's
 * choice to redeploy. Numbers stay honest.
 */
function compute({ amount, irr, horizonYears }: RoiInputs) {
  const r = irr / 100;
  const annual = amount * r;                              // yearly distribution
  const payback = r > 0 ? +(1 / r).toFixed(1) : 0;        // years to recoup capital from distributions alone
  const totalDistributions = annual * horizonYears;       // cumulative cash from project
  const totalCashBack = amount + totalDistributions;      // distributions + principal returned at end
  const profit = totalDistributions;                      // net gain (principal is just returned)
  const moic = totalCashBack / amount;                    // multiple of invested capital
  return { annual, payback, totalDistributions, totalCashBack, profit, moic };
}

const PRESETS = [1000, 2500, 5000, 10000, 25000];

export default function InvestorRoiCalculator({ lang, user }: Props) {
  const firstName = (user.name || user.email).split(/\s+|@/)[0];
  const [inputs, setInputs] = useState<RoiInputs>({ amount: 5000, irr: 13.5, horizonYears: 7 });
  const r = useMemo(() => compute(inputs), [inputs]);

  const tiles = [
    { tone: '#F59E0B' as const, label: t(lang, 'inv.roi.yourInvest'),  value: `$${inputs.amount.toLocaleString('en-US')}`,                                       sub: `${inputs.horizonYears} ${t(lang, 'inv.roi.horizonShort')}`, icon: 'dollar-sign' as const },
    { tone: '#02C076' as const, label: t(lang, 'inv.roi.annualReturn'),value: `$${Math.round(r.annual).toLocaleString('en-US')}`,                              sub: `${inputs.irr.toFixed(1)}% IRR`,                            icon: 'trending-up' as const },
    { tone: '#A78BFA' as const, label: t(lang, 'inv.roi.paybackTime'), value: `${r.payback} ${t(lang, 'inv.roi.horizonShort')}`,                              sub: t(lang, 'inv.roi.paybackSub'),                              icon: 'clock' as const },
    { tone: '#FBBF24' as const, label: t(lang, 'inv.roi.cashBack'),    value: `$${Math.round(r.totalCashBack).toLocaleString('en-US')}`,                      sub: `${r.moic.toFixed(2)}x MOIC · +$${Math.round(r.profit).toLocaleString('en-US')} ${t(lang, 'inv.roi.profitShort')}`, icon: 'star' as const },
  ];

  const projects: InvestorProjectRow[] = [
    { time: '10:30', period: 'AM', tag: 'IN PROGRESS', customer: 'Veronica Hernandez', system: '9.6 kW Pro',     addr: '1240 Maple Avenue, Phoenix AZ', amount: '$5,400 stake', active: true },
    { time: '2:00',  period: 'PM', tag: 'UPCOMING',    customer: 'Carlos Méndez',      system: '13.5 kW Max + Battery', addr: '88 Brickell, Miami FL', amount: '$8,200 stake' },
    { time: 'Tue',                tag: 'UPCOMING',    customer: 'Sofia Ruiz',          system: 'Pre-install assessment', addr: '405 Olive Ave, Austin TX' },
  ];

  return (
    <>
      <div className="dash-header dash-fade">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#F59E0B', fontSize: 11, fontWeight: 800, letterSpacing: 1.5 }}>ROI CALCULATOR</span>
          <h1 style={{ color: '#F5F3FF', fontSize: 32, fontWeight: 800, letterSpacing: -0.5, margin: 0 }}>
            {t(lang, 'inv.roi.title')}
          </h1>
          <span style={{ color: '#5E6673', fontSize: 13 }}>{t(lang, 'inv.roi.subtitle')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <UserMenu lang={lang} />
        </div>
      </div>

      {/* Inputs row */}
      <div className="dash-card dash-fade-1" style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 20, background: '#0E0E10', border: '1px solid #1A1A1A', borderRadius: 16 }}>
        <span style={{ color: '#5E6673', fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase' }}>{t(lang, 'inv.roi.inputs')}</span>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ color: '#848E9C', fontSize: 11, fontWeight: 600 }}>{t(lang, 'inv.roi.amount')}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="range"
                min={500} max={50000} step={500}
                value={inputs.amount}
                onChange={(e) => setInputs(s => ({ ...s, amount: Number(e.target.value) }))}
                style={{ flex: 1 }}
              />
              <span style={{ color: '#F5F3FF', fontWeight: 700, fontSize: 13, width: 80, textAlign: 'right' }}>
                ${inputs.amount.toLocaleString('en-US')}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {PRESETS.map(p => (
                <button key={p} className="dash-btn" onClick={() => setInputs(s => ({ ...s, amount: p }))}
                  style={{
                    height: 22, padding: '0 8px', borderRadius: 6,
                    background: inputs.amount === p ? '#F59E0B' : '#0A0A0A',
                    border: '1px solid', borderColor: inputs.amount === p ? '#F59E0B' : '#1A1A1A',
                    color: inputs.amount === p ? '#0A0617' : '#848E9C',
                    fontSize: 10, fontWeight: 700, fontFamily: 'inherit',
                  }}>${(p / 1000)}k</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ color: '#848E9C', fontSize: 11, fontWeight: 600 }}>{t(lang, 'inv.roi.irr')}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="range"
                min={10} max={18} step={0.1}
                value={inputs.irr}
                onChange={(e) => setInputs(s => ({ ...s, irr: Number(e.target.value) }))}
                style={{ flex: 1 }}
              />
              <span style={{ color: '#F5F3FF', fontWeight: 700, fontSize: 13, width: 80, textAlign: 'right' }}>
                {inputs.irr.toFixed(1)}%
              </span>
            </div>
            <span style={{ color: '#5E6673', fontSize: 10 }}>{t(lang, 'inv.roi.irrHint')}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ color: '#848E9C', fontSize: 11, fontWeight: 600 }}>{t(lang, 'inv.roi.horizon')}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="range"
                min={1} max={20} step={0.5}
                value={inputs.horizonYears}
                onChange={(e) => setInputs(s => ({ ...s, horizonYears: Number(e.target.value) }))}
                style={{ flex: 1 }}
              />
              <span style={{ color: '#F5F3FF', fontWeight: 700, fontSize: 13, width: 80, textAlign: 'right' }}>
                {inputs.horizonYears.toFixed(1)} yr
              </span>
            </div>
            <span style={{ color: '#5E6673', fontSize: 10 }}>{t(lang, 'inv.roi.horizonHint')}</span>
          </div>
        </div>
      </div>

      <div className="dash-grid-4col dash-fade-2">
        {tiles.map((k, i) => (
          <div key={i} className="dash-card" style={{
            display: 'flex', flexDirection: 'column', gap: 8, padding: 20,
            background: '#0E0E10', border: `1px solid ${k.tone}40`, borderRadius: 16,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#5E6673', fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase' }}>{k.label}</span>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `${k.tone}18`, border: `1px solid ${k.tone}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ic n={k.icon} s={14} c={k.tone} />
              </div>
            </div>
            <span style={{ color: '#F5F3FF', fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>{k.value}</span>
            <span style={{ color: k.tone, fontSize: 11, fontWeight: 600 }}>{k.sub}</span>
          </div>
        ))}
      </div>

      <div className="dash-grid-hero">
        <InvestorProjectsList lang={lang} rows={projects} title={t(lang, 'inv.roi.eligible')} />
        <InvestorSidePanel lang={lang} mapTitle={t(lang, 'inv.roi.opportunities')} />
      </div>
    </>
  );
}
