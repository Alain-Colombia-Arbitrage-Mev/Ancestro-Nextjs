'use client';
import { t } from '@/i18n/translations';
import { Ic } from '@/components/dashboard/shared';
import { demoAdminAuditLog } from '@/lib/demoData';

const SEVERITY_TONES: Record<string, { bg: string; fg: string }> = {
  info:     { bg: '#16161A',   fg: '#A1A1A6' },
  warn:     { bg: '#F59E0B18', fg: '#F59E0B' },
  critical: { bg: '#E5484D18', fg: '#E5484D' },
};

export function AdminAuditView({ lang }: { lang: string }) {
  const entries = demoAdminAuditLog;
  return (
    <>
      <div className="dash-header dash-fade">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#F59E0B', fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>
            {t(lang, 'sidebar.adm.audit')}
          </span>
          <h1 style={{ color: '#EDEDEE', fontSize: 28, fontWeight: 600, letterSpacing: -0.2, margin: 0 }}>
            {t(lang, 'admin.audit.title')}
          </h1>
          <span style={{ color: '#A1A1A6', fontSize: 13 }}>{t(lang, 'admin.audit.subtitle')}</span>
        </div>
      </div>

      <div className="dash-card dash-fade-1" style={{ background: '#101013', border: '1px solid #1F1F23', borderRadius: 8, padding: 0, overflow: 'hidden' }}>
        {entries.map((e, i) => {
          const tone = SEVERITY_TONES[e.severity];
          return (
            <div key={e.id} style={{
              display: 'grid', gridTemplateColumns: '110px 1fr 1.4fr 80px',
              gap: 12, padding: '14px 18px', alignItems: 'center',
              borderBottom: i < entries.length - 1 ? '1px solid #16161A' : 'none',
            }}>
              <span style={{ color: '#6B6B71', fontSize: 11, fontFamily: 'monospace', fontVariantNumeric: 'tabular-nums' }}>
                {new Date(e.ts).toLocaleString(lang === 'es' ? 'es-ES' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
              <span style={{ color: '#A1A1A6', fontSize: 12 }}>{e.actor}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
                <span style={{ color: '#EDEDEE', fontSize: 13, fontWeight: 500, fontFamily: 'monospace' }}>{e.action}</span>
                <span style={{ color: '#A1A1A6', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.target}</span>
              </div>
              <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{
                  padding: '2px 8px', borderRadius: 4,
                  background: tone.bg, color: tone.fg,
                  fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
                }}>{e.severity}</span>
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}
