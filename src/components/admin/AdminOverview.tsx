'use client';
import { useEffect, useState } from 'react';
import { t } from '@/i18n/translations';
import { api } from '@/lib/api-client';
import { Ic, Skeleton, fmtMoney } from '@/components/dashboard/shared';
import { demoPlatformMetrics, demoAdminProjects, demoAdminCommissions, demoAdminCapital } from '@/lib/demoData';

interface UserRow {
  id: number; email: string; role: string; created_at: string;
}

interface AdminStats {
  totalUsers: number;
  customers: number;
  epcs: number;
  investors: number;
  signupsLast7d: number;
  signupsLast30d: number;
}

function isoDayDelta(iso: string): number {
  const t0 = new Date(iso).getTime();
  return Math.floor((Date.now() - t0) / (24 * 3600 * 1000));
}

export function AdminOverview({ lang }: { lang: string }) {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const demoStats: AdminStats = {
      totalUsers: demoPlatformMetrics.totalUsers,
      customers:  demoPlatformMetrics.customers,
      epcs:       demoPlatformMetrics.epcs,
      investors:  demoPlatformMetrics.investors,
      signupsLast7d:  demoPlatformMetrics.signupsLast7d,
      signupsLast30d: demoPlatformMetrics.signupsLast30d,
    };
    api<UserRow[]>('/api/users?limit=200', { signal: controller.signal })
      .then(rows => {
        if (!rows || rows.length === 0) { setStats(demoStats); return; }
        const customers = rows.filter(r => r.role === 'client').length;
        const epcs = rows.filter(r => r.role === 'installer').length;
        const investors = rows.filter(r => r.role === 'investor').length;
        const signupsLast7d = rows.filter(r => isoDayDelta(r.created_at) <= 7).length;
        const signupsLast30d = rows.filter(r => isoDayDelta(r.created_at) <= 30).length;
        setStats({ totalUsers: rows.length, customers, epcs, investors, signupsLast7d, signupsLast30d });
      })
      .catch(() => setStats(demoStats));
    return () => controller.abort();
  }, []);

  // 6-month project growth curve (synthetic from demoAdminProjects.monthly)
  const projMonthly = demoAdminProjects.monthly;
  const maxP = Math.max(...projMonthly);
  const minP = Math.min(...projMonthly);
  const sparkPath = projMonthly
    .map((v, i) => {
      const x = (i / (projMonthly.length - 1)) * 100;
      const y = maxP === minP ? 50 : 100 - ((v - minP) / (maxP - minP)) * 100;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
  const sparkArea = `${sparkPath} L100,100 L0,100 Z`;

  return (
    <>
      <div className="dash-header dash-fade">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: 'var(--dash-accent)', fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase' }}>
            ADMIN OVERVIEW
          </span>
          <h1 style={{ color: 'var(--dash-text)', fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>
            {t(lang, 'admin.overview.title')}
          </h1>
          <span style={{ color: 'var(--dash-text-3)', fontSize: 12 }}>{t(lang, 'admin.overview.subtitle')}</span>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, height: 30, padding: '0 12px',
          background: 'var(--dash-accent-soft)', border: '1px solid #F59E0B40',
          borderRadius: 6,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--dash-accent)' }} />
          <span style={{ color: 'var(--dash-accent)', fontSize: 10, fontWeight: 700, letterSpacing: 0.6 }}>
            {t(lang, 'admin.overview.live')}
          </span>
        </div>
      </div>

      {/* === Bento hero === */}
      <div className="bento dash-fade-1">

        {/* Hero — capital deployed + project growth curve */}
        <div className="bento-card is-hero bento-hero tone-cyan">
          <span className="bento-accent-bar" />
          <span className="bento-label">{t(lang, 'admin.overview.capitalTitle')}</span>
          <span className="bento-value" style={{ marginTop: 4 }}>
            ${(demoAdminCapital.deployedYtd / 1_000_000).toFixed(2)}M
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <span className="bento-delta up">↑ {demoAdminCommissions.growthPct}% YTD</span>
            <span style={{ color: 'var(--dash-text-3)', fontSize: 12 }}>
              · {demoAdminProjects.activeProjects} {t(lang, 'admin.overview.projectsSub')}
            </span>
          </div>

          <div style={{ flex: 1, minHeight: 0, marginTop: 12, position: 'relative' }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="bento-spark" aria-hidden>
              <defs>
                <linearGradient id="adminSparkFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#06B6D4" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={sparkArea} fill="url(#adminSparkFill)" />
              <path d={sparkPath} fill="none" stroke="#06B6D4" strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
            </svg>
            <div style={{
              position: 'absolute', left: 0, right: 0, bottom: 0,
              display: 'flex', justifyContent: 'space-between',
              color: 'var(--dash-text-3)', fontSize: 10, fontFamily: 'var(--dash-font-mono)',
              padding: '0 2px',
            }}>
              <span>Dic</span><span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span><span>May</span>
            </div>
          </div>
        </div>

        {/* Total users */}
        {stats == null ? (
          <>
            <div className="bento-card bento-tile"><Skeleton h={60} /></div>
            <div className="bento-card bento-tile"><Skeleton h={60} /></div>
            <div className="bento-card bento-tile"><Skeleton h={60} /></div>
            <div className="bento-card bento-tile"><Skeleton h={60} /></div>
          </>
        ) : (
          <>
            <div className="bento-card bento-tile tone-amber">
              <span className="bento-accent-bar" />
              <span className="bento-label">{t(lang, 'admin.kpi.totalUsers')}</span>
              <span className="bento-value">{stats.totalUsers.toLocaleString('en-US')}</span>
              <span className="bento-delta up">↑ {stats.signupsLast7d} · 7d</span>
            </div>
            <div className="bento-card bento-tile tone-green">
              <span className="bento-accent-bar" />
              <span className="bento-label">{t(lang, 'admin.kpi.customers')}</span>
              <span className="bento-value">{stats.customers.toLocaleString('en-US')}</span>
              <span className="bento-sub">{Math.round((stats.customers / stats.totalUsers) * 100)}% del total</span>
            </div>
            <div className="bento-card bento-tile tone-violet">
              <span className="bento-accent-bar" />
              <span className="bento-label">{t(lang, 'admin.kpi.epcs')}</span>
              <span className="bento-value">{stats.epcs}</span>
              <span className="bento-sub">Activos · LATAM</span>
            </div>
            <div className="bento-card bento-tile tone-cyan">
              <span className="bento-accent-bar" />
              <span className="bento-label">{t(lang, 'admin.kpi.investors')}</span>
              <span className="bento-value">{stats.investors}</span>
              <span className="bento-sub">Fondos + individuales</span>
            </div>
          </>
        )}

        {/* Wide row — commissions + 30d */}
        <div className="bento-card bento-wide tone-cyan" style={{ flexDirection: 'row', alignItems: 'center', gap: 18 }}>
          <span className="bento-accent-bar" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span className="bento-label">{t(lang, 'admin.overview.commissionsTitle')}</span>
            <span style={{ color: 'var(--dash-cyan)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>
              {fmtMoney(demoAdminCommissions.paidYtd)}
            </span>
            <span style={{ color: 'var(--dash-text-2)', fontSize: 12 }}>
              {fmtMoney(demoAdminCommissions.thisMonth)} este mes · {fmtMoney(demoAdminCommissions.pending)} pendiente
            </span>
          </div>
          <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--dash-border)' }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span className="bento-label">{t(lang, 'admin.kpi.last30d')}</span>
            <span style={{ color: 'var(--dash-success)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>
              +{stats?.signupsLast30d ?? 0}
            </span>
            <span style={{ color: 'var(--dash-text-2)', fontSize: 12 }}>signups · últimos 30 días</span>
          </div>
        </div>
      </div>

      {/* === Energy + CO2 + Projects breakdown row === */}
      <div className="dash-grid-3col dash-fade-2">
        <div className="dash-card" style={{
          padding: 18, background: 'var(--dash-surface)', border: '1px solid var(--dash-border)',
          borderRadius: 'var(--dash-radius)',
        }}>
          <span style={{ color: 'var(--dash-text-2)', fontSize: 10, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>
            {t(lang, 'admin.overview.energyTitle')}
          </span>
          <h3 style={{
            color: 'var(--dash-accent)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em',
            margin: '4px 0 0', fontVariantNumeric: 'tabular-nums',
          }}>
            {demoAdminCapital.energyDeployedMW} MW
          </h3>
          <span style={{ color: 'var(--dash-text-2)', fontSize: 12 }}>{t(lang, 'admin.overview.energySub')}</span>
        </div>
        <div className="dash-card" style={{
          padding: 18, background: 'var(--dash-surface)', border: '1px solid var(--dash-border)',
          borderRadius: 'var(--dash-radius)',
        }}>
          <span style={{ color: 'var(--dash-text-2)', fontSize: 10, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>
            {t(lang, 'admin.overview.co2Title')}
          </span>
          <h3 style={{
            color: 'var(--dash-success)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em',
            margin: '4px 0 0', fontVariantNumeric: 'tabular-nums',
          }}>
            {demoAdminCapital.co2OffsetTons} t
          </h3>
          <span style={{ color: 'var(--dash-text-2)', fontSize: 12 }}>{t(lang, 'admin.overview.co2Sub')}</span>
        </div>
        <div className="dash-card" style={{
          padding: 18, background: 'var(--dash-surface)', border: '1px solid var(--dash-border)',
          borderRadius: 'var(--dash-radius)',
        }}>
          <span style={{ color: 'var(--dash-text-2)', fontSize: 10, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>
            {t(lang, 'admin.overview.projectsTitle')}
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 4 }}>
            <h3 style={{
              color: 'var(--dash-text)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em',
              margin: 0, fontVariantNumeric: 'tabular-nums',
            }}>
              {demoAdminProjects.activeProjects}
            </h3>
            <span style={{ color: 'var(--dash-text-3)', fontSize: 11 }}>
              {demoAdminProjects.inProgress} prog · {demoAdminProjects.awaitingReview} rev · {demoAdminProjects.completed} ok
            </span>
          </div>
          <span style={{ color: 'var(--dash-text-2)', fontSize: 12 }}>{t(lang, 'admin.overview.projectsSub')}</span>
        </div>
      </div>
    </>
  );
}
