'use client';
import { t } from '@/i18n/translations';
import { Ic, fmtMoney } from '@/components/dashboard/shared';
import { demoAdminCommissions, demoAdminCommissionsList } from '@/lib/demoData';

export function AdminCommissionsView({ lang }: { lang: string }) {
  const rows = demoAdminCommissionsList;
  const totals = demoAdminCommissions;

  return (
    <>
      <div className="dash-header dash-fade">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#F59E0B', fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>
            {t(lang, 'sidebar.adm.commissions')}
          </span>
          <h1 style={{ color: '#EDEDEE', fontSize: 28, fontWeight: 600, letterSpacing: -0.2, margin: 0 }}>
            {t(lang, 'admin.comm.title')}
          </h1>
          <span style={{ color: '#A1A1A6', fontSize: 13 }}>{rows.length} {t(lang, 'admin.comm.recent')}</span>
        </div>
      </div>

      <div className="dash-grid-3col dash-fade-1">
        <Kpi label={t(lang, 'admin.overview.commissionsTitle')} value={fmtMoney(totals.paidYtd)}   sub={`+${totals.growthPct}% YoY`}                accent="#F59E0B" />
        <Kpi label={t(lang, 'admin.overview.thisMonth')}        value={fmtMoney(totals.thisMonth)} sub={t(lang, 'admin.comm.alreadyPaid')}          accent="#2BB673" />
        <Kpi label={t(lang, 'admin.overview.pending')}          value={fmtMoney(totals.pending)}   sub={t(lang, 'admin.comm.awaitingPayout')}       accent="#A78BFA" />
      </div>

      <div className="dash-card dash-fade-2" style={{ background: '#101013', border: '1px solid #1F1F23', borderRadius: 8, padding: 0, overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '90px 1.4fr 1.4fr 90px 60px 90px 80px',
          gap: 8, padding: '12px 16px', borderBottom: '1px solid #1F1F23',
          color: '#A1A1A6', fontSize: 10, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase',
        }}>
          <span>{t(lang, 'admin.comm.col.date')}</span>
          <span>{t(lang, 'admin.comm.col.referrer')}</span>
          <span>{t(lang, 'admin.comm.col.referred')}</span>
          <span style={{ textAlign: 'right' }}>{t(lang, 'admin.comm.col.deal')}</span>
          <span style={{ textAlign: 'right' }}>%</span>
          <span style={{ textAlign: 'right' }}>{t(lang, 'admin.comm.col.payout')}</span>
          <span style={{ textAlign: 'right' }}>{t(lang, 'admin.comm.col.status')}</span>
        </div>
        {rows.map((row, i) => (
          <div key={row.id} style={{
            display: 'grid', gridTemplateColumns: '90px 1.4fr 1.4fr 90px 60px 90px 80px', gap: 8,
            padding: '12px 16px', alignItems: 'center',
            borderBottom: i < rows.length - 1 ? '1px solid #16161A' : 'none',
          }}>
            <span style={{ color: '#6B6B71', fontSize: 11 }}>{new Date(row.date).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { month: 'short', day: 'numeric' })}</span>
            <span style={{ color: '#EDEDEE', fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.referrer}</span>
            <span style={{ color: '#A1A1A6', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.referred}</span>
            <span style={{ color: '#EDEDEE', fontSize: 12, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>${row.amount.toLocaleString('en-US')}</span>
            <span style={{ color: '#A1A1A6', fontSize: 12, textAlign: 'right' }}>{row.pct}%</span>
            <span style={{ color: '#F59E0B', fontSize: 13, fontWeight: 600, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>${row.commission.toLocaleString('en-US')}</span>
            <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <span style={{
                padding: '2px 8px', borderRadius: 4,
                background: row.status === 'paid' ? '#2BB67318' : '#FBBF2418',
                color: row.status === 'paid' ? '#2BB673' : '#FBBF24',
                fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
              }}>{row.status}</span>
            </span>
          </div>
        ))}
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
