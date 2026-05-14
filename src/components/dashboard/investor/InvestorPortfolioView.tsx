'use client';
import { t } from '@/i18n/translations';
import { Ic } from '../shared';
import { UserMenu } from '../UserMenu';
import { demoInvestorPortfolio } from '@/lib/demoData';

const STATUS_TONES: Record<string, { bg: string; fg: string }> = {
  active:    { bg: '#2BB67318', fg: '#2BB673' },
  funding:   { bg: '#F59E0B18', fg: '#F59E0B' },
  completed: { bg: '#A78BFA18', fg: '#A78BFA' },
};

export default function InvestorPortfolioView({ lang }: { lang: string }) {
  const holdings = demoInvestorPortfolio;
  const totalStake     = holdings.reduce((s, h) => s + h.stake, 0);
  const monthlyIncome  = holdings.reduce((s, h) => s + h.monthly, 0);
  const activeCount    = holdings.filter(h => h.status === 'active').length;
  const avgIrr = +(holdings.filter(h => h.status === 'active').reduce((s, h) => s + h.irr, 0) /
                   Math.max(holdings.filter(h => h.status === 'active').length, 1)).toFixed(1);

  return (
    <>
      <div className="dash-header dash-fade">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#A1A1A6', fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>
            {t(lang, 'inv.portfolio.kicker')}
          </span>
          <h1 style={{ color: '#EDEDEE', fontSize: 28, fontWeight: 600, letterSpacing: -0.2, margin: 0 }}>
            {t(lang, 'inv.portfolio.title')}
          </h1>
          <span style={{ color: '#A1A1A6', fontSize: 13 }}>{holdings.length} {t(lang, 'inv.portfolio.holdings')}</span>
        </div>
        <UserMenu lang={lang} />
      </div>

      <div className="dash-grid-4col dash-fade-1">
        <Kpi label={t(lang, 'inv.portfolio.totalStake')} value={`$${totalStake.toLocaleString('en-US')}`} sub={`${activeCount} ${t(lang, 'inv.portfolio.acrossProjects')}`} accent="#F59E0B" />
        <Kpi label={t(lang, 'inv.portfolio.monthlyIncome')} value={`$${monthlyIncome.toLocaleString('en-US')}`} sub={t(lang, 'inv.portfolio.cashflowSub')} accent="#2BB673" />
        <Kpi label={t(lang, 'inv.portfolio.avgIrr')} value={`${avgIrr}%`} sub={t(lang, 'inv.portfolio.activeOnly')} accent="#A78BFA" />
        <Kpi label={t(lang, 'inv.portfolio.activeProjects')} value={String(activeCount)} sub={`${holdings.filter(h => h.status === 'funding').length} ${t(lang, 'inv.portfolio.funding')}`} accent="#FBBF24" />
      </div>

      <div className="dash-card dash-fade-2" style={{ background: '#101013', border: '1px solid #1F1F23', borderRadius: 8, padding: 0, overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1.6fr 1fr 80px 100px 90px 120px',
          gap: 8, padding: '12px 16px', borderBottom: '1px solid #1F1F23',
          color: '#A1A1A6', fontSize: 10, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase',
        }}>
          <span>{t(lang, 'inv.portfolio.col.project')}</span>
          <span>{t(lang, 'inv.portfolio.col.location')}</span>
          <span style={{ textAlign: 'right' }}>{t(lang, 'inv.portfolio.col.irr')}</span>
          <span style={{ textAlign: 'right' }}>{t(lang, 'inv.portfolio.col.stake')}</span>
          <span style={{ textAlign: 'right' }}>{t(lang, 'inv.portfolio.col.monthly')}</span>
          <span style={{ textAlign: 'right' }}>{t(lang, 'inv.portfolio.col.status')}</span>
        </div>
        {holdings.map((h, i) => {
          const tone = STATUS_TONES[h.status];
          return (
            <div key={h.id} style={{
              display: 'grid', gridTemplateColumns: '1.6fr 1fr 80px 100px 90px 120px', gap: 8,
              padding: '14px 16px', alignItems: 'center',
              borderBottom: i < holdings.length - 1 ? '1px solid #16161A' : 'none',
            }}>
              <span style={{ color: '#EDEDEE', fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.name}</span>
              <span style={{ color: '#A1A1A6', fontSize: 12 }}>{h.city} · {h.size}</span>
              <span style={{ color: '#EDEDEE', fontSize: 13, fontWeight: 600, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{h.irr.toFixed(1)}%</span>
              <span style={{ color: '#EDEDEE', fontSize: 13, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>${h.stake.toLocaleString('en-US')}</span>
              <span style={{ color: '#A1A1A6', fontSize: 12, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                {h.monthly > 0 ? `$${h.monthly}` : '—'}
              </span>
              <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ padding: '2px 8px', borderRadius: 4, background: tone.bg, color: tone.fg, fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                  {t(lang, `inv.portfolio.status.${h.status}`)}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}

function Kpi({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: string }) {
  return (
    <div className="dash-card" style={{
      position: 'relative', display: 'flex', flexDirection: 'column', gap: 6, padding: 16,
      background: '#101013', border: '1px solid #1F1F23', borderRadius: 8, overflow: 'hidden',
    }}>
      <span aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: accent || '#F59E0B' }} />
      <span style={{ color: '#A1A1A6', fontSize: 10, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>{label}</span>
      <span style={{ color: '#EDEDEE', fontSize: 24, fontWeight: 600, letterSpacing: -0.2, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      <span style={{ color: '#A1A1A6', fontSize: 11 }}>{sub}</span>
    </div>
  );
}
