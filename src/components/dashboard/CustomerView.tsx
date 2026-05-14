'use client';
import { useRouter } from 'next/navigation';
import { t } from '@/i18n/translations';
import { Ic, fmtMoney, dash } from './shared';
import { UserMenu } from './UserMenu';
import { useDashboardData } from './DashboardDataProvider';
import { demoCustomerEnergy } from '@/lib/demoData';

export default function CustomerView({ lang, user }: { lang: string; user: { name: string; email: string; id?: string } }) {
  const router = useRouter();
  const { refUrl, stats, production: prod } = useDashboardData();
  const firstName = (user.name || user.email).split(/\s+|@/)[0];

  // 24-hour solar curve for the hero sparkline
  const curve = demoCustomerEnergy.hourly;
  const peak = Math.max(...curve);
  const sparkPath = curve
    .map((v, i) => {
      const x = (i / (curve.length - 1)) * 100;
      const y = peak > 0 ? 100 - (v / peak) * 100 : 100;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
  const sparkArea = `${sparkPath} L100,100 L0,100 Z`;

  const todayKwh   = prod?.today_kwh ?? 28.5;
  const monthKwh   = prod?.month_kwh ?? 754;
  const savings    = prod?.savings_month_usd ?? 184;
  const savingsPct = prod?.savings_change_pct ?? 23.4;
  const battery    = prod?.battery_pct ?? 78;
  const co2        = prod?.co2_kg_month ?? 412;

  return (
    <>
      <div className="dash-header dash-fade">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: 'var(--dash-text-2)', fontSize: 12, fontWeight: 500 }}>
            {t(lang, 'dashboard.customer.welcome')} {firstName}
          </span>
          <h1 style={{ color: 'var(--dash-text)', fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>
            {t(lang, 'dashboard.customer.producing')}
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => router.push(`/${lang}/onboarding/customer`)}
            className="dash-btn"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, height: 36, padding: '0 14px',
              background: 'var(--dash-accent)', border: 'none', borderRadius: 8,
              color: '#0A0617', fontSize: 12, fontWeight: 700, fontFamily: 'inherit',
              cursor: 'pointer',
            }}
          >
            <Ic n="plus" s={14} />
            {t(lang, 'dashboard.customer.requestInstallation')}
          </button>
          <UserMenu lang={lang} />
        </div>
      </div>

      {/* === Bento hero === */}
      <div className="bento dash-fade-1">

        {/* Hero — today's production */}
        <div className="bento-card is-hero bento-hero tone-amber">
          <span className="bento-accent-bar" />
          <span className="bento-label">{t(lang, 'dashboard.customer.producingToday')}</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
            <span className="bento-value">{todayKwh}</span>
            <span style={{ color: 'var(--dash-text-2)', fontSize: 18, fontWeight: 500 }}>kWh</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <span className="bento-delta up">↑ ${savings} {t(lang, 'dashboard.customer.savedToday')}</span>
          </div>

          <div style={{ flex: 1, minHeight: 0, marginTop: 12, position: 'relative' }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="bento-spark" aria-hidden>
              <defs>
                <linearGradient id="custSparkFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#F59E0B" stopOpacity="0.34" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={sparkArea} fill="url(#custSparkFill)" />
              <path d={sparkPath} fill="none" stroke="#F59E0B" strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
            </svg>
            <div style={{
              position: 'absolute', left: 0, right: 0, bottom: 0,
              display: 'flex', justifyContent: 'space-between',
              color: 'var(--dash-text-3)', fontSize: 10, fontFamily: 'var(--dash-font-mono)',
              padding: '0 2px',
            }}>
              <span>00h</span><span>06h</span><span>12h</span><span>18h</span><span>24h</span>
            </div>
          </div>
        </div>

        {/* Month kWh */}
        <div className="bento-card bento-tile tone-amber">
          <span className="bento-accent-bar" />
          <span className="bento-label">{t(lang, 'dashboard.customer.thisMonth')}</span>
          <span className="bento-value">{monthKwh}</span>
          <span className="bento-sub">kWh · {t(lang, 'dashboard.customer.goal')} {dash(prod?.month_goal_kwh ?? 850, '')}</span>
        </div>

        {/* Savings */}
        <div className="bento-card bento-tile tone-cyan">
          <span className="bento-accent-bar" />
          <span className="bento-label">{t(lang, 'dashboard.customer.savingsMonth')}</span>
          <span className="bento-value">${savings}</span>
          <span className="bento-delta up" style={{ marginTop: 2 }}>↑ {savingsPct}% {t(lang, 'dashboard.customer.vsLast')}</span>
        </div>

        {/* Battery */}
        <div className="bento-card bento-tile tone-violet">
          <span className="bento-accent-bar" />
          <span className="bento-label">{t(lang, 'dashboard.customer.battery')}</span>
          <span className="bento-value">{battery}%</span>
          <span className="bento-sub">{((battery / 100) * (prod?.battery_capacity_kwh ?? 13.5)).toFixed(1)} / {prod?.battery_capacity_kwh ?? 13.5} kWh</span>
        </div>

        {/* CO2 */}
        <div className="bento-card bento-tile tone-green">
          <span className="bento-accent-bar" />
          <span className="bento-label">{t(lang, 'dashboard.customer.co2')}</span>
          <span className="bento-value">{co2}</span>
          <span className="bento-sub">kg · ≈ {Math.round(co2 / 24)} 🌳</span>
        </div>

        {/* Referral CTA wide */}
        <div className="bento-card bento-wide tone-violet" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 14 }}>
          <span className="bento-accent-bar" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span className="bento-label">{t(lang, 'dashboard.customer.referTag')}</span>
            <span style={{ color: 'var(--dash-text)', fontSize: 16, fontWeight: 600 }}>
              {t(lang, 'dashboard.customer.referHero')}
            </span>
            <span style={{ color: 'var(--dash-text-2)', fontSize: 12 }}>
              <b style={{ color: 'var(--dash-text)' }}>{stats?.signups ?? 0}</b> {t(lang, 'dashboard.customer.referredCount')} ·{' '}
              <b style={{ color: 'var(--dash-text)' }}>{fmtMoney(stats?.commission_paid ?? 0)}</b> {t(lang, 'dashboard.customer.earnedShort')}
            </span>
          </div>
          <button
            onClick={() => refUrl && navigator.clipboard.writeText(refUrl)}
            disabled={!refUrl}
            className="dash-btn"
            style={{
              height: 36, padding: '0 14px', borderRadius: 8,
              background: 'var(--dash-violet)', color: '#1B1339',
              border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6,
              opacity: refUrl ? 1 : 0.6,
            }}
          >
            <Ic n="copy" s={13} /> {t(lang, 'dashboard.customer.shareNow')}
          </button>
        </div>
      </div>

      {/* === Status row === */}
      <div className="dash-grid-2col dash-fade-2">
        <div className="dash-card" style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 18px', background: 'var(--dash-success-soft)',
          border: '1px solid #2BB67340', borderRadius: 'var(--dash-radius)',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: '#2BB67320', border: '1px solid #2BB67340',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Ic n="shield-check" s={16} c="#2BB673" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ color: 'var(--dash-text)', fontSize: 13, fontWeight: 600 }}>
              {t(lang, 'dashboard.customer.systemHealthy')}
            </span>
            <span style={{ color: 'var(--dash-success)', fontSize: 11 }}>
              {t(lang, 'dashboard.customer.allPanels')}
            </span>
          </div>
        </div>
        <div className="dash-card" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 18px', background: 'var(--dash-surface)',
          border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ color: 'var(--dash-text-3)', fontSize: 10, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>
              {t(lang, 'dashboard.customer.nextBill')}
            </span>
            <span style={{ color: 'var(--dash-text)', fontSize: 20, fontWeight: 600 }}>
              ${prod?.next_bill_amount ?? 54}
            </span>
          </div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            color: 'var(--dash-success)', fontSize: 11, fontWeight: 600,
          }}>
            <Ic n="check" s={12} /> {t(lang, 'dashboard.customer.autoPay')}
          </span>
        </div>
      </div>
    </>
  );
}
