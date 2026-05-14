'use client';
import { memo, useEffect, useState } from 'react';
import './dashboard.css';

export type Role = 'affiliate' | 'epc' | 'customer';
export type EpcTab = 'dashboard' | 'earnings' | 'schedule';

export const Icons = {
  check: 'M20 6L9 17l-5-5',
  'check-in': 'M12 2v4m0 12v4M2 12h4m12 0h4M5 5l3 3M16 16l3 3M16 8l-3 3M8 16l-3 3',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  'shield-check': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4',
  bell: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',
  calendar: 'M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z M16 3v4M8 3v4M3 11h18',
  clock: 'M12 6v6l4 2 M22 12A10 10 0 1 1 12 2a10 10 0 0 1 10 10z',
  map: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  home: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  'dollar-sign': 'M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  hardhat: 'M10 10.5s3-2 7 1 M18 21a6 6 0 0 0-12 0 M2 10c0-5.5 4.5-10 10-10s10 4.5 10 10 M12 1v11',
  users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M9 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  'clipboard-list': 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z M12 11h4 M12 16h4 M8 11h.01 M8 16h.01',
  plus: 'M12 5v14M5 12h14',
  'arrow-right': 'M5 12h14M12 5l7 7-7 7',
  'chevron-down': 'M6 9l6 6 6-6',
  link: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  'bar-chart': 'M18 20V10 M12 20V4 M6 20v-6',
  'trending-up': 'M22 7l-8.5 8.5-5-5L2 17 M16 7h6v6',
  'log-out': 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  wrench: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  gift: 'M20 12v10H4V12 M2 7h20v5H2z M12 22V7 M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  copy: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M8 2h8a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z',
  'credit-card': 'M2 10h20 M2 14h20 M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z',
  percent: 'M19 5L5 19 M6.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M17.5 20a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  // Pencil sidebar icons (lucide-aligned)
  sun: 'M12 2v2 M12 20v2 M4.93 4.93l1.41 1.41 M17.66 17.66l1.41 1.41 M2 12h2 M20 12h2 M4.93 19.07l1.41-1.41 M17.66 6.34l1.41-1.41 M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  'chart-line': 'M3 3v18h18 M19 9l-5 5-4-4-3 3',
  'battery-charging': 'M14 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2 M6 6H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2 M22 11v2 M11 7l-3 5h4l-3 5',
  'file-text': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  headset: 'M3 12v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v2z M21 12v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2z M3 12a9 9 0 0 1 18 0 M21 16v1a3 3 0 0 1-3 3h-3',
  'layout-dashboard': 'M3 3h7v7H3z M14 3h7v5h-7z M14 12h7v9h-7z M3 14h7v7H3z',
  package: 'M16.5 9.4L7.55 4.24 M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12',
  briefcase: 'M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16 M22 13a13.07 13.07 0 0 1-20 0 M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  search: 'M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M21 21l-4.35-4.35',
  filter: 'M22 3H2l8 9.46V19l4 2v-8.54z',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3',
  edit: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  'chevron-right': 'M9 18l6-6-6-6',
  upload: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12',
  'arrow-up-right':   'M7 17l9.2-9.2 M7 7h10v10',
  'arrow-down-right': 'M7 7l9.2 9.2 M17 7v10H7',
};

export const Ic = ({ n, s = 24, c = 'currentColor' }: { n: keyof typeof Icons; s?: number; c?: string }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ color: c, flexShrink: 0 }}>
    <path d={Icons[n]} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Surface tokens — kept as strings for inline-style consumers; mirrored in dashboard.css :root vars.
export const glassBg   = '#101013';
export const goldGrad  = '#F59E0B';                 // single accent (was gradient)
export const goldShadow = 'none';                   // no glow

export const Card = ({ children, style, glass = false, className = '' }: { children: React.ReactNode; style?: React.CSSProperties; glass?: boolean; className?: string }) => (
  <div className={`dash-card ${className}`.trim()} style={{
    display: 'flex', flexDirection: 'column', gap: 12, padding: 20,
    background: glass ? '#101013' : '#101013', borderRadius: 8, border: '1px solid #1F1F23',
    ...style,
  }}>{children}</div>
);

export const btnP: React.CSSProperties  = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0 14px', height: 36, background: '#F59E0B', borderRadius: 8, border: '1px solid #F59E0B', cursor: 'pointer', color: '#0A0617', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' };
export const btnG: React.CSSProperties  = { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 14px', height: 36, background: 'transparent', borderRadius: 8, border: '1px solid #1F1F23', cursor: 'pointer', color: '#EDEDEE', fontSize: 13, fontWeight: 500, fontFamily: 'inherit' };
export const calBtn: React.CSSProperties = { padding: '6px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', color: '#A1A1A6', fontSize: 11, fontWeight: 500, fontFamily: 'inherit', background: 'transparent' };

export const centered: React.CSSProperties = { minHeight: '100vh', background: '#0A0A0B', display: 'flex', alignItems: 'center', justifyContent: 'center' };

export const StatCard = memo(function StatCard({
  icon, label, value, sub, sc, tone = 'glass', delta,
}: {
  icon: keyof typeof Icons; label: string; value: string; sub: string; sc?: string;
  tone?: 'glass' | 'gold'; delta?: number;
}) {
  // Single surface; primary tone is conveyed by an inset top accent stripe, not background.
  return (
    <div className="dash-card" style={{
      position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 8, padding: 16,
      background: '#101013', borderRadius: 8, border: '1px solid #1F1F23', overflow: 'hidden',
    }}>
      {tone === 'gold' && (
        <span aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: '#F59E0B' }} />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <span style={{ color: '#A1A1A6', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6 }}>{label}</span>
        <div style={{ width: 24, height: 24, borderRadius: 6, background: '#16161A', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #1F1F23' }}>
          <Ic n={icon} s={13} c="#F59E0B" />
        </div>
      </div>
      <span style={{ color: '#EDEDEE', fontSize: 26, fontWeight: 600, letterSpacing: -0.2, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {typeof delta === 'number' && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            color: delta >= 0 ? '#2BB673' : '#E5484D',
            padding: '0', fontSize: 11, fontWeight: 600, fontVariantNumeric: 'tabular-nums',
          }}>
            {delta >= 0 ? '↑' : '↓'} {Math.abs(delta).toFixed(1)}%
          </span>
        )}
        <span style={{ color: sc || '#A1A1A6', fontSize: 12, fontWeight: 500 }}>{sub}</span>
      </div>
    </div>
  );
});

export const NavItem = ({ icon, label, active, onClick }: { icon: keyof typeof Icons; label: string; active: boolean; onClick: () => void }) => (
  <button onClick={onClick} className="dash-btn" style={{
    display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px', height: 38, borderRadius: 8,
    border: active ? '1px solid #F59E0B33' : '1px solid transparent',
    background: active ? '#F59E0B14' : 'transparent',
    color: active ? '#F59E0B' : '#848E9C', fontSize: 14, fontWeight: active ? 600 : 500,
    cursor: 'pointer', fontFamily: 'inherit', width: '100%', textAlign: 'left', transition: 'all 0.15s ease',
  }}>
    <Ic n={icon} s={18} />
    {label}
  </button>
);

export interface RecentRef {
  email: string;
  amount: number;
  commission: number;
  status: string;
  created_at: string;
}
export interface Stats {
  code: string | null;
  clicks: number;
  signups: number;
  conversion: number;
  commission_total: number;
  commission_pending: number;
  commission_paid: number;
  tier: string;
  recent?: RecentRef[];
}

export function fmtMoney(n: number): string {
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

export const dash = (v: number | null | undefined, unit = '') => (v == null ? '—' : `${v}${unit}`);

/** Tailwind-style media query hook. Returns true once mounted if the document matches. */
export function useMediaQuery(query: string): boolean {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(query);
    const handler = () => setMatch(mql.matches);
    handler();
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);
  return match;
}

/** Rectangular shimmer placeholder shown while async data is loading. */
export const Skeleton = ({ w = '100%', h = 18, r = 6, style }: { w?: number | string; h?: number | string; r?: number; style?: React.CSSProperties }) => (
  <div className="dash-skeleton" style={{ width: w, height: h, borderRadius: r, ...style }} />
);
