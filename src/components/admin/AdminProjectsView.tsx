'use client';
import { t } from '@/i18n/translations';
import { Ic } from '@/components/dashboard/shared';
import { demoAdminProjectsList } from '@/lib/demoData';

const STATUS_TONES: Record<string, { bg: string; fg: string }> = {
  review:     { bg: '#A78BFA18', fg: '#A78BFA' },
  listing:    { bg: '#FBBF2418', fg: '#FBBF24' },
  funding:    { bg: '#F59E0B18', fg: '#F59E0B' },
  installing: { bg: '#6C5CE714', fg: '#7B6BF0' },
  live:       { bg: '#2BB67318', fg: '#2BB673' },
  paid:       { bg: '#16161A',   fg: '#A1A1A6' },
};

export function AdminProjectsView({ lang }: { lang: string }) {
  const projects = demoAdminProjectsList;
  const totalCost = projects.reduce((s, p) => s + p.totalCost, 0);
  const liveCount = projects.filter(p => p.status === 'live' || p.status === 'installing').length;
  const fundingCount = projects.filter(p => p.status === 'funding' || p.status === 'listing').length;
  const reviewCount  = projects.filter(p => p.status === 'review').length;

  return (
    <>
      <div className="dash-header dash-fade">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#F59E0B', fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>
            {t(lang, 'sidebar.adm.projects')}
          </span>
          <h1 style={{ color: '#EDEDEE', fontSize: 28, fontWeight: 600, letterSpacing: -0.2, margin: 0 }}>
            {t(lang, 'admin.proj.title')}
          </h1>
          <span style={{ color: '#A1A1A6', fontSize: 13 }}>{projects.length} {t(lang, 'admin.proj.totalInPipeline')}</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="dash-btn" style={{ height: 36, padding: '0 14px', borderRadius: 8, background: 'transparent', border: '1px solid #1F1F23', color: '#A1A1A6', fontSize: 12, fontWeight: 500, fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Ic n="download" s={12} /> {t(lang, 'admin.users.export')}
          </button>
        </div>
      </div>

      <div className="dash-grid-4col dash-fade-1">
        <Kpi label={t(lang, 'admin.proj.pipelineValue')} value={`$${(totalCost / 1_000_000).toFixed(2)}M`} sub={t(lang, 'admin.proj.totalRaise')} accent="#F59E0B" />
        <Kpi label={t(lang, 'admin.proj.active')}        value={String(liveCount)}    sub={t(lang, 'admin.proj.installingOrLive')} accent="#2BB673" />
        <Kpi label={t(lang, 'admin.proj.raising')}       value={String(fundingCount)} sub={t(lang, 'admin.proj.openRounds')}       accent="#FBBF24" />
        <Kpi label={t(lang, 'admin.proj.inReview')}      value={String(reviewCount)}  sub={t(lang, 'admin.proj.awaitingAudit')}    accent="#A78BFA" />
      </div>

      <div className="dash-card dash-fade-2" style={{ background: '#101013', border: '1px solid #1F1F23', borderRadius: 8, padding: 0, overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '70px 1.8fr 1fr 1fr 90px 90px 120px',
          gap: 8, padding: '12px 16px', borderBottom: '1px solid #1F1F23',
          color: '#A1A1A6', fontSize: 10, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase',
        }}>
          <span>{t(lang, 'admin.proj.col.id')}</span>
          <span>{t(lang, 'admin.proj.col.project')}</span>
          <span>{t(lang, 'admin.proj.col.epc')}</span>
          <span>{t(lang, 'admin.proj.col.customer')}</span>
          <span style={{ textAlign: 'right' }}>{t(lang, 'admin.proj.col.kw')}</span>
          <span style={{ textAlign: 'right' }}>{t(lang, 'admin.proj.col.cost')}</span>
          <span style={{ textAlign: 'right' }}>{t(lang, 'admin.proj.col.status')}</span>
        </div>
        {projects.map((p, i) => {
          const tone = STATUS_TONES[p.status];
          return (
            <div key={p.id} style={{
              display: 'grid', gridTemplateColumns: '70px 1.8fr 1fr 1fr 90px 90px 120px', gap: 8,
              padding: '12px 16px', alignItems: 'center',
              borderBottom: i < projects.length - 1 ? '1px solid #16161A' : 'none',
            }}>
              <span style={{ color: '#6B6B71', fontSize: 11, fontFamily: 'monospace' }}>{p.id}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
                <span style={{ color: '#EDEDEE', fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                <span style={{ color: '#6B6B71', fontSize: 11 }}>{p.city}</span>
              </div>
              <span style={{ color: '#A1A1A6', fontSize: 12 }}>{p.epc}</span>
              <span style={{ color: '#A1A1A6', fontSize: 12 }}>{p.customer}</span>
              <span style={{ color: '#EDEDEE', fontSize: 12, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{p.capacityKw}</span>
              <span style={{ color: '#EDEDEE', fontSize: 12, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                ${p.totalCost >= 100_000 ? `${(p.totalCost / 1000).toFixed(0)}k` : p.totalCost.toLocaleString('en-US')}
              </span>
              <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ padding: '2px 8px', borderRadius: 4, background: tone.bg, color: tone.fg, fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                  {t(lang, `admin.proj.status.${p.status}`)}
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
      <span style={{ color: '#EDEDEE', fontSize: 22, fontWeight: 600, letterSpacing: -0.2, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      <span style={{ color: '#A1A1A6', fontSize: 11 }}>{sub}</span>
    </div>
  );
}
