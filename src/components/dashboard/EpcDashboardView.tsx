'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { t } from '@/i18n/translations';
import { api } from '@/lib/api-client';
import { Ic } from './shared';
import { UserMenu } from './UserMenu';
import { demoEpcJobs, demoEpcSummary, demoEpcEarnings } from '@/lib/demoData';

interface EpcJob { time: string; period: string; tag: string; customer: string; system: string; addr: string; payout: string; active: boolean; isToday: boolean }
interface EpcSummary { active_jobs: number; completed_jobs: number; rating: number | null; rating_count: number; earnings_month: number; earnings_change_pct: number }

export default function EpcDashboardView({ lang }: { lang: string }) {
  const router = useRouter();
  const [jobs, setJobs] = useState<EpcJob[]>([]);
  const [summary, setSummary] = useState<EpcSummary | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      api<{ jobs: EpcJob[] }>('/api/dashboard/epc/jobs', { signal: controller.signal }).catch(() => ({ jobs: [] })),
      api<EpcSummary>('/api/dashboard/epc/summary', { signal: controller.signal }).catch(() => null),
    ]).then(([j, s]) => {
      const realJobs = j.jobs || [];
      setJobs(realJobs.length > 0 ? realJobs : (demoEpcJobs as unknown as EpcJob[]));
      const isEmptySummary = !s || (s.active_jobs === 0 && s.completed_jobs === 0 && (s.rating == null) && s.earnings_month === 0);
      setSummary(isEmptySummary ? demoEpcSummary : s);
    });
    return () => controller.abort();
  }, []);

  // 6-month earnings curve for hero sparkline
  const monthly = demoEpcEarnings.monthly;
  const maxM = Math.max(...monthly);
  const minM = Math.min(...monthly);
  const sparkPath = monthly
    .map((v, i) => {
      const x = (i / (monthly.length - 1)) * 100;
      const y = maxM === minM ? 50 : 100 - ((v - minM) / (maxM - minM)) * 100;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
  const sparkArea = `${sparkPath} L100,100 L0,100 Z`;

  return (
    <>
      <div className="dash-header dash-fade">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: 'var(--dash-text-2)', fontSize: 12, fontWeight: 500 }}>{t(lang, 'epc.dashboard.greeting')}</span>
          <h1 style={{ color: 'var(--dash-text)', fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>
            {t(lang, 'epc.dashboard.jobsToday')}
          </h1>
          <span style={{ color: 'var(--dash-text-3)', fontSize: 12 }}>{t(lang, 'epc.dashboard.nextInstall')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            className="dash-btn"
            onClick={() => router.push(`/${lang}/projects/new`)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, height: 36, padding: '0 14px',
              background: 'var(--dash-accent)', border: 'none', borderRadius: 8,
              color: '#0A0617', fontSize: 12, fontWeight: 700, fontFamily: 'inherit',
              cursor: 'pointer',
            }}
          >
            <Ic n="plus" s={14} />
            {t(lang, 'epc.dashboard.uploadProject')}
          </button>
          <UserMenu lang={lang} />
        </div>
      </div>

      {/* === Bento hero === */}
      <div className="bento dash-fade-1">

        {/* Hero — month earnings + curve */}
        <div className="bento-card is-hero bento-hero tone-cyan">
          <span className="bento-accent-bar" />
          <span className="bento-label">{t(lang, 'epc.dashboard.earnings')}</span>
          <span className="bento-value" style={{ marginTop: 4 }}>
            ${Math.round(summary?.earnings_month ?? demoEpcSummary.earnings_month).toLocaleString('en-US')}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <span className="bento-delta up">↑ {summary?.earnings_change_pct ?? demoEpcSummary.earnings_change_pct}%</span>
            <span style={{ color: 'var(--dash-text-3)', fontSize: 12 }}>{t(lang, 'epc.dashboard.earningsSub')}</span>
          </div>

          <div style={{ flex: 1, minHeight: 0, marginTop: 12, position: 'relative' }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="bento-spark" aria-hidden>
              <defs>
                <linearGradient id="epcSparkFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#06B6D4" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={sparkArea} fill="url(#epcSparkFill)" />
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

        <div className="bento-card bento-tile tone-amber">
          <span className="bento-accent-bar" />
          <span className="bento-label">{t(lang, 'epc.dashboard.activeJobs')}</span>
          <span className="bento-value">{summary?.active_jobs ?? 0}</span>
          <span className="bento-sub">{t(lang, 'epc.dashboard.activeSub')}</span>
        </div>

        <div className="bento-card bento-tile tone-green">
          <span className="bento-accent-bar" />
          <span className="bento-label">{t(lang, 'epc.dashboard.completed')}</span>
          <span className="bento-value">{summary?.completed_jobs ?? 0}</span>
          <span className="bento-sub">{t(lang, 'epc.dashboard.completedSub')}</span>
        </div>

        <div className="bento-card bento-tile tone-violet">
          <span className="bento-accent-bar" />
          <span className="bento-label">{t(lang, 'epc.dashboard.rating')}</span>
          <span className="bento-value">{summary?.rating != null ? summary.rating.toFixed(2) : '—'}</span>
          <span className="bento-sub">{summary?.rating_count ?? 0} reviews</span>
        </div>

        <div className="bento-card bento-tile tone-cyan">
          <span className="bento-accent-bar" />
          <span className="bento-label">YTD</span>
          <span className="bento-value">${(demoEpcEarnings.ytd / 1000).toFixed(0)}k</span>
          <span className="bento-sub">{t(lang, 'epc.dashboard.earningsSub')}</span>
        </div>

        {/* Safety badge wide */}
        <div className="bento-card bento-wide tone-green" style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <span className="bento-accent-bar" />
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: '#2BB67318', border: '1px solid #2BB67340',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Ic n="shield-check" s={20} c="#2BB673" />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ color: 'var(--dash-text)', fontSize: 14, fontWeight: 600 }}>
              {t(lang, 'epc.dashboard.safety')}
            </span>
            <span style={{ color: 'var(--dash-success)', fontSize: 11 }}>
              {t(lang, 'epc.dashboard.safetySub')}
            </span>
          </div>
        </div>
      </div>

      {/* === Today's jobs list === */}
      <div className="dash-card dash-fade-2" style={{
        display: 'flex', flexDirection: 'column',
        background: 'var(--dash-surface)', border: '1px solid var(--dash-border)',
        borderRadius: 'var(--dash-radius-lg)', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 56, padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Ic n="hardhat" s={16} c="var(--dash-accent)" />
            <span style={{ color: 'var(--dash-text-2)', fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>
              {t(lang, 'epc.dashboard.todayJobs')}
            </span>
          </div>
          <span style={{ color: 'var(--dash-accent)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            {t(lang, 'epc.dashboard.viewAll')} {jobs.length} →
          </span>
        </div>
        <div style={{ height: 1, background: 'var(--dash-divider)' }} />
        {jobs.length === 0 && (
          <div style={{ padding: 32, color: 'var(--dash-text-3)', fontSize: 13, textAlign: 'center' }}>
            {t(lang, 'dashboard.affiliate.empty')}
          </div>
        )}
        {jobs.map((j, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px',
            background: j.active ? 'var(--dash-accent-soft)' : 'transparent',
            borderBottom: i < jobs.length - 1 ? '1px solid var(--dash-divider)' : 'none',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: 52 }}>
              <span style={{
                color: j.active ? 'var(--dash-accent)' : j.isToday ? 'var(--dash-text)' : 'var(--dash-violet)',
                fontSize: j.isToday ? 16 : 13, fontWeight: 700,
                fontFamily: 'var(--dash-font-mono)',
              }}>{j.time}</span>
              <span style={{ color: j.active ? 'var(--dash-accent)' : 'var(--dash-text-3)', fontSize: 10, fontWeight: 600 }}>{j.period}</span>
            </div>
            <div style={{ width: 1, height: 48, background: j.active ? '#F59E0B40' : 'var(--dash-divider)' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {j.tag && (
                <span style={{
                  display: 'inline-flex', alignSelf: 'flex-start', padding: '1px 7px', borderRadius: 4,
                  background: j.tag === 'NEXT' ? 'var(--dash-accent)' : '#A78BFA1A',
                  color: j.tag === 'NEXT' ? '#0A0617' : 'var(--dash-violet)',
                  fontSize: 9, fontWeight: 700, letterSpacing: 0.5,
                }}>{j.tag}</span>
              )}
              <span style={{ color: 'var(--dash-text)', fontSize: 13, fontWeight: 600 }}>
                {j.customer} · <span style={{ fontWeight: 500, color: 'var(--dash-text-2)' }}>{j.system}</span>
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Ic n="map" s={11} c="var(--dash-text-3)" />
                <span style={{ color: 'var(--dash-text-2)', fontSize: 11 }}>{j.addr}</span>
                {j.payout && (
                  <>
                    <span style={{ color: 'var(--dash-text-3)' }}>·</span>
                    <span style={{ color: 'var(--dash-cyan)', fontSize: 11, fontWeight: 600 }}>{j.payout}</span>
                  </>
                )}
              </div>
            </div>
            <button className="dash-btn" style={{
              display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0 12px', height: 30, borderRadius: 6,
              border: j.active ? 'none' : '1px solid var(--dash-border)',
              background: j.active ? 'var(--dash-accent)' : 'transparent',
              color: j.active ? '#0A0617' : 'var(--dash-text)',
              fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              {j.active ? <><Ic n="arrow-right" s={11} /> {t(lang, 'epc.dashboard.navigate')}</> : t(lang, 'epc.dashboard.details')}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
