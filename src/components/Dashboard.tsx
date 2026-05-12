'use client';
import { useState, memo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { t } from '@/i18n/translations';
import { useAuth } from '@/lib/auth-context';
import { isAdminEmail } from '@/lib/admin';
import { CDN_URL } from '@/lib/cdn';

type Role = 'affiliate' | 'epc' | 'customer';
type EpcTab = 'dashboard' | 'earnings' | 'schedule';

const Icons = {
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
};

const Ic = ({ n, s = 24, c = 'currentColor' }: { n: keyof typeof Icons; s?: number; c?: string }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ color: c, flexShrink: 0 }}>
    <path d={Icons[n]} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Design tokens extracted from Pencil "dashboardancestro"
const glassBg = 'linear-gradient(135deg, #FFFFFF08 0%, #FFFFFF03 100%)';
const goldGrad = 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)';
const goldShadow = '0 6px 20px rgba(251,191,36,0.25)';

const Card = ({ children, style, glass = false }: { children: React.ReactNode; style?: React.CSSProperties; glass?: boolean }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', gap: 14, padding: 24,
    background: glass ? glassBg : '#0E0E10', borderRadius: 18, border: '1px solid #1A1A1A',
    ...style,
  }}>{children}</div>
);
const btnP: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 6, padding: '0 18px', height: 40, background: goldGrad, borderRadius: 10, border: 'none', cursor: 'pointer', color: '#0A0617', fontSize: 14, fontWeight: 700, fontFamily: 'inherit', boxShadow: goldShadow };
const btnG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 8, padding: '0 18px', height: 40, background: '#02C076', borderRadius: 10, border: 'none', cursor: 'pointer', color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: 'inherit' };
const calBtn: React.CSSProperties = { padding: '6px 10px', borderRadius: 7, border: 'none', cursor: 'pointer', color: '#848E9C', fontSize: 11, fontWeight: 600, fontFamily: 'inherit', background: 'transparent' };
const monthImages = [60, 75, 85, 65, 80, 95];

const StatCard = memo(function StatCard({
  icon, label, value, sub, sc, tone = 'glass', delta,
}: {
  icon: keyof typeof Icons; label: string; value: string; sub: string; sc?: string;
  tone?: 'glass' | 'gold'; delta?: number;
}) {
  const bg = tone === 'gold' ? '#12100B' : glassBg;
  const borderColor = tone === 'gold' ? '#2A2218' : '#1A1A1A';
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', gap: 8, padding: 20,
      background: bg, borderRadius: 18, border: `1px solid ${borderColor}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <span style={{ color: '#848E9C', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2 }}>{label}</span>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: tone === 'gold' ? '#FBBF2418' : '#FFFFFF06', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #FFFFFF0A' }}>
          <Ic n={icon} s={14} c={tone === 'gold' ? '#FBBF24' : '#F59E0B'} />
        </div>
      </div>
      <span style={{ color: '#F5F3FF', fontSize: 32, fontWeight: 800, letterSpacing: -0.5 }}>{value}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {typeof delta === 'number' && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            color: delta >= 0 ? '#34D399' : '#F87171',
            background: delta >= 0 ? '#10B98115' : '#EF444415',
            border: `1px solid ${delta >= 0 ? '#10B98130' : '#EF444430'}`,
            padding: '2px 7px', borderRadius: 6, fontSize: 11, fontWeight: 700,
          }}>
            {delta >= 0 ? '↑' : '↓'} {Math.abs(delta).toFixed(1)}%
          </span>
        )}
        <span style={{ color: sc || '#848E9C', fontSize: 12, fontWeight: 600 }}>{sub}</span>
      </div>
    </div>
  );
});

const NavItem = ({ icon, label, active, onClick }: { icon: keyof typeof Icons; label: string; active: boolean; onClick: () => void }) => (
  <button onClick={onClick} style={{
    display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', height: 42, borderRadius: 10,
    border: active ? '1px solid #F59E0B40' : '1px solid transparent',
    background: active ? '#F59E0B10' : 'transparent',
    color: active ? '#F59E0B' : '#848E9C', fontSize: 14, fontWeight: active ? 600 : 500,
    cursor: 'pointer', fontFamily: 'inherit', width: '100%', textAlign: 'left', transition: 'all 0.15s ease',
  }}>
    <Ic n={icon} s={18} />
    {label}
  </button>
);

// ═══════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════
export default function Dashboard({ lang }: { lang: string }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<Role>('affiliate');
  const [epcTab, setEpcTab] = useState<EpcTab>('dashboard');

  useEffect(() => {
    if (user?.role) {
      const m = user.role === 'installer' ? 'epc' : user.role === 'investor' ? 'affiliate' : 'customer';
      setRole(m as Role);
    }
  }, [user?.role]);

  if (isLoading) return <div style={centered}><span style={{ color: '#848E9C', fontSize: 16 }}>{t(lang, 'auth.loading')}</span></div>;
  if (!user) {
    return (
      <div style={{ ...centered, flexDirection: 'column', gap: 20 }}>
        <Ic n="shield" s={64} c="#F59E0B" />
        <h2 style={{ color: '#EAECEF', fontSize: 24, fontWeight: 800, margin: 0 }}>{t(lang, 'auth.required')}</h2>
        <p style={{ color: '#848E9C', fontSize: 14, margin: 0 }}>{t(lang, 'auth.requiredDesc')}</p>
        <button onClick={() => router.push(`/${lang}/login`)} style={btnP}>{t(lang, 'auth.login')}</button>
      </div>
    );
  }

  const userRole: Role = user.role === 'installer' ? 'epc' : user.role === 'investor' ? 'affiliate' : 'customer';
  const isAdmin = isAdminEmail(user.email);
  // Lock viewable roles to the user's assigned one; admins can preview all roles.
  const allowedRoles: Role[] = isAdmin ? ['affiliate', 'epc', 'customer'] : [userRole];
  const activeRole: Role = allowedRoles.includes(role) ? role : userRole;

  const allSidebarItems: { role: Role; icon: keyof typeof Icons; label: string }[] = [
    { role: 'affiliate', icon: 'link', label: t(lang, 'dashboard.roles.affiliate') },
    { role: 'epc', icon: 'hardhat', label: t(lang, 'dashboard.roles.epc') },
    { role: 'customer', icon: 'home', label: t(lang, 'dashboard.roles.customer') },
  ];
  const sidebarItems = allSidebarItems.filter(item => allowedRoles.includes(item.role));

  const epcNavItems: { id: EpcTab; icon: keyof typeof Icons; label: string }[] = [
    { id: 'dashboard', icon: 'home', label: t(lang, 'epc.nav.dashboard') },
    { id: 'earnings', icon: 'dollar-sign', label: t(lang, 'epc.nav.earnings') },
    { id: 'schedule', icon: 'calendar', label: t(lang, 'epc.nav.schedule') },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex' }}>
      {/* ═══ SIDEBAR ═══ */}
      <div style={{
        position: 'fixed', left: 0, top: 0, bottom: 0, width: 240, zIndex: 50,
        background: '#0A0A0A', borderRight: '1px solid #1A1A1A',
        display: 'flex', flexDirection: 'column', padding: '28px 16px', gap: 0,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 28, paddingLeft: 12 }}>
          <img src={`${CDN_URL}/logo.svg`} alt="Ancestro" style={{ height: 36, width: 'auto', objectFit: 'contain' }} />
          <span style={{ color: '#848E9C', fontSize: 10, fontWeight: 600, marginLeft: 4, letterSpacing: 0.5, textTransform: 'uppercase' }}>{t(lang, 'dashboard.sidebar.title')}</span>
        </div>

        {/* Role selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 20 }}>
          <span style={{ color: '#5E6673', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', padding: '0 16px', marginBottom: 6 }}>
            {t(lang, 'dashboard.sidebar.role')}{isAdmin && <span style={{ color: '#F59E0B', marginLeft: 6 }}>· ADMIN</span>}
          </span>
          {sidebarItems.map(item => (
            <NavItem key={item.role} icon={item.icon} label={item.label} active={activeRole === item.role} onClick={() => setRole(item.role)} />
          ))}
        </div>

        <div style={{ height: 1, background: '#1A1A1A', margin: '0 12px 20px' }} />

        {/* Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          <span style={{ color: '#5E6673', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', padding: '0 16px', marginBottom: 6 }}>{t(lang, 'dashboard.sidebar.nav')}</span>
          {activeRole === 'epc' && epcNavItems.map(item => (
            <NavItem key={item.id} icon={item.icon} label={item.label} active={epcTab === item.id} onClick={() => setEpcTab(item.id)} />
          ))}
          {activeRole === 'affiliate' && (
            <NavItem icon="link" label={t(lang, 'dashboard.affiliate.referrals')} active onClick={() => {}} />
          )}
          {activeRole === 'customer' && (
            <NavItem icon="home" label={t(lang, 'dashboard.customer.title')} active onClick={() => {}} />
          )}
        </div>

        {/* User info + logout */}
        <div style={{ borderTop: '1px solid #1A1A1A', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 12px' }}>
            <div style={{ width: 32, height: 32, borderRadius: 16, background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A0617', fontSize: 13, fontWeight: 800 }}>
              {(user.name || 'U')[0].toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, overflow: 'hidden' }}>
              <span style={{ color: '#EAECEF', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</span>
              <span style={{ color: '#5E6673', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</span>
            </div>
          </div>
          <button onClick={logout} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 8,
            border: '1px solid #1A1A1A', background: 'transparent',
            color: '#848E9C', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            <Ic n="log-out" s={14} />
            {t(lang, 'auth.logout')}
          </button>
        </div>

        {/* EPC badge */}
        {activeRole === 'epc' && (
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6, padding: 14, background: '#0A0A0A', borderRadius: 12, border: '1px solid #1A1A1A' }}>
            <Ic n="shield" s={18} c="#02C076" />
            <span style={{ color: '#02C076', fontSize: 12, fontWeight: 700 }}>{t(lang, 'epc.sidebar.certified')}</span>
            <span style={{ color: '#848E9C', fontSize: 10 }}>{t(lang, 'epc.sidebar.license')}</span>
          </div>
        )}
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <div style={{ flex: 1, marginLeft: 240, padding: '32px 40px 64px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {activeRole === 'affiliate' && <AffiliateView lang={lang} user={user} />}
        {activeRole === 'epc' && (
          <>
            {epcTab === 'dashboard' && <EpcDashboardView lang={lang} />}
            {epcTab === 'earnings' && <EpcEarningsView lang={lang} />}
            {epcTab === 'schedule' && <EpcScheduleView lang={lang} />}
          </>
        )}
        {activeRole === 'customer' && <CustomerView lang={lang} user={user} />}
      </div>
    </div>
  );
}

const centered: React.CSSProperties = { minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' };

// ═══════════════════════════════════════════════════════
// AFFILIATE VIEW
// ═══════════════════════════════════════════════════════
interface RecentRef {
  email: string;
  amount: number;
  commission: number;
  status: string;
  created_at: string;
}
interface Stats {
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

function fmtMoney(n: number): string {
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

type Tab = 'overview' | 'referrals' | 'earnings' | 'reports';

function AffiliateView({ lang, user }: { lang: string; user: { name: string; email: string; id?: string } }) {
  const [copied, setCopied] = useState(false);
  const [refCode, setRefCode] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [tab, setTab] = useState<Tab>('overview');
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const refUrl = refCode ? `${origin}/${lang}/r/${refCode}` : '';
  const firstName = (user.name || user.email).split(/\s+|@/)[0];

  useEffect(() => {
    let cancelled = false;
    const userId = user.id || user.email;
    const proposed = `${(user.email.split('@')[0]).substring(0, 8)}-${Math.floor(Math.random() * 9000) + 1000}`;

    (async () => {
      try {
        const createRes = await fetch('/api/referrals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId, code: proposed, action: 'create',
            user_email: user.email, user_name: user.name,
          }),
        });
        const link = createRes.ok ? await createRes.json() : null;
        if (!cancelled && link?.code) setRefCode(link.code);

        const statsRes = await fetch(`/api/referrals/stats?user_id=${encodeURIComponent(userId)}`);
        if (statsRes.ok) {
          const s = await statsRes.json();
          if (!cancelled) setStats(s);
        }
      } catch {
        /* ignore */
      }
    })();
    return () => { cancelled = true; };
  }, [user.email, user.id, user.name]);

  const tiers: Record<string, string> = { Platinum: '#A78BFA', Gold: '#F59E0B', Silver: '#848E9C', Bronze: '#CD7F32' };
  const tierColor = tiers[stats?.tier ?? 'Bronze'];

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: t(lang, 'dashboard.tabs.overview') },
    { id: 'referrals', label: t(lang, 'dashboard.tabs.referrals') },
    { id: 'earnings', label: t(lang, 'dashboard.tabs.earnings') },
    { id: 'reports', label: t(lang, 'dashboard.tabs.reports') },
  ];

  function doCopy() {
    if (!refUrl) return;
    navigator.clipboard.writeText(refUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <>
      {/* ═══ HEADER ═══ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#848E9C', fontSize: 13, fontWeight: 500 }}>{t(lang, 'dashboard.affiliate.welcome')}</span>
          <h1 style={{ color: '#F5F3FF', fontSize: 32, fontWeight: 800, letterSpacing: -0.5, margin: 0 }}>
            {firstName} <span style={{ color: '#FBBF24' }}>👋</span>
          </h1>
          <span style={{ color: '#5E6673', fontSize: 13 }}>{t(lang, 'dashboard.affiliate.subtitleNew')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 44, padding: '0 16px', background: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: 22, color: '#5E6673', fontSize: 13 }}>
            <Ic n="link" s={14} c="#5E6673" />
            <span>{t(lang, 'dashboard.search')}</span>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: '#0A0A0A', border: '1px solid #1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <Ic n="bell" s={18} c="#A1A1AA" />
            <span style={{ position: 'absolute', top: 10, right: 12, width: 8, height: 8, borderRadius: 4, background: '#F59E0B' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 42, padding: '2px 14px 2px 2px', background: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: 22 }}>
            <div style={{ width: 38, height: 38, borderRadius: 19, background: goldGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A0617', fontSize: 14, fontWeight: 800 }}>
              {firstName[0]?.toUpperCase()}
            </div>
            <span style={{ color: '#F5F3FF', fontSize: 13, fontWeight: 600 }}>{firstName}</span>
          </div>
        </div>
      </div>

      {/* ═══ QUICK ACTIONS BAR ═══ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 40, padding: '0 4px', background: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: 10 }}>
          {tabs.map(tt => (
            <button key={tt.id} onClick={() => setTab(tt.id)} style={{
              height: 32, padding: '0 16px', borderRadius: 8, border: 'none', fontFamily: 'inherit',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              background: tab === tt.id ? '#F59E0B' : 'transparent',
              color: tab === tt.id ? '#0A0617' : '#848E9C',
            }}>{tt.label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 14px', background: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: 10, color: '#A1A1AA', fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' }}>
            <Ic n="calendar" s={14} c="#A1A1AA" /> {t(lang, 'dashboard.range')}
            <Ic n="chevron-down" s={12} c="#5E6673" />
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 14px', background: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: 10, color: '#A1A1AA', fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' }}>
            <Ic n="arrow-right" s={14} c="#A1A1AA" /> {t(lang, 'dashboard.export')}
          </button>
          <button onClick={doCopy} style={{ ...btnP, height: 40 }}>
            <Ic n="copy" s={14} /> {copied ? t(lang, 'dashboard.affiliate.copied') : t(lang, 'dashboard.affiliate.showLink')}
          </button>
        </div>
      </div>

      {/* ═══ STATS ROW ═══ */}
      <div style={{ display: 'flex', gap: 16 }}>
        <StatCard icon="link" label={t(lang, 'dashboard.affiliate.clicks')} value={(stats?.clicks ?? 0).toLocaleString('en-US')} sub={t(lang, 'dashboard.affiliate.clicksSub')} delta={18} />
        <StatCard icon="users" label={t(lang, 'dashboard.affiliate.signups')} value={(stats?.signups ?? 0).toLocaleString('en-US')} sub={`${(stats?.conversion ?? 0)}% ${t(lang, 'dashboard.affiliate.conversion').toLowerCase()}`} delta={12} />
        <StatCard icon="star" label={t(lang, 'dashboard.affiliate.salesShort')} value={(stats?.recent?.filter(r => r.status === 'paid').length ?? 0).toLocaleString('en-US')} sub={t(lang, 'dashboard.affiliate.closed')} delta={8} />
        <StatCard icon="dollar-sign" label={t(lang, 'dashboard.affiliate.totalEarnings')} value={fmtMoney(stats?.commission_total ?? 0)} sub={t(lang, 'dashboard.affiliate.commissionsSub')} delta={22} tone="gold" />
      </div>

      {/* ═══ MAIN 3-COL ROW ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr 260px', gap: 16 }}>
        {/* Referral share card */}
        <Card glass style={{ gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ color: '#5E6673', fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>{t(lang, 'dashboard.affiliate.linkLabel').toUpperCase()}</span>
            <span style={{ color: '#F5F3FF', fontSize: 18, fontWeight: 700 }}>{t(lang, 'dashboard.affiliate.share')}</span>
            <span style={{ color: '#848E9C', fontSize: 13 }}>{t(lang, 'dashboard.affiliate.shareSub')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', height: 54, background: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: 12 }}>
            <Ic n="link" s={16} c="#F59E0B" />
            <span style={{ color: '#F5F3FF', fontSize: 13, fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{refUrl || '...'}</span>
            <button disabled={!refUrl} onClick={doCopy} style={{ background: 'transparent', border: 'none', color: '#A1A1AA', cursor: refUrl ? 'pointer' : 'default', padding: 4, display: 'flex' }}>
              <Ic n="copy" s={16} c="#A1A1AA" />
            </button>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={doCopy} disabled={!refUrl} style={{ ...btnP, flex: 1, height: 48, justifyContent: 'center', opacity: refUrl ? 1 : 0.5 }}>
              <Ic n="copy" s={14} /> {copied ? t(lang, 'dashboard.affiliate.copied') : t(lang, 'dashboard.affiliate.copyLink')}
            </button>
            <button style={{ flex: 1, height: 48, background: '#0A0A0A', border: '1.5px solid #02C07680', borderRadius: 12, color: '#02C076', fontSize: 14, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Ic n="arrow-right" s={14} /> {t(lang, 'dashboard.affiliate.shareBtn')}
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#848E9C', fontSize: 12 }}>
            <Ic n="shield-check" s={14} c="#5E6673" /> {t(lang, 'dashboard.affiliate.activeIn')}
          </div>
        </Card>

        {/* Chart card */}
        <Card glass style={{ gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ color: '#5E6673', fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>{t(lang, 'dashboard.affiliate.perf')}</span>
              <span style={{ color: '#F5F3FF', fontSize: 18, fontWeight: 700 }}>{t(lang, 'dashboard.affiliate.conversionsVsClicks')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px', height: 32, background: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: 8 }}>
              <span style={{ color: '#F5F3FF', fontSize: 12, fontWeight: 600 }}>{t(lang, 'dashboard.affiliate.last30')}</span>
              <Ic n="chevron-down" s={12} c="#A1A1AA" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, paddingLeft: 4 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#848E9C', fontSize: 12 }}>
              <span style={{ width: 14, height: 3, background: '#F59E0B', borderRadius: 2 }} /> {t(lang, 'dashboard.affiliate.conversionsLegend')}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#848E9C', fontSize: 12 }}>
              <span style={{ width: 14, height: 3, background: '#02C076', borderRadius: 2 }} /> {t(lang, 'dashboard.affiliate.clicks')}
            </span>
          </div>
          <SparkChart clicks={stats?.clicks ?? 0} signups={stats?.signups ?? 0} />
        </Card>

        {/* Top affiliates / mini leaderboard */}
        <Card glass style={{ gap: 12, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 700 }}>{t(lang, 'dashboard.affiliate.topAffiliates')}</span>
            <a href={`/${lang}/leaderboard`} style={{ color: '#F59E0B', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>{t(lang, 'dashboard.affiliate.viewAll')}</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['Sara', 'Marcus', 'Priya', 'Alex', 'Maria'].map((n, i) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, borderRadius: 8 }}>
                <span style={{ color: '#5E6673', fontSize: 12, fontWeight: 700, width: 18 }}>#{i + 1}</span>
                <div style={{ width: 24, height: 24, borderRadius: 12, background: '#FBBF2420', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B', fontSize: 11, fontWeight: 800 }}>{n[0]}</div>
                <span style={{ color: '#F5F3FF', fontSize: 12, fontWeight: 600, flex: 1 }}>{n}</span>
                <span style={{ color: '#A1A1AA', fontSize: 11, fontWeight: 700 }}>{(48 - i * 8)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, borderRadius: 10, background: '#F59E0B18', border: '1px solid #F59E0B40' }}>
              <span style={{ color: '#F59E0B', fontSize: 12, fontWeight: 800, width: 18 }}>#12</span>
              <div style={{ width: 24, height: 24, borderRadius: 12, background: goldGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A0617', fontSize: 11, fontWeight: 800 }}>{firstName[0]?.toUpperCase()}</div>
              <span style={{ color: '#F59E0B', fontSize: 12, fontWeight: 700, flex: 1 }}>{t(lang, 'dashboard.affiliate.you')}</span>
              <span style={{ color: '#F59E0B', fontSize: 11, fontWeight: 800 }}>{stats?.signups ?? 0}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* ═══ BOTTOM ROW: earnings + payout + tier ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 264px 240px', gap: 16, alignItems: 'stretch' }}>
        {/* Earnings breakdown */}
        <Card style={{ gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ color: '#F5F3FF', fontSize: 16, fontWeight: 800 }}>{t(lang, 'dashboard.affiliate.earningsBreakdown')}</span>
              <span style={{ color: '#5E6673', fontSize: 12 }}>{t(lang, 'dashboard.affiliate.lifetime')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px', height: 32, background: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: 8, color: '#A1A1AA', fontSize: 12, fontWeight: 600 }}>
              {t(lang, 'dashboard.affiliate.manage')} <Ic n="chevron-down" s={12} c="#5E6673" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 96, padding: '0 18px', background: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ color: '#5E6673', fontSize: 11, fontWeight: 700, letterSpacing: 1.2 }}>{t(lang, 'dashboard.affiliate.pending').toUpperCase()}</span>
                <span style={{ color: '#F5F3FF', fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>{fmtMoney(stats?.commission_pending ?? 0)}</span>
              </div>
              <Ic n="clock" s={28} c="#F59E0B" />
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 96, padding: '0 18px', background: '#0A0A0A', border: '1px solid #02C07640', borderRadius: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ color: '#02C076', fontSize: 11, fontWeight: 700, letterSpacing: 1.2 }}>{t(lang, 'dashboard.affiliate.paid').toUpperCase()}</span>
                <span style={{ color: '#F5F3FF', fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>{fmtMoney(stats?.commission_paid ?? 0)}</span>
              </div>
              <Ic n="check" s={28} c="#02C076" />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ color: '#5E6673', fontSize: 11 }}>{t(lang, 'dashboard.affiliate.avg')}</span>
              <span style={{ color: '#F5F3FF', fontSize: 18, fontWeight: 800 }}>{fmtMoney((stats?.commission_total ?? 0) / Math.max(stats?.signups ?? 1, 1))}</span>
            </div>
            <button style={{ ...btnG, height: 40 }}>{t(lang, 'dashboard.affiliate.requestPayout')}</button>
          </div>
        </Card>

        {/* Next payout + Payout method stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 20, background: 'linear-gradient(135deg, #10B98115 0%, #10B98105 100%)', border: '1px solid #02C07640', borderRadius: 18 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#02C076', fontSize: 10, fontWeight: 700, letterSpacing: 1.2 }}>
              <Ic n="calendar" s={14} c="#02C076" /> {t(lang, 'dashboard.affiliate.nextPayout').toUpperCase()}
            </span>
            <span style={{ color: '#F5F3FF', fontSize: 22, fontWeight: 800, letterSpacing: -0.3 }}>{t(lang, 'dashboard.affiliate.payoutDate')}</span>
            <span style={{ color: '#848E9C', fontSize: 12 }}>{t(lang, 'dashboard.affiliate.payoutSub')}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 20, background: glassBg, border: '1px solid #1A1A1A', borderRadius: 18 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#5E6673', fontSize: 10, fontWeight: 700, letterSpacing: 1.2 }}>
              <Ic n="credit-card" s={14} c="#A78BFA" /> {t(lang, 'dashboard.affiliate.payoutMethod').toUpperCase()}
            </span>
            <span style={{ color: '#F5F3FF', fontSize: 22, fontWeight: 800 }}>•••• 4242</span>
            <span style={{ color: '#848E9C', fontSize: 12 }}>{t(lang, 'dashboard.affiliate.wireUsd')}</span>
          </div>
        </div>

        {/* Progress + Tier */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 18, background: glassBg, border: '1px solid #1A1A1A', borderRadius: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ color: '#5E6673', fontSize: 10, fontWeight: 700, letterSpacing: 1.2 }}>{t(lang, 'dashboard.affiliate.rank').toUpperCase()}</span>
                <span style={{ color: '#F5F3FF', fontSize: 20, fontWeight: 800 }}>#12</span>
              </div>
              <span style={{ color: '#02C076', fontSize: 12, fontWeight: 700 }}>↑ 3</span>
            </div>
            <span style={{ color: '#5E6673', fontSize: 11 }}>{t(lang, 'dashboard.affiliate.outOfPre')} 1,248 {t(lang, 'dashboard.affiliate.outOfPost')}</span>
            <div style={{ width: '100%', height: 6, background: '#0A0A0A', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: '70%', height: '100%', background: goldGrad, borderRadius: 3 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#848E9C', fontSize: 11, fontWeight: 600 }}>{t(lang, 'dashboard.affiliate.nextMilestone')}</span>
              <span style={{ color: '#F59E0B', fontSize: 11, fontWeight: 700 }}>7/10</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 18, background: 'linear-gradient(135deg, #FBBF2425 0%, #F59E0B15 100%)', border: '1.5px solid #F59E0B60', borderRadius: 18 }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, background: goldGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A0617', fontSize: 24, fontWeight: 800, flexShrink: 0 }}>3×</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
              <span style={{ color: '#F59E0B', fontSize: 10, fontWeight: 700, letterSpacing: 1.2 }}>{t(lang, 'dashboard.affiliate.tier').toUpperCase()}</span>
              <span style={{ color: '#F5F3FF', fontSize: 18, fontWeight: 800 }}>{stats?.tier ?? 'Bronze'}</span>
              <span style={{ color: '#848E9C', fontSize: 11 }}>3× {t(lang, 'dashboard.affiliate.commission').toLowerCase()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ RECENT REFERRALS ═══ */}
      <Card style={{ background: glassBg }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#F5F3FF', fontSize: 16, fontWeight: 800 }}>{t(lang, 'dashboard.affiliate.referrals')}</span>
          <span style={{ color: '#F59E0B', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{t(lang, 'dashboard.affiliate.viewAll')}</span>
        </div>
        <div style={{ height: 1, background: '#1A1A1A' }} />
        {(stats?.recent ?? []).length === 0 && (
          <div style={{ padding: 24, color: '#5E6673', fontSize: 13, textAlign: 'center' }}>{t(lang, 'dashboard.affiliate.empty')}</div>
        )}
        {(stats?.recent ?? []).map((r, i, arr) => {
          const date = new Date(r.created_at).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { month: 'short', day: 'numeric' });
          const initial = (r.email || '?')[0].toUpperCase();
          const statusColor = r.status === 'paid' ? '#02C076' : r.status === 'pending' ? '#F59E0B' : '#848E9C';
          return (
            <div key={i}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 56, padding: '0 8px' }}>
                <div style={{ width: 32, height: 32, borderRadius: 16, background: '#FBBF2420', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B', fontSize: 13, fontWeight: 800 }}>{initial}</div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 600 }}>{r.email}</span>
                  <span style={{ color: '#5E6673', fontSize: 11 }}>{date} · <span style={{ color: statusColor }}>{r.status}</span></span>
                </div>
                <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 800, width: 100, textAlign: 'right' }}>{fmtMoney(r.commission)}</span>
              </div>
              {i < arr.length - 1 && <div style={{ height: 1, background: '#0A0A0A' }} />}
            </div>
          );
        })}
      </Card>
    </>
  );
}

// Small SVG line chart (clicks + signups split into 14 buckets, rendered as smooth lines)
function SparkChart({ clicks, signups }: { clicks: number; signups: number }) {
  const N = 14, W = 480, H = 160;
  const seedA = clicks || 100;
  const seedB = signups || 25;
  const pts = (seed: number) => Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    const wave = Math.sin(i * 1.1 + seed * 0.001) * 0.18 + 0.55 + t * 0.35;
    return Math.max(0.05, Math.min(0.95, wave + (Math.sin(i * 2.3) * 0.05)));
  });
  const a = pts(seedA), b = pts(seedB);
  const toPath = (arr: number[]) => arr.map((v, i) => {
    const x = (i / (N - 1)) * W;
    const y = H - v * H;
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
  return (
    <div style={{ width: '100%', height: 160, position: 'relative' }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" width="100%" height={H} style={{ display: 'block' }}>
        {[0.2, 0.4, 0.6, 0.8].map((p, i) => (
          <line key={i} x1={0} x2={W} y1={H * p} y2={H * p} stroke="#FFFFFF08" strokeWidth={1} />
        ))}
        <path d={toPath(b)} stroke="#02C076" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={toPath(a)} stroke="#F59E0B" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={W} cy={H - a[N - 1] * H} r={6} fill="#F59E0B" stroke="#0A0A0A" strokeWidth={2} />
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// CUSTOMER VIEW
// ═══════════════════════════════════════════════════════
function CustomerView({ lang, user }: { lang: string; user: { name: string; email: string; id?: string } }) {
  const [refCode, setRefCode] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const refUrl = refCode ? `${origin}/${lang}/r/${refCode}` : '';

  useEffect(() => {
    let cancelled = false;
    const userId = user.id || user.email;
    const proposed = `${(user.email.split('@')[0]).substring(0, 8)}-${Math.floor(Math.random() * 9000) + 1000}`;
    (async () => {
      try {
        const r = await fetch('/api/referrals', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, code: proposed, action: 'create', user_email: user.email, user_name: user.name }),
        });
        const link = r.ok ? await r.json() : null;
        if (!cancelled && link?.code) setRefCode(link.code);
        const s = await fetch(`/api/referrals/stats?user_id=${encodeURIComponent(userId)}`);
        if (s.ok && !cancelled) setStats(await s.json());
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [user.email, user.id, user.name]);

  const firstName = (user.name || user.email).split(/\s+|@/)[0];

  return (
    <>
      {/* ═══ HEADER ═══ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#848E9C', fontSize: 13, fontWeight: 500 }}>{t(lang, 'dashboard.customer.welcome')} {firstName} ☀️</span>
          <h1 style={{ color: '#F5F3FF', fontSize: 32, fontWeight: 800, letterSpacing: -0.5, margin: 0 }}>{t(lang, 'dashboard.customer.producing')}</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 16px', background: '#02C07618', border: '1px solid #02C07640', borderRadius: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: '#02C076', boxShadow: '0 0 8px #02C076' }} />
            <span style={{ color: '#02C076', fontSize: 11, fontWeight: 800, letterSpacing: 1 }}>{t(lang, 'dashboard.customer.live')}</span>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: '#0A0A0A', border: '1px solid #1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Ic n="bell" s={18} c="#A1A1AA" />
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: goldGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A0617', fontSize: 16, fontWeight: 800 }}>
            {firstName[0]?.toUpperCase()}
          </div>
        </div>
      </div>

      {/* ═══ PRODUCTION HERO ═══ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 32, padding: 32, background: '#000', border: '1.5px solid #1A1A1A', borderRadius: 24, minHeight: 280 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ color: '#F59E0B', fontSize: 11, fontWeight: 800, letterSpacing: 1.5 }}>{t(lang, 'dashboard.customer.producingToday')}</span>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <span style={{ color: '#FFD000', fontSize: 80, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1 }}>34.2</span>
            <span style={{ color: '#848E9C', fontSize: 24, fontWeight: 700, paddingBottom: 8 }}>kWh</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Ic n="trending-up" s={14} c="#02C076" />
            <span style={{ color: '#02C076', fontSize: 13, fontWeight: 700 }}>{t(lang, 'dashboard.customer.savedToday')}</span>
          </div>
          <div style={{ display: 'flex', gap: 24, marginTop: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ color: '#F5F3FF', fontSize: 18, fontWeight: 800 }}>23.6 kWh</span>
              <span style={{ color: '#5E6673', fontSize: 11 }}>{t(lang, 'dashboard.customer.used')}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ color: '#02C076', fontSize: 18, fontWeight: 800 }}>7.6 kWh</span>
              <span style={{ color: '#5E6673', fontSize: 11 }}>{t(lang, 'dashboard.customer.toGrid')}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ color: '#A78BFA', fontSize: 18, fontWeight: 800 }}>3.0 kWh</span>
              <span style={{ color: '#5E6673', fontSize: 11 }}>{t(lang, 'dashboard.customer.toBattery')}</span>
            </div>
          </div>
        </div>
        {/* Sun illustration */}
        <div style={{ position: 'relative', width: 280, height: 216, borderRadius: 20, background: '#000', border: '1.5px solid #1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: 100, border: '1.5px solid #FFFFFF1A' }} />
          <div style={{ width: 120, height: 120, borderRadius: 60, background: '#F7FF00', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 80px rgba(247,255,0,0.35)' }}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          </div>
        </div>
      </div>

      {/* ═══ STATS GRID + QUICK ACTIONS ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 360px', gap: 16 }}>
        {/* This month */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 20, background: glassBg, border: '1px solid #1A1A1A', borderRadius: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#5E6673', fontSize: 10, fontWeight: 700, letterSpacing: 1.2 }}>{t(lang, 'dashboard.customer.thisMonth').toUpperCase()}</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#F59E0B18', border: '1px solid #F59E0B40', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ic n="zap" s={14} c="#F59E0B" />
            </div>
          </div>
          <span style={{ color: '#F5F3FF', fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>892 kWh</span>
          <span style={{ color: '#5E6673', fontSize: 11 }}>{t(lang, 'dashboard.customer.goal')} 1,000 kWh</span>
        </div>
        {/* Savings (highlighted green) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 20, background: 'linear-gradient(135deg, #10B98140 0%, #10B98112 100%)', border: '1.5px solid #02C07680', borderRadius: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#02C076', fontSize: 10, fontWeight: 700, letterSpacing: 1.2 }}>{t(lang, 'dashboard.customer.savingsMonth').toUpperCase()}</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#02C07618', border: '1px solid #10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ic n="dollar-sign" s={14} c="#02C076" />
            </div>
          </div>
          <span style={{ color: '#02C076', fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>$184</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Ic n="trending-up" s={12} c="#02C076" />
            <span style={{ color: '#02C076', fontSize: 11, fontWeight: 800 }}>+24% {t(lang, 'dashboard.customer.vsLast')}</span>
          </div>
        </div>
        {/* Battery */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 20, background: glassBg, border: '1px solid #1A1A1A', borderRadius: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#5E6673', fontSize: 10, fontWeight: 700, letterSpacing: 1.2 }}>{t(lang, 'dashboard.customer.battery').toUpperCase()}</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#10B98120', border: '1px solid #02C07640', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ic n="zap" s={14} c="#02C076" />
            </div>
          </div>
          <span style={{ color: '#F5F3FF', fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>82%</span>
          <span style={{ color: '#5E6673', fontSize: 11 }}>11.1 / 13.5 kWh</span>
        </div>
        {/* CO2 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 20, background: glassBg, border: '1px solid #1A1A1A', borderRadius: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#5E6673', fontSize: 10, fontWeight: 700, letterSpacing: 1.2 }}>{t(lang, 'dashboard.customer.co2').toUpperCase()}</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#A78BFA20', border: '1px solid #A78BFA40', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ic n="shield-check" s={14} c="#A78BFA" />
            </div>
          </div>
          <span style={{ color: '#F5F3FF', fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>680 kg</span>
          <span style={{ color: '#A78BFA', fontSize: 11, fontWeight: 600 }}>= 28 🌳 {t(lang, 'dashboard.customer.treesMonth')}</span>
        </div>
        {/* Quick actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 20, background: glassBg, border: '1px solid #1A1A1A', borderRadius: 18 }}>
          <span style={{ color: '#5E6673', fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>{t(lang, 'dashboard.customer.quickActions').toUpperCase()}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { i: 'clipboard-list' as const, lbl: t(lang, 'dashboard.customer.myBills'), c: '#F59E0B' },
              { i: 'wrench' as const, lbl: t(lang, 'dashboard.customer.service'), c: '#02C076' },
              { i: 'bell' as const, lbl: t(lang, 'dashboard.customer.support'), c: '#A78BFA' },
            ].map(b => (
              <button key={b.lbl} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, height: 80, background: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: 12, color: '#F5F3FF', fontFamily: 'inherit', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                <Ic n={b.i} s={20} c={b.c} />
                {b.lbl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ REFER + RIGHT COLUMN ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16 }}>
        {/* Refer card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: 32, background: 'linear-gradient(135deg, #A78BFA40 0%, #6C5CE715 100%)', border: '1.5px solid #A78BFA60', borderRadius: 20, minHeight: 240 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 6, padding: '0 12px', height: 28, background: '#A78BFA15', border: '1px solid #A78BFA60', borderRadius: 14 }}>
              <Ic n="gift" s={14} c="#A78BFA" />
              <span style={{ color: '#A78BFA', fontSize: 11, fontWeight: 800, letterSpacing: 1.5 }}>{t(lang, 'dashboard.customer.referTag')}</span>
            </div>
            <h2 style={{ color: '#F5F3FF', fontSize: 32, fontWeight: 800, letterSpacing: -0.8, lineHeight: 1.1, margin: 0 }}>
              {t(lang, 'dashboard.customer.referHero')}
            </h2>
            <p style={{ color: '#848E9C', fontSize: 13, lineHeight: 1.5, margin: 0 }}>{t(lang, 'dashboard.customer.referHeroSub')}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
              <button onClick={() => refUrl && navigator.clipboard.writeText(refUrl)} disabled={!refUrl} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 48, padding: '0 22px', background: '#A78BFA', border: 'none', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 6px 24px rgba(167,139,250,0.45)', opacity: refUrl ? 1 : 0.6 }}>
                <Ic n="copy" s={14} /> {t(lang, 'dashboard.customer.shareNow')}
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: '#848E9C', fontSize: 12 }}><b style={{ color: '#F5F3FF' }}>{stats?.signups ?? 0}</b> {t(lang, 'dashboard.customer.referredCount')}</span>
                <span style={{ color: '#848E9C', fontSize: 12 }}><b style={{ color: '#F5F3FF' }}>{fmtMoney(stats?.commission_paid ?? 0)}</b> {t(lang, 'dashboard.customer.earnedShort')}</span>
              </div>
            </div>
          </div>
          {/* Decorative gift illustration */}
          <div style={{ width: 200, height: 200, borderRadius: 16, background: 'radial-gradient(circle at 30% 30%, #A78BFA60, transparent 70%), radial-gradient(circle at 70% 70%, #6C5CE740, transparent 60%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #A78BFA30' }}>
            <Ic n="gift" s={96} c="#fff" />
          </div>
        </div>

        {/* Right column: health + next bill */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: '#02C07618', border: '1px solid #02C07640', borderRadius: 18 }}>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: '#10B98120', border: '1px solid #02C07680', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ic n="shield-check" s={18} c="#02C076" />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 800 }}>{t(lang, 'dashboard.customer.systemHealthy')}</span>
              <span style={{ color: '#02C076', fontSize: 11, fontWeight: 500 }}>{t(lang, 'dashboard.customer.allPanels')}</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 20, background: glassBg, border: '1px solid #1A1A1A', borderRadius: 18, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Ic n="calendar" s={14} c="#5E6673" />
              <span style={{ color: '#5E6673', fontSize: 11, fontWeight: 700, letterSpacing: 1.2 }}>{t(lang, 'dashboard.customer.nextBill').toUpperCase()}</span>
            </div>
            <span style={{ color: '#F5F3FF', fontSize: 24, fontWeight: 800 }}>{t(lang, 'dashboard.customer.nextBillVal')}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Ic n="check" s={12} c="#02C076" />
              <span style={{ color: '#5E6673', fontSize: 11, fontWeight: 500 }}>{t(lang, 'dashboard.customer.autoPay')}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════
// EPC DASHBOARD VIEW
// ═══════════════════════════════════════════════════════
function EpcDashboardView({ lang }: { lang: string }) {
  const jobs = [
    { time: '10:30', period: 'AM', tag: 'NEXT', customer: 'Veronica Hernández', system: '9.6 kW Pro', addr: '1240 Maple Avenue · 4h', payout: '$1,200', active: true, isToday: true },
    { time: '2:00', period: 'PM', tag: '', customer: 'Carlos Mendez', system: '13.5 kW Max + Battery', addr: '892 Pine Street · 6h', payout: '$1,820', active: false, isToday: true },
    { time: 'Tue', period: 'JUL 8', tag: 'PRE', customer: 'Sofia Ruiz', system: 'Pre-install assessment', addr: '219 Cedar Lane · 1h', payout: '', active: false, isToday: false },
  ];
  const materials = [
    { name: t(lang, 'epc.dashboard.matPanels'), status: 'loaded' as const },
    { name: t(lang, 'epc.dashboard.matInverter'), status: 'loaded' as const },
    { name: t(lang, 'epc.dashboard.matMounting'), status: 'pickup' as const },
  ];
  return (
    <>
      {/* ═══ HEADER ═══ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#848E9C', fontSize: 13, fontWeight: 500 }}>{t(lang, 'epc.dashboard.greeting')}</span>
          <h1 style={{ color: '#F5F3FF', fontSize: 32, fontWeight: 800, letterSpacing: -0.5, margin: 0 }}>{t(lang, 'epc.dashboard.jobsToday')}</h1>
          <span style={{ color: '#5E6673', fontSize: 13 }}>{t(lang, 'epc.dashboard.nextInstall')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 18px', height: 40, background: '#02C076', borderRadius: 10, border: 'none', cursor: 'pointer', color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', boxShadow: '0 6px 20px rgba(2,192,118,0.25)' }}>
            <Ic n="check" s={14} c="#fff" /> {t(lang, 'epc.dashboard.checkIn')}
          </button>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: '#0A0A0A', border: '1px solid #1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Ic n="bell" s={18} c="#A1A1AA" />
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: goldGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A0617', fontSize: 14, fontWeight: 800 }}>MR</div>
        </div>
      </div>

      {/* ═══ STATS ROW ═══ */}
      <div style={{ display: 'flex', gap: 16 }}>
        <StatCard icon="hardhat" label={t(lang, 'epc.dashboard.activeJobs')} value="4" sub={t(lang, 'epc.dashboard.activeSub')} />
        <StatCard icon="check" label={t(lang, 'epc.dashboard.completed')} value="23" sub={t(lang, 'epc.dashboard.completedSub')} delta={8} sc="#02C076" />
        <StatCard icon="star" label={t(lang, 'epc.dashboard.rating')} value="4.98" sub={t(lang, 'epc.dashboard.ratingSub')} />
        <StatCard icon="dollar-sign" label={t(lang, 'epc.dashboard.earnings')} value="$18,420" sub={t(lang, 'epc.dashboard.earningsSub')} delta={22} tone="gold" />
      </div>

      {/* ═══ 2-COL MAIN ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16, alignItems: 'stretch' }}>
        {/* Today's installs list */}
        <div style={{ display: 'flex', flexDirection: 'column', background: '#0E0E10', border: '1px solid #1A1A1A', borderRadius: 18, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64, padding: '0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Ic n="hardhat" s={18} c="#F59E0B" />
              <span style={{ color: '#5E6673', fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>{t(lang, 'epc.dashboard.todayJobs').toUpperCase()}</span>
            </div>
            <span style={{ color: '#F59E0B', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{t(lang, 'epc.dashboard.viewAll')} 4 →</span>
          </div>
          <div style={{ height: 1, background: '#1A1A1A' }} />
          {jobs.map((j, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '20px 24px', background: j.active ? '#FBBF2410' : 'transparent', borderBottom: i < jobs.length - 1 ? '1px solid #0A0A0A' : 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: 60 }}>
                <span style={{ color: j.active ? '#F59E0B' : j.isToday ? '#F5F3FF' : '#A78BFA', fontSize: j.isToday ? 18 : 14, fontWeight: 800 }}>{j.time}</span>
                <span style={{ color: j.active ? '#F59E0B' : '#5E6673', fontSize: j.isToday ? 11 : 10, fontWeight: 700 }}>{j.period}</span>
              </div>
              <div style={{ width: 1, height: 60, background: j.active ? '#F59E0B40' : '#1A1A1A' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {j.tag && (
                  <span style={{
                    display: 'inline-flex', alignSelf: 'flex-start', padding: '0 8px', height: 20, alignItems: 'center', borderRadius: 5,
                    background: j.tag === 'NEXT' ? '#F59E0B' : '#A78BFA20',
                    border: j.tag === 'PRE' ? '1px solid #A78BFA40' : 'none',
                    color: j.tag === 'NEXT' ? '#0A0617' : '#A78BFA',
                    fontSize: 10, fontWeight: 800, letterSpacing: 1,
                  }}>{j.tag}</span>
                )}
                <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 800 }}>{j.customer} · <span style={{ fontWeight: 600 }}>{j.system}</span></span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Ic n="map" s={12} c="#5E6673" />
                  <span style={{ color: '#848E9C', fontSize: 12 }}>{j.addr}</span>
                  {j.payout && (<><span style={{ color: '#5E6673' }}>·</span><span style={{ color: '#F59E0B', fontSize: 12, fontWeight: 700 }}>{j.payout}</span></>)}
                </div>
              </div>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 16px', height: 38, borderRadius: 9, border: j.active ? 'none' : '1px solid #1A1A1A', background: j.active ? '#F59E0B' : '#0A0A0A', color: j.active ? '#0A0617' : '#F5F3FF', fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
                {j.active ? <><Ic n="arrow-right" s={12} /> {t(lang, 'epc.dashboard.navigate')}</> : t(lang, 'epc.dashboard.details')}
              </button>
            </div>
          ))}
        </div>

        {/* Right column: map + materials + safety */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Mini map */}
          <div style={{ position: 'relative', height: 280, borderRadius: 18, background: 'radial-gradient(circle at 30% 40%, #1a1f2e 0%, #000 70%)', border: '1px solid #1A1A1A', overflow: 'hidden' }}>
            {/* Fake map grid */}
            <svg viewBox="0 0 360 280" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF06" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="360" height="280" fill="url(#grid)" />
              <path d="M 40 220 Q 140 180 200 140 T 320 60" stroke="#F59E0B" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="4 6" opacity="0.7" />
              <circle cx="40" cy="220" r="6" fill="#02C076" stroke="#000" strokeWidth="2" />
              <circle cx="200" cy="140" r="9" fill="#F59E0B" stroke="#fff" strokeWidth="2" />
              <circle cx="320" cy="60" r="6" fill="#A78BFA" stroke="#000" strokeWidth="2" />
            </svg>
            <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px', height: 26, borderRadius: 6, background: '#0A0617DD', border: '1px solid #262626' }}>
              <Ic n="map" s={11} c="#F59E0B" />
              <span style={{ color: '#F5F3FF', fontSize: 11, fontWeight: 700 }}>{t(lang, 'epc.dashboard.todayRoute')} · 18.4 mi</span>
            </div>
          </div>

          {/* Materials checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 24, background: '#0E0E10', border: '1px solid #1A1A1A', borderRadius: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Ic n="clipboard-list" s={14} c="#A78BFA" />
                <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 800 }}>{t(lang, 'epc.dashboard.materials')}</span>
              </div>
              <span style={{ color: '#A78BFA', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{t(lang, 'epc.dashboard.order')} →</span>
            </div>
            {materials.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 10, background: m.status === 'loaded' ? '#02C07620' : '#F59E0B20', border: `1.5px solid ${m.status === 'loaded' ? '#02C076' : '#F59E0B'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {m.status === 'loaded' && <Ic n="check" s={12} c="#02C076" />}
                  </div>
                  <span style={{ color: '#F5F3FF', fontSize: 12, fontWeight: 500 }}>{m.name}</span>
                </div>
                <span style={{ color: m.status === 'loaded' ? '#02C076' : '#F59E0B', fontSize: 11, fontWeight: 700 }}>
                  {m.status === 'loaded' ? t(lang, 'epc.dashboard.loaded') : t(lang, 'epc.dashboard.pickup')}
                </span>
              </div>
            ))}
          </div>

          {/* Safety */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: '#02C07618', border: '1px solid #02C07640', borderRadius: 18 }}>
            <Ic n="shield-check" s={24} c="#02C076" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ color: '#F5F3FF', fontSize: 13, fontWeight: 800 }}>{t(lang, 'epc.dashboard.safety')}</span>
              <span style={{ color: '#02C076', fontSize: 11, fontWeight: 500 }}>{t(lang, 'epc.dashboard.safetySub')}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════
// EPC EARNINGS VIEW
// ═══════════════════════════════════════════════════════
function EpcEarningsView({ lang }: { lang: string }) {
  const txs = [{ icon: 'dollar-sign' as const, bg: '#FBBF2420', name: 'Veronica H. · 9.6 kW Pro', date: 'Jul 8', amount: '+$1,200', color: '#02C076' },{ icon: 'hardhat' as const, bg: '#10B98120', name: 'Carlos M. · 13.5 kW Max', date: 'Jul 5', amount: '+$600', color: '#02C076' },{ icon: 'wrench' as const, bg: '#A78BFA20', name: 'Payout to bank', date: 'Jun 30', amount: '−$15,200', color: '#848E9C' }];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><span style={{ color: '#848E9C', fontSize: 13 }}>{t(lang, 'epc.earnings.subtitle')}</span><span style={{ color: '#EAECEF', fontSize: 32, fontWeight: 800, letterSpacing: -0.5 }}>{t(lang, 'epc.earnings.title')}</span></div><button style={btnG}>{t(lang, 'epc.earnings.requestPayout')}</button></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32, padding: 32, background: '#12100B', borderRadius: 24, border: '1px solid #2A2218' }}><div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={{ color: '#F59E0B', fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase' }}>{t(lang, 'epc.earnings.yearEarned')}</span><span style={{ color: '#EAECEF', fontSize: 54, fontWeight: 800, letterSpacing: -1.8 }}>$132,840</span><span style={{ color: '#848E9C', fontSize: 13 }}>{t(lang, 'epc.earnings.fromInstalls')}</span></div><div style={{ width: 1, height: 96, background: '#1A1A1A' }} /><div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={{ color: '#5E6673', fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase' }}>{t(lang, 'epc.earnings.pending')}</span><span style={{ color: '#F59E0B', fontSize: 24, fontWeight: 800 }}>$4,820</span><span style={{ color: '#5E6673', fontSize: 11 }}>{t(lang, 'epc.earnings.pendingSub')}</span></div><div style={{ width: 1, height: 96, background: '#1A1A1A' }} /><div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={{ color: '#02C076', fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase' }}>{t(lang, 'epc.earnings.paidOut')}</span><span style={{ color: '#02C076', fontSize: 24, fontWeight: 800 }}>$128,020</span><span style={{ color: '#5E6673', fontSize: 11 }}>{t(lang, 'epc.earnings.paidOutSub')}</span></div></div>
      <div style={{ display: 'flex', gap: 16 }}>
        <Card style={{ flex: 1 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#EAECEF', fontSize: 16, fontWeight: 800 }}>{t(lang, 'epc.earnings.monthlyEarnings')}</span><div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px', height: 32, borderRadius: 8, background: '#0A0A0A', border: '1px solid #1A1A1A' }}><span style={{ color: '#848E9C', fontSize: 12 }}>2025</span><Ic n="chevron-down" s={12} c="#5E6673" /></div></div><div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 180, gap: 12 }}>{monthImages.map((h,i)=>(<div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6,flex:1}}><div style={{width:'100%',maxWidth:48,height:`${h}%`,borderRadius:'8px 8px 0 0',background:`linear-gradient(180deg,${h>85?'#F59E0B':'#F59E0B80'} 0%,#F59E0B20 100%)`,minHeight:4}}/><span style={{color:'#5E6673',fontSize:10,fontWeight:600}}>{months[i]}</span></div>))}</div></Card>
        <Card style={{ width: 360 }}><span style={{ color: '#5E6673', fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>{t(lang, 'epc.earnings.paymentBreakdown')}</span><span style={{ color: '#EAECEF', fontSize: 18, fontWeight: 800 }}>{t(lang, 'epc.earnings.thisMonth')} · $18,420</span>{[{l:t(lang,'epc.earnings.solarInstall'),v:'$14,400',d:'#F59E0B'},{l:t(lang,'epc.earnings.batteryInstall'),v:'$2,400',d:'#02C076'},{l:t(lang,'epc.earnings.bonuses'),v:'$1,050',d:'#A78BFA'},{l:t(lang,'epc.earnings.tips'),v:'+$570',d:'#02C076'}].map((b,i)=>(<div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:8,height:8,borderRadius:4,background:b.d}}/><span style={{color:'#848E9C',fontSize:13}}>{b.l}</span></div><span style={{color:b.d,fontSize:13,fontWeight:800}}>{b.v}</span></div>))}</Card>
      </div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', height: 48, alignItems: 'center' }}><span style={{ color: '#5E6673', fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>{t(lang, 'epc.earnings.recentTransactions')}</span><span style={{ color: '#F59E0B', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{t(lang, 'epc.earnings.viewAllTx')} 156 →</span></div>
        <div style={{ height: 1, background: '#1A1A1A' }} />
        {txs.map((tx,i)=>(<div key={i}><div style={{display:'flex',alignItems:'center',gap:14,height:56}}><div style={{width:32,height:32,borderRadius:8,background:tx.bg,display:'flex',alignItems:'center',justifyContent:'center'}}><Ic n={tx.icon} s={14} c={tx.name.includes('bank')?'#848E9C':'#F59E0B'}/></div><div style={{flex:1}}><span style={{color:'#EAECEF',fontSize:13,fontWeight:600}}>{tx.name}</span><span style={{color:'#5E6673',fontSize:11,marginLeft:8}}>{tx.date}</span></div><span style={{color:tx.color,fontSize:14,fontWeight:800,textAlign:'right',width:120}}>{tx.amount}</span></div>{i<txs.length-1&&<div style={{height:1,background:'#0A0A0A'}}/>}</div>))}
      </Card>
    </>
  );
}

// ═══════════════════════════════════════════════════════
// EPC SCHEDULE VIEW
// ═══════════════════════════════════════════════════════
function EpcScheduleView({ lang }: { lang: string }) {
  const days = ['MON','TUE','WED','THU','FRI','SAT','SUN']; const today=1;
  const stats = [{ icon: 'calendar' as const, label: t(lang, 'epc.schedule.thisWeek'), value: '7', sub: t(lang, 'epc.schedule.scheduled'), bg: '#FBBF2420' },{ icon: 'check' as const, label: t(lang, 'epc.schedule.completed'), value: '3', sub: t(lang, 'epc.schedule.soFar'), bg: '#A78BFA20' },{ icon: 'clock' as const, label: t(lang, 'epc.schedule.nextUp'), value: '10:30', sub: t(lang, 'epc.schedule.today'), bg: '#10B98120' },{ icon: 'dollar-sign' as const, label: t(lang, 'epc.schedule.potential'), value: '$8,640', sub: t(lang, 'epc.schedule.ifAllComplete'), bg: '#F59E0B18', hl: true }];
  const events = [{ day: 0, top: 0, h: 120, color: '#A78BFA', title: '10 AM · 4h', name: 'Veronica P.', sub: '9.6 kW Pro', addr: 'Maple Ave' },{ day: 1, top: 0, h: 140, color: '#F59E0B', title: '10:30 · NEXT', name: 'Veronica H.', sub: '9.6 kW Pro · 4h', addr: '1240 Maple', payout: '$1,200', hl: true },{ day: 1, top: 220, h: 140, color: '#02C076', title: '2 PM · 6h', name: 'Carlos M.', sub: '13.5 kW Max', addr: '892 Pine', payout: '$1,820' },{ day: 2, top: 80, h: 60, color: '#A78BFA', title: '11 AM · 30m', name: 'Sofia R.', sub: 'Inspection' },{ day: 3, top: 0, h: 120, color: '#02C076', title: '10 AM · 2h', name: 'Andrea P.', sub: 'Battery only', addr: '219 Cedar' },{ day: 4, top: 140, h: 240, color: '#F59E0B', title: '1-5:30 PM', name: 'Daniel V.', sub: '13.5 Max + Batt', addr: '445 Oak', payout: '$1,820', hl: true },{ day: 5, top: 0, h: 90, color: '#A78BFA', title: '10 AM · 1h', name: 'Lucas T.', sub: 'Inspection' }];
  const hourLabels = ['9 AM','10 AM','11 AM','12 PM','1 PM','2 PM','3 PM','4 PM','5 PM'];
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><span style={{ color: '#848E9C', fontSize: 13 }}>{t(lang, 'epc.schedule.week')}</span><span style={{ color: '#EAECEF', fontSize: 32, fontWeight: 800, letterSpacing: -0.5 }}>{t(lang, 'epc.schedule.title')}</span></div><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '0 4px', height: 36, borderRadius: 9, background: '#0A0A0A', border: '1px solid #1A1A1A' }}><button style={calBtn}>&lt;</button><button style={{...calBtn,background:'#1A1A1A',color:'#fff'}}>{t(lang, 'epc.schedule.weekView')}</button><button style={calBtn}>{t(lang, 'epc.schedule.monthView')}</button><button style={calBtn}>&gt;</button></div><button style={btnP}><Ic n="plus" s={16} />{t(lang, 'epc.schedule.addJob')}</button></div></div>
      <div style={{ display: 'flex', gap: 14 }}>{stats.map((s,i)=>(<div key={i} style={{flex:1,display:'flex',alignItems:'center',gap:14,padding:'0 18px',height:90,borderRadius:14,border:s.hl?'1.5px solid #F59E0B40':'1px solid #1A1A1A',background:s.hl?'linear-gradient(135deg, #FBBF2425, #F59E0B12)':'#0A0A0A',backdropFilter:'blur(20px)'}}><div style={{width:36,height:36,borderRadius:9,background:s.bg,display:'flex',alignItems:'center',justifyContent:'center'}}><Ic n={s.icon} s={16} /></div><div style={{display:'flex',flexDirection:'column',gap:2}}><span style={{color:'#EAECEF',fontSize:20,fontWeight:800}}>{s.value}</span><span style={{color:'#5E6673',fontSize:11}}>{s.sub}</span></div></div>))}</div>
      <div style={{flex:1,display:'flex',flexDirection:'column',background:'linear-gradient(135deg, #FFFFFF08, #FFFFFF03)',borderRadius:18,border:'1px solid #1A1A1A',backdropFilter:'blur(30px)',position:'relative',overflow:'hidden'}}>
        <div style={{padding:'22px 24px 0'}}><span style={{color:'#5E6673',fontSize:11,fontWeight:700,letterSpacing:1.5}}>WEEK CALENDAR · JUL 7 — JUL 13</span></div>
        <div style={{height:1,background:'#1A1A1A',margin:'14px 0 0'}}/>
        <div style={{display:'flex',height:42,borderBottom:'1px solid #1A1A1A'}}>{days.map((d,i)=>(<div key={i}style={{flex:i===6?0.7:1,display:'flex',alignItems:'center',justifyContent:'center',color:i===today?'#F59E0B':i===6?'#3F3F46':'#848E9C',fontSize:11,fontWeight:i===today?800:700,letterSpacing:1,borderRight:i<6?'1px solid #0A0A0A':'none'}}>{d} · {7+i}{i===today?' · TODAY':''}</div>))}</div>
        <div style={{flex:1,display:'flex',position:'relative'}}><div style={{width:80,display:'flex',flexDirection:'column',borderRight:'1px solid #0A0A0A'}}>{hourLabels.map((h,i)=>(<div key={i}style={{flex:1,display:'flex',alignItems:'flex-start',justifyContent:'flex-end',padding:'4px 12px 0 0'}}><span style={{color:'#5E6673',fontSize:10,fontWeight:600}}>{h}</span></div>))}</div><div style={{flex:1,display:'flex',position:'relative'}}>{days.map((_,di)=>(<div key={di}style={{flex:di===6?0.7:1,position:'relative',borderRight:di<6?'1px solid #0A0A0A':'none'}}>{hourLabels.map((_,hi)=>(<div key={hi}style={{height:`${100/hourLabels.length}%`,borderTop:hi>0?'1px solid #FFFFFF05':'none'}}/>))}{events.filter(e=>e.day===di).map((ev,ei)=>(<div key={ei}style={{position:'absolute',left:2,right:2,top:`${ev.top/5.4}%`,height:`${ev.h/5.4}%`,background:ev.color,borderRadius:10,padding:'8px 10px',display:'flex',flexDirection:'column',gap:1,boxShadow:ev.hl?'0 6px 24px rgba(245,158,11,0.5)':'0 4px 16px rgba(0,0,0,0.3)',overflow:'hidden',zIndex:ev.hl?2:1}}><span style={{color:ev.color==='#F59E0B'?'#0A0617':'#fff',fontWeight:800,fontSize:ev.h>100?10:9}}>{ev.title}</span>{ev.h>80&&<><span style={{color:ev.color==='#F59E0B'?'#0A0617':'#fff',fontWeight:800,fontSize:11}}>{ev.name}</span><span style={{color:ev.color==='#F59E0B'?'#0A061799':'#ffffffCC',fontWeight:600,fontSize:10}}>{ev.sub}</span>{ev.addr&&<span style={{color:ev.color==='#F59E0B'?'#0A0617':'#fff',fontWeight:700,fontSize:9}}>{ev.addr}</span>}{ev.payout&&<span style={{color:ev.color==='#F59E0B'?'#0A0617':'#fff',fontWeight:800,fontSize:10}}>{ev.payout}</span>}</>}</div>))}</div>))}</div></div></div>
    </>
  );
}

