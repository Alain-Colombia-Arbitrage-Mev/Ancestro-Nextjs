'use client';
import { useEffect } from 'react';
import { t } from '@/i18n/translations';
import { Ic } from '@/components/dashboard/shared';
import type { OnboardingState } from '../CustomerOnboardingWizard';

interface Props {
  lang: string;
  data: OnboardingState;
  update: (patch: Partial<OnboardingState>) => void;
}

interface Pkg { id: string; name: string; kw: number; price: number; weeks: number; bestFor: string; recommended?: boolean }

function recommendKw(monthly?: number): number {
  if (!monthly) return 6.0;
  // Roughly 4 sun-hours/day average * 30 days = 120 kWh per kW installed
  return Math.round((monthly / 120) * 10) / 10;
}

export function Step3SystemSizing({ lang, data, update }: Props) {
  const recommended = recommendKw(data.monthlyKwh);
  const packages: Pkg[] = [
    { id: 'starter', name: t(lang, 'onb.cust.sizing.pkg.starter'), kw: Math.max(3, recommended - 2), price: 12500, weeks: 2, bestFor: t(lang, 'onb.cust.sizing.pkg.starterFit') },
    { id: 'pro',     name: t(lang, 'onb.cust.sizing.pkg.pro'),     kw: recommended,                   price: 24500, weeks: 3, bestFor: t(lang, 'onb.cust.sizing.pkg.proFit'),     recommended: true },
    { id: 'plus',    name: t(lang, 'onb.cust.sizing.pkg.plus'),    kw: recommended + 2.4,             price: 36800, weeks: 4, bestFor: t(lang, 'onb.cust.sizing.pkg.plusFit') },
  ];

  useEffect(() => {
    if (data.systemSizeKw == null) update({ systemSizeKw: recommended });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="onb-callout">
        <Ic n="trending-up" s={14} c="#02C076" />
        {t(lang, 'onb.cust.sizing.callout')}
      </div>

      {packages.map((p) => {
        const active = Math.abs((data.systemSizeKw ?? 0) - p.kw) < 0.05;
        return (
          <button
            key={p.id}
            type="button"
            className={`onb-card ${active ? 'is-active' : ''}`}
            onClick={() => update({ systemSizeKw: p.kw })}
            style={{
              textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
              flexDirection: 'column', alignItems: 'stretch', gap: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%' }}>
              <div className="onb-card-icon" style={{ background: p.recommended ? '#FBBF2420' : '#FFFFFF06', borderColor: p.recommended ? '#F59E0B40' : '#FFFFFF0A' }}>
                <Ic n="sun" s={20} c={p.recommended ? '#F59E0B' : '#A1A1AA'} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ color: '#F5F3FF', fontSize: 18, fontWeight: 800 }}>
                  {p.kw.toFixed(1)} kW · {p.name}
                </span>
                <span style={{ color: '#848E9C', fontSize: 12 }}>{p.bestFor}</span>
              </div>
              {p.recommended && (
                <span style={{ padding: '4px 10px', borderRadius: 999, background: '#02C07618', border: '1px solid #02C07640', color: '#02C076', fontSize: 10, fontWeight: 800, letterSpacing: 0.5 }}>
                  {t(lang, 'onb.cust.sizing.recommended').toUpperCase()}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px dashed #1A1A1A' }}>
              <span style={{ color: '#F5F3FF', fontSize: 22, fontWeight: 800, letterSpacing: -0.3 }}>
                ${p.price.toLocaleString('en-US')}
              </span>
              <span style={{ color: '#5E6673', fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Ic n="clock" s={12} c="#5E6673" />
                {t(lang, 'onb.cust.sizing.installIn')} {p.weeks} {t(lang, 'onb.cust.sizing.weeks')}
              </span>
            </div>
          </button>
        );
      })}
    </>
  );
}
