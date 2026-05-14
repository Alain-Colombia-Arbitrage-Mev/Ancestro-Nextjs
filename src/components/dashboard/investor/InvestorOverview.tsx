'use client';
import { t } from '@/i18n/translations';
import { Ic } from '../shared';
import { UserMenu } from '../UserMenu';
import { InvestorSidePanel } from './InvestorSidePanel';
import { InvestorProjectsList, type InvestorProjectRow } from './InvestorProjectsList';
import { demoInvestorPortfolio } from '@/lib/demoData';

interface Props { lang: string; user: { name: string; email: string } }

export default function InvestorOverview({ lang, user }: Props) {
  const firstName = (user.name || user.email).split(/\s+|@/)[0];

  const totalStake = demoInvestorPortfolio.reduce((s, h) => s + h.stake, 0);
  const monthlyIncome = demoInvestorPortfolio.reduce((s, h) => s + (h.monthly ?? 0), 0);
  const activeCount = demoInvestorPortfolio.filter(h => h.status === 'active').length;
  const avgIrr = +(
    demoInvestorPortfolio.reduce((s, h) => s + h.irr * h.stake, 0) /
    Math.max(1, demoInvestorPortfolio.reduce((s, h) => s + h.stake, 0))
  ).toFixed(1);

  // 12-month equity curve (synthetic — compounds monthly income with mild noise)
  const curve = Array.from({ length: 12 }, (_, i) => {
    const base = totalStake * 0.78 + (totalStake * 0.22 * (i / 11));
    const noise = Math.sin(i * 1.7) * (totalStake * 0.015);
    return base + noise;
  });
  const maxC = Math.max(...curve);
  const minC = Math.min(...curve);
  const sparkPath = curve
    .map((v, i) => {
      const x = (i / (curve.length - 1)) * 100;
      const y = 100 - ((v - minC) / (maxC - minC)) * 100;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
  const sparkArea = `${sparkPath} L100,100 L0,100 Z`;

  const projects: InvestorProjectRow[] = [
    { time: '10:30', period: 'AM', tag: 'IN PROGRESS', customer: 'Veronica Hernandez', system: '9.6 kW Pro',     addr: '1240 Maple Avenue, Phoenix AZ', amount: '$5,400 stake', active: true },
    { time: '2:00',  period: 'PM', tag: 'UPCOMING',    customer: 'Carlos Méndez',      system: '13.5 kW Max + Battery', addr: '88 Brickell, Miami FL', amount: '$8,200 stake' },
    { time: 'Tue',                tag: 'UPCOMING',    customer: 'Sofia Ruiz',          system: 'Pre-install assessment', addr: '405 Olive Ave, Austin TX' },
  ];

  const ytdReturn = monthlyIncome * 5; // already-distributed YTD (approx 5 months)

  return (
    <>
      <div className="dash-header dash-fade">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: 'var(--dash-text-2)', fontSize: 12, fontWeight: 500 }}>
            {t(lang, 'inv.welcome')} {firstName}
          </span>
          <h1 style={{ color: 'var(--dash-text)', fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>
            {t(lang, 'inv.portfolioValue')}
          </h1>
        </div>
        <UserMenu lang={lang} />
      </div>

      {/* === Bento hero grid === */}
      <div className="bento dash-fade-1">

        {/* Hero — portfolio value + sparkline */}
        <div className="bento-card is-hero bento-hero tone-cyan">
          <span className="bento-accent-bar" />
          <span className="bento-label">{t(lang, 'inv.portfolioValue')}</span>
          <span className="bento-value" style={{ marginTop: 4 }}>
            ${totalStake.toLocaleString('en-US')}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
            <span className="bento-delta up">↑ ${ytdReturn.toLocaleString('en-US')} YTD</span>
            <span style={{ color: 'var(--dash-text-3)', fontSize: 12 }}>· {activeCount} {t(lang, 'inv.kpi.activeSub')}</span>
          </div>

          <div style={{ flex: 1, minHeight: 0, marginTop: 12, position: 'relative' }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="bento-spark" aria-hidden>
              <defs>
                <linearGradient id="invSparkFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#06B6D4" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={sparkArea} fill="url(#invSparkFill)" />
              <path d={sparkPath} fill="none" stroke="#06B6D4" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
            </svg>
            <div style={{
              position: 'absolute', left: 0, right: 0, bottom: 0,
              display: 'flex', justifyContent: 'space-between',
              color: 'var(--dash-text-3)', fontSize: 10, fontFamily: 'var(--dash-font-mono)',
              padding: '0 2px',
            }}>
              <span>Jun</span><span>Sep</span><span>Dec</span><span>Mar</span><span>May</span>
            </div>
          </div>
        </div>

        {/* Active projects */}
        <div className="bento-card bento-tile tone-amber">
          <span className="bento-accent-bar" />
          <span className="bento-label">{t(lang, 'inv.kpi.activeProjects')}</span>
          <span className="bento-value">{activeCount}</span>
          <span className="bento-sub">{demoInvestorPortfolio.length} total</span>
        </div>

        {/* Avg IRR */}
        <div className="bento-card bento-tile tone-cyan">
          <span className="bento-accent-bar" />
          <span className="bento-label">{t(lang, 'inv.kpi.avgIrr')}</span>
          <span className="bento-value">{avgIrr}%</span>
          <span className="bento-sub">{t(lang, 'inv.kpi.irrSub')}</span>
        </div>

        {/* Monthly distributions */}
        <div className="bento-card bento-tile tone-green">
          <span className="bento-accent-bar" />
          <span className="bento-label">{t(lang, 'inv.kpi.monthly') || 'Mensual'}</span>
          <span className="bento-value">${monthlyIncome.toLocaleString('en-US')}</span>
          <span className="bento-sub">{t(lang, 'inv.kpi.distSub') || 'Distribución promedio'}</span>
        </div>

        {/* Next payout */}
        <div className="bento-card bento-tile tone-violet">
          <span className="bento-accent-bar" />
          <span className="bento-label">{t(lang, 'inv.kpi.nextPayout')}</span>
          <span className="bento-value">$1,240</span>
          <span className="bento-sub">{t(lang, 'inv.kpi.nextPayoutSub')}</span>
        </div>

        {/* Wide CTA tile */}
        <div className="bento-card bento-wide tone-cyan" style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
          <span className="bento-accent-bar" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span className="bento-label">{t(lang, 'inv.cta.title') || 'Nuevas oportunidades'}</span>
            <span style={{ color: 'var(--dash-text)', fontSize: 16, fontWeight: 600 }}>
              8 {t(lang, 'inv.cta.subtitle') || 'rondas abiertas · IRR hasta 15%'}
            </span>
          </div>
          <button className="dash-btn" style={{
            height: 36, padding: '0 14px', borderRadius: 8,
            background: 'var(--dash-cyan)', color: '#001F26',
            border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            {t(lang, 'inv.cta.btn') || 'Explorar'} <Ic n="arrow-right" s={13} />
          </button>
        </div>
      </div>

      {/* === Today's projects + side panel === */}
      <div className="dash-grid-hero dash-fade-2">
        <InvestorProjectsList lang={lang} rows={projects} title={t(lang, 'inv.todayProjects')} />
        <InvestorSidePanel lang={lang} />
      </div>
    </>
  );
}
