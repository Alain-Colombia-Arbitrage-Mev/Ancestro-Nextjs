'use client';
import { t } from '@/i18n/translations';
import { Ic } from '../shared';

export interface InvestorProjectRow {
  time: string;
  period?: string;
  tag?: 'IN PROGRESS' | 'UPCOMING' | 'COMPLETED';
  customer: string;
  system: string;
  addr?: string;
  amount?: string;
  active?: boolean;
}

interface Props {
  lang: string;
  rows: InvestorProjectRow[];
  title?: string;
}

const TAG_COLORS: Record<string, { bg: string; fg: string }> = {
  'IN PROGRESS': { bg: '#F59E0B',  fg: '#0A0617' },
  'UPCOMING':    { bg: '#A78BFA20', fg: '#A78BFA' },
  'COMPLETED':   { bg: '#02C07618', fg: '#02C076' },
};

export function InvestorProjectsList({ lang, rows, title }: Props) {
  return (
    <div className="dash-card dash-fade-1" style={{
      display: 'flex', flexDirection: 'column',
      background: '#0E0E10', border: '1px solid #1A1A1A', borderRadius: 18,
      overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64, padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Ic n="briefcase" s={18} c="#F59E0B" />
          <span style={{ color: '#5E6673', fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>
            {(title || t(lang, 'inv.projects.title')).toUpperCase()}
          </span>
        </div>
        <span style={{ color: '#F59E0B', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
          {t(lang, 'inv.projects.viewAll')} {rows.length} →
        </span>
      </div>
      <div style={{ height: 1, background: '#1A1A1A' }} />

      {rows.length === 0 && (
        <div style={{ padding: 32, color: '#5E6673', fontSize: 13, textAlign: 'center' }}>
          {t(lang, 'inv.projects.empty')}
        </div>
      )}

      {rows.map((r, i) => {
        const tagStyle = r.tag ? TAG_COLORS[r.tag] : undefined;
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '20px 24px',
            background: r.active ? '#FBBF2410' : 'transparent',
            borderBottom: i < rows.length - 1 ? '1px solid #0A0A0A' : 'none',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: 60 }}>
              <span style={{ color: r.active ? '#F59E0B' : '#F5F3FF', fontSize: 18, fontWeight: 800 }}>{r.time}</span>
              {r.period && <span style={{ color: r.active ? '#F59E0B' : '#5E6673', fontSize: 11, fontWeight: 700 }}>{r.period}</span>}
            </div>
            <div style={{ width: 1, height: 60, background: r.active ? '#F59E0B40' : '#1A1A1A' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {r.tag && tagStyle && (
                <span style={{
                  display: 'inline-flex', alignSelf: 'flex-start',
                  padding: '0 8px', height: 20, alignItems: 'center', borderRadius: 5,
                  background: tagStyle.bg, color: tagStyle.fg,
                  fontSize: 10, fontWeight: 800, letterSpacing: 1,
                }}>{r.tag}</span>
              )}
              <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 800 }}>
                {r.customer} · <span style={{ fontWeight: 600 }}>{r.system}</span>
              </span>
              {r.addr && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Ic n="map" s={12} c="#5E6673" />
                  <span style={{ color: '#848E9C', fontSize: 12 }}>{r.addr}</span>
                  {r.amount && (<>
                    <span style={{ color: '#5E6673' }}>·</span>
                    <span style={{ color: '#F59E0B', fontSize: 12, fontWeight: 700 }}>{r.amount}</span>
                  </>)}
                </div>
              )}
            </div>
            <button className="dash-btn" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '0 16px', height: 38, borderRadius: 9,
              border: r.active ? 'none' : '1px solid #1A1A1A',
              background: r.active ? '#F59E0B' : '#0A0A0A',
              color: r.active ? '#0A0617' : '#F5F3FF',
              fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              {r.active ? <><Ic n="arrow-right" s={12} /> {t(lang, 'inv.projects.navigate')}</> : t(lang, 'inv.projects.details')}
            </button>
          </div>
        );
      })}
    </div>
  );
}
