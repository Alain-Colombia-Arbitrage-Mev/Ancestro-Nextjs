'use client';
import { t } from '@/i18n/translations';
import { Ic } from './shared';
import { UserMenu } from './UserMenu';
import { demoEpcActiveJobsList } from '@/lib/demoData';

const STATUS_TONES: Record<string, { bg: string; fg: string }> = {
  scheduled:    { bg: '#A78BFA18', fg: '#A78BFA' },
  'in-progress':{ bg: '#F59E0B18', fg: '#F59E0B' },
  completed:    { bg: '#2BB67318', fg: '#2BB673' },
  review:       { bg: '#6C5CE714', fg: '#7B6BF0' },
};

export default function EpcActiveJobsView({ lang }: { lang: string }) {
  const jobs = demoEpcActiveJobsList;
  const scheduled = jobs.filter(j => j.status === 'scheduled').length;
  const inProgress = jobs.filter(j => j.status === 'in-progress').length;
  const completed = jobs.filter(j => j.status === 'completed').length;
  const totalKw = jobs.reduce((s, j) => s + j.kw, 0);
  const totalPayout = jobs.reduce((s, j) => s + j.payout, 0);

  return (
    <>
      <div className="dash-header dash-fade">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#A1A1A6', fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>
            {t(lang, 'sidebar.epc.activeJobs')}
          </span>
          <h1 style={{ color: '#EDEDEE', fontSize: 28, fontWeight: 600, letterSpacing: -0.2, margin: 0 }}>
            {t(lang, 'epc.jobs.title')}
          </h1>
          <span style={{ color: '#A1A1A6', fontSize: 13 }}>{jobs.length} {t(lang, 'epc.jobs.activeOnQueue')} · {totalKw.toFixed(1)} kW</span>
        </div>
        <UserMenu lang={lang} />
      </div>

      <div className="dash-grid-4col dash-fade-1">
        <Kpi label={t(lang, 'epc.jobs.scheduled')}   value={String(scheduled)}                  sub={t(lang, 'epc.jobs.thisWeek')}      accent="#A78BFA" />
        <Kpi label={t(lang, 'epc.jobs.inProgress')}  value={String(inProgress)}                 sub={t(lang, 'epc.jobs.today')}         accent="#F59E0B" />
        <Kpi label={t(lang, 'epc.jobs.completed')}   value={String(completed)}                  sub={t(lang, 'epc.jobs.last30d')}       accent="#2BB673" />
        <Kpi label={t(lang, 'epc.jobs.totalPayout')} value={`$${totalPayout.toLocaleString('en-US')}`} sub={t(lang, 'epc.jobs.queued')}  accent="#FBBF24" />
      </div>

      <div className="dash-card dash-fade-2" style={{ background: '#101013', border: '1px solid #1F1F23', borderRadius: 8, padding: 0, overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '70px 1.6fr 1fr 70px 90px 90px 80px 110px',
          gap: 8, padding: '12px 16px', borderBottom: '1px solid #1F1F23',
          color: '#A1A1A6', fontSize: 10, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase',
        }}>
          <span>{t(lang, 'epc.jobs.col.id')}</span>
          <span>{t(lang, 'epc.jobs.col.customer')}</span>
          <span>{t(lang, 'epc.jobs.col.system')}</span>
          <span style={{ textAlign: 'right' }}>{t(lang, 'epc.jobs.col.kw')}</span>
          <span>{t(lang, 'epc.jobs.col.start')}</span>
          <span>{t(lang, 'epc.jobs.col.crew')}</span>
          <span style={{ textAlign: 'right' }}>{t(lang, 'epc.jobs.col.payout')}</span>
          <span style={{ textAlign: 'right' }}>{t(lang, 'epc.jobs.col.status')}</span>
        </div>
        {jobs.map((j, i) => {
          const tone = STATUS_TONES[j.status];
          return (
            <div key={j.id} style={{
              display: 'grid', gridTemplateColumns: '70px 1.6fr 1fr 70px 90px 90px 80px 110px', gap: 8,
              padding: '12px 16px', alignItems: 'center',
              borderBottom: i < jobs.length - 1 ? '1px solid #16161A' : 'none',
            }}>
              <span style={{ color: '#6B6B71', fontSize: 11, fontFamily: 'monospace' }}>{j.id}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
                <span style={{ color: '#EDEDEE', fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.customer}</span>
                <span style={{ color: '#6B6B71', fontSize: 11 }}>{j.addr} · {j.city}</span>
              </div>
              <span style={{ color: '#A1A1A6', fontSize: 12 }}>{j.system}</span>
              <span style={{ color: '#EDEDEE', fontSize: 12, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{j.kw > 0 ? j.kw.toFixed(1) : '—'}</span>
              <span style={{ color: '#A1A1A6', fontSize: 11 }}>{new Date(j.startAt).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { month: 'short', day: 'numeric' })}</span>
              <span style={{ color: '#A1A1A6', fontSize: 11 }}>{j.crew}</span>
              <span style={{ color: '#F59E0B', fontSize: 12, fontWeight: 600, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>${j.payout.toLocaleString('en-US')}</span>
              <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{
                  padding: '2px 8px', borderRadius: 4,
                  background: tone.bg, color: tone.fg,
                  fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
                }}>{t(lang, `epc.jobs.status.${j.status}`)}</span>
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
