'use client';
import { t } from '@/i18n/translations';
import { Ic } from '../shared';
import { UserMenu } from '../UserMenu';
import { demoInvestorOpportunities } from '@/lib/demoData';

export default function InvestorOpportunitiesView({ lang }: { lang: string }) {
  const opps = demoInvestorOpportunities;

  return (
    <>
      <div className="dash-header dash-fade">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#A1A1A6', fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>
            {t(lang, 'inv.opp.kicker')}
          </span>
          <h1 style={{ color: '#EDEDEE', fontSize: 28, fontWeight: 600, letterSpacing: -0.2, margin: 0 }}>
            {t(lang, 'inv.opp.title')}
          </h1>
          <span style={{ color: '#A1A1A6', fontSize: 13 }}>{opps.length} {t(lang, 'inv.opp.openRounds')} · {t(lang, 'inv.opp.range')} 12–15% IRR</span>
        </div>
        <UserMenu lang={lang} />
      </div>

      <div className="dash-grid-2col dash-fade-1">
        {opps.map(o => {
          const daysLeft = Math.max(0, Math.ceil((new Date(o.deadline).getTime() - Date.now()) / 86_400_000));
          const remaining = Math.round(o.totalRaise * (1 - o.funded));
          return (
            <div key={o.id} className="dash-card" style={{
              display: 'flex', flexDirection: 'column', gap: 12, padding: 18,
              background: '#101013', border: '1px solid #1F1F23', borderRadius: 8,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                  <span style={{ color: '#EDEDEE', fontSize: 14, fontWeight: 600 }}>{o.name}</span>
                  <span style={{ color: '#A1A1A6', fontSize: 11 }}>{o.size} · {o.city}</span>
                </div>
                <span style={{
                  padding: '2px 8px', borderRadius: 4,
                  background: '#F59E0B14', border: '1px solid #F59E0B33',
                  color: '#F59E0B', fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', whiteSpace: 'nowrap',
                }}>{o.type}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                <Mini label={t(lang, 'inv.opp.irr')}     value={`${o.irr}%`} accent="#2BB673" />
                <Mini label={t(lang, 'inv.opp.horizon')} value={`${o.horizonYears} ${t(lang, 'inv.roi.horizonShort')}`} />
                <Mini label={t(lang, 'inv.opp.minStake')} value={`$${o.minStake.toLocaleString('en-US')}`} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ height: 6, background: '#0A0A0B', border: '1px solid #1F1F23', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.round(o.funded * 100)}%`, background: '#F59E0B' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A1A1A6', fontSize: 11 }}>
                  <span>{Math.round(o.funded * 100)}% {t(lang, 'inv.opp.funded')}</span>
                  <span>${remaining.toLocaleString('en-US')} {t(lang, 'inv.opp.remaining')}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 }}>
                <span style={{ color: daysLeft <= 7 ? '#F59E0B' : '#A1A1A6', fontSize: 11, fontWeight: 600 }}>
                  <Ic n="clock" s={12} /> {daysLeft} {t(lang, 'inv.opp.daysLeft')}
                </span>
                <button className="dash-btn" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  height: 32, padding: '0 14px',
                  background: '#F59E0B', border: '1px solid #F59E0B', borderRadius: 8,
                  color: '#0A0617', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}>
                  {t(lang, 'inv.opp.invest')} <Ic n="arrow-right" s={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function Mini({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div style={{
      padding: '8px 10px', borderRadius: 6,
      background: '#0A0A0B', border: '1px solid #1F1F23',
      display: 'flex', flexDirection: 'column', gap: 2,
    }}>
      <span style={{ color: '#A1A1A6', fontSize: 10, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>{label}</span>
      <span style={{ color: accent || '#EDEDEE', fontSize: 14, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  );
}
