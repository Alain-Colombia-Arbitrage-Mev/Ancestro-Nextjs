'use client';
import { useState, memo } from 'react';
import { t } from '@/i18n/translations';

// ─── Shared Icons ───────────────────────────────────────
const Ic = ({ d, s = 24, c = 'currentColor' }: { d: string; s?: number; c?: string }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ color: c, flexShrink: 0 }}>
    <path d={d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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
  package: 'M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.3 7l8.7 5 8.7-5 M12 22V12',
  home: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  'dollar-sign': 'M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  hardhat: 'M10 10.5s3-2 7 1 M18 21a6 6 0 0 0-12 0 M2 10c0-5.5 4.5-10 10-10s10 4.5 10 10 M12 1v11',
  users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M9 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  'clipboard-list': 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z M12 11h4 M12 16h4 M8 11h.01 M8 16h.01',
  plus: 'M12 5v14M5 12h14',
  'arrow-right': 'M5 12h14M12 5l7 7-7 7',
  'chevron-down': 'M6 9l6 6 6-6',
  'map-pin': 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  footprint: 'M4 16c-1.1 0-2-.9-2-2s.9-2 2-2 M20 16c1.1 0 2-.9 2-2s-.9-2-2-2 M12 22V2',
  cog: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  wrench: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
};

type Tab = 'dashboard' | 'earnings' | 'schedule';

// ─── EPC Dashboard Component ────────────────────────────
export default function EpcDashboard({ lang }: { lang: string }) {
  const [tab, setTab] = useState<Tab>('dashboard');

  const navItems = [
    { id: 'dashboard' as Tab, icon: 'home', label: t(lang, 'epc.nav.dashboard') },
    { id: 'earnings' as Tab, icon: 'dollar-sign', label: t(lang, 'epc.nav.earnings') },
    { id: 'schedule' as Tab, icon: 'calendar', label: t(lang, 'epc.nav.schedule') },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#000' }}>
      {/* Sidebar */}
      <Sidebar lang={lang} tab={tab} onTabChange={setTab} navItems={navItems} />

      {/* Main content */}
      <div style={{ flex: 1, marginLeft: 240, padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {tab === 'dashboard' && <DashboardView lang={lang} />}
        {tab === 'earnings' && <EarningsView lang={lang} />}
        {tab === 'schedule' && <ScheduleView lang={lang} />}
      </div>
    </div>
  );
}

// ─── Shared Sidebar ─────────────────────────────────────
function Sidebar({ lang, tab, onTabChange, navItems }: {
  lang: string; tab: Tab; onTabChange: (t: Tab) => void;
  navItems: { id: Tab; icon: string; label: string }[];
}) {
  return (
    <div style={{
      position: 'fixed', left: 0, top: 0, bottom: 0, width: 240,
      background: '#0A0A0A', borderRight: '1px solid #1A1A1A',
      display: 'flex', flexDirection: 'column', padding: '32px 16px', gap: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, paddingLeft: 16 }}>
        <svg width={32} height={32} viewBox="0 0 24 24" fill="none" style={{ color: '#F59E0B' }}>
          <path d={Icons.footprint} stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: '#fff', fontSize: 18, fontWeight: 800, letterSpacing: 1.5 }}>ANCESTRO</span>
          <span style={{ color: '#848E9C', fontSize: 11, fontWeight: 600 }}>{t(lang, 'epc.sidebar.epc')}</span>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', height: 44,
              borderRadius: 10, border: tab === item.id ? '1px solid #F59E0B40' : '1px solid transparent',
              background: tab === item.id ? '#F59E0B18' : 'transparent',
              color: tab === item.id ? '#F59E0B' : '#848E9C',
              fontSize: 14, fontWeight: tab === item.id ? 700 : 500,
              cursor: 'pointer', fontFamily: 'inherit', width: '100%', textAlign: 'left',
              transition: 'all 0.15s ease',
            }}
          >
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <path d={Icons[item.icon as keyof typeof Icons]} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {item.label}
          </button>
        ))}
      </div>

      {/* Certification badge */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 6, padding: 18,
        background: '#0A0A0A', borderRadius: 14, border: '1px solid #1A1A1A',
      }}>
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={{ color: '#02C076' }}>
          <path d={Icons.shield} stroke="#02C076" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{ color: '#02C076', fontSize: 13, fontWeight: 700 }}>{t(lang, 'epc.sidebar.certified')}</span>
        <span style={{ color: '#848E9C', fontSize: 11 }}>{t(lang, 'epc.sidebar.license')}</span>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', height: 34,
          background: '#02C07618', borderRadius: 8, border: '1px solid #02C07640',
          color: '#02C076', fontSize: 12, fontWeight: 600, marginTop: 4,
        }}>
          {t(lang, 'epc.sidebar.viewProfile')}
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card ──────────────────────────────────────────
const StatCard = memo(function StatCard({ icon, label, value, sub, subColor }: {
  icon: keyof typeof Icons; label: string; value: string; sub: string; subColor?: string;
}) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', gap: 6, padding: 18,
      background: '#0E0E10', borderRadius: 16, border: '1px solid #1A1A1A',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#848E9C', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</span>
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={{ color: '#F59E0B' }}>
          <path d={Icons[icon]} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span style={{ color: '#EAECEF', fontSize: 36, fontWeight: 800, letterSpacing: -0.5 }}>{value}</span>
      <span style={{ color: subColor || '#F59E0B', fontSize: 12, fontWeight: subColor ? 700 : 600 }}>{sub}</span>
    </div>
  );
});

// ─── Dashboard View ─────────────────────────────────────
function DashboardView({ lang }: { lang: string }) {
  const jobs = [
    { time: '10:30 AM', customer: 'Veronica H.', addr: '1240 Maple Ave', system: '9.6 kW Pro', payout: '$1,200', active: true },
    { time: '2:00 PM', customer: 'Carlos M.', addr: '892 Pine St', system: '13.5 kW Max', payout: '$1,820', active: false },
    { time: '4:30 PM', customer: 'Andrea P.', addr: '219 Cedar Ln', system: 'Battery only', payout: '$980', active: false },
  ];

  const materials = [
    { name: '24x 400W Panels', done: true },
    { name: '1x 7.6kW Inverter', done: true },
    { name: 'Mounting rails + hardware', done: false },
  ];

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 80 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#848E9C', fontSize: 13, fontWeight: 500 }}>{t(lang, 'epc.dashboard.greeting')}</span>
          <span style={{ color: '#EAECEF', fontSize: 32, fontWeight: 800, letterSpacing: -0.5 }}>{t(lang, 'epc.dashboard.jobsToday')}</span>
          <span style={{ color: '#5E6673', fontSize: 13 }}>{t(lang, 'epc.dashboard.nextInstall')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '0 18px', height: 40,
            background: '#02C076', borderRadius: 10, border: 'none', cursor: 'pointer',
            color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
          }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none"><path d={Icons['check-in']} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {t(lang, 'epc.dashboard.checkIn')}
          </button>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: '#0A0A0A', border: '1px solid #1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={{ color: '#848E9C' }}><path d={Icons.bell} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A0617', fontSize: 16, fontWeight: 800 }}>MR</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 16 }}>
        <StatCard icon="check" label={t(lang, 'epc.dashboard.activeJobs')} value="4" sub={t(lang, 'epc.dashboard.activeSub')} subColor="#F59E0B" />
        <StatCard icon="clipboard-list" label={t(lang, 'epc.dashboard.completed')} value="23" sub={t(lang, 'epc.dashboard.completedSub')} subColor="#02C076" />
        <StatCard icon="star" label={t(lang, 'epc.dashboard.rating')} value="4.98" sub={t(lang, 'epc.dashboard.ratingSub')} subColor="#F59E0B" />
        <StatCard icon="dollar-sign" label={t(lang, 'epc.dashboard.earnings')} value="$18,420" sub={t(lang, 'epc.dashboard.earningsSub')} subColor="#02C076" />
      </div>

      {/* Main grid */}
      <div style={{ display: 'flex', gap: 16, flex: 1 }}>
        {/* Jobs list */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          background: '#0E0E10', borderRadius: 18, border: '1px solid #1A1A1A',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', height: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#EAECEF', fontSize: 16, fontWeight: 800 }}>{t(lang, 'epc.dashboard.todayJobs')}</span>
            </div>
            <span style={{ color: '#F59E0B', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{t(lang, 'epc.dashboard.viewAll')} 4 →</span>
          </div>
          <div style={{ height: 1, background: '#1A1A1A' }} />
          {jobs.map((job, i) => (
            <div key={i}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '20px 24px', background: job.active ? '#FBBF2410' : 'transparent' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: 60 }}>
                  <span style={{ color: '#EAECEF', fontSize: 18, fontWeight: 800 }}>{job.time.split(' ')[0]}</span>
                  <span style={{ color: '#848E9C', fontSize: 11 }}>AM</span>
                </div>
                <div style={{ width: 1, height: 60, background: job.active ? '#F59E0B18' : '#1A1A1A' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                  <span style={{ color: '#EAECEF', fontSize: 15, fontWeight: 700 }}>{job.customer}</span>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <span style={{ color: '#848E9C', fontSize: 12 }}>{job.system}</span>
                    <span style={{ color: '#5E6673', fontSize: 12 }}>📍 {job.addr}</span>
                    <span style={{ color: '#F59E0B', fontSize: 12, fontWeight: 700 }}>{job.payout}</span>
                  </div>
                </div>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '0 16px', height: 38, borderRadius: 9,
                  border: job.active ? 'none' : '1px solid #1A1A1A',
                  background: job.active ? '#F59E0B' : '#0A0A0A',
                  color: job.active ? '#0A0617' : '#848E9C', fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  {job.active ? t(lang, 'epc.dashboard.checkInBtn') : t(lang, 'epc.dashboard.startBtn')}
                </button>
              </div>
              {i < jobs.length - 1 && <div style={{ height: 1, background: '#0A0A0A' }} />}
            </div>
          ))}
        </div>

        {/* Right column */}
        <div style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Map placeholder */}
          <div style={{
            height: 280, borderRadius: 18, background: '#000', border: '1px solid #1A1A1A',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
            color: '#5E6673', fontSize: 14, overflow: 'hidden', position: 'relative',
          }}>
            <svg width={48} height={48} viewBox="0 0 24 24" fill="none" style={{ color: '#F59E0B40' }}>
              <path d={Icons.map} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{t(lang, 'epc.dashboard.routeMap')}</span>
            <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px', height: 26, borderRadius: 6, background: '#0A0617AA', border: '1px solid #262626' }}>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 600 }}>{t(lang, 'epc.dashboard.activeRoute')}</span>
            </div>
          </div>

          {/* Materials */}
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column', gap: 14, padding: 24,
            background: '#0E0E10', borderRadius: 18, border: '1px solid #1A1A1A',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#EAECEF', fontSize: 15, fontWeight: 700 }}>{t(lang, 'epc.dashboard.materials')}</span>
              <span style={{ color: '#848E9C', fontSize: 13 }}>2/3</span>
            </div>
            {materials.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 10, background: m.done ? '#02C07620' : '#1A1A1A', border: `1.5px solid ${m.done ? '#02C076' : '#333'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {m.done && <svg width={12} height={12} viewBox="0 0 24 24" fill="none" style={{ color: '#02C076' }}><path d={Icons.check} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span style={{ color: m.done ? '#EAECEF' : '#5E6673', fontSize: 13, fontWeight: 500 }}>{m.name}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Safety */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px',
            background: '#02C07618', borderRadius: 18, border: '1px solid #02C07640',
          }}>
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" style={{ color: '#02C076' }}>
              <path d={Icons['shield-check']} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
              <span style={{ color: '#02C076', fontSize: 14, fontWeight: 700 }}>{t(lang, 'epc.dashboard.safety')}</span>
              <span style={{ color: '#848E9C', fontSize: 11 }}>{t(lang, 'epc.dashboard.safetySub')}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Earnings View ──────────────────────────────────────
function EarningsView({ lang }: { lang: string }) {
  const txs = [
    { icon: 'dollar-sign', bg: '#FBBF2420', name: 'Veronica H. · 9.6 kW Pro', date: 'Jul 8', amount: '+$1,200', color: '#02C076' },
    { icon: 'hardhat', bg: '#10B98120', name: 'Carlos M. · 13.5 kW Max', date: 'Jul 5', amount: '+$600', color: '#02C076' },
    { icon: 'wrench', bg: '#A78BFA20', name: 'Payout to bank', date: 'Jun 30', amount: '−$15,200', color: '#848E9C' },
  ];

  const breakdown = [
    { label: t(lang, 'epc.earnings.solarInstall'), value: '$14,400', color: '#F59E0B', dot: '#F59E0B' },
    { label: t(lang, 'epc.earnings.batteryInstall'), value: '$2,400', color: '#02C076', dot: '#02C076' },
    { label: t(lang, 'epc.earnings.bonuses'), value: '$1,050', color: '#A78BFA', dot: '#A78BFA' },
    { label: t(lang, 'epc.earnings.tips'), value: '+$570', color: '#02C076', dot: '#02C076' },
  ];

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 80 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#848E9C', fontSize: 13, fontWeight: 500 }}>{t(lang, 'epc.earnings.subtitle')}</span>
          <span style={{ color: '#EAECEF', fontSize: 32, fontWeight: 800, letterSpacing: -0.5 }}>{t(lang, 'epc.earnings.title')}</span>
        </div>
        <button style={btnGreen}>
          {t(lang, 'epc.earnings.requestPayout')}
        </button>
      </div>

      {/* Hero bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 32, padding: 32,
        background: '#12100B', borderRadius: 24, border: '1px solid #2A2218',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ color: '#F59E0B', fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase' }}>{t(lang, 'epc.earnings.yearEarned')}</span>
          <span style={{ color: '#EAECEF', fontSize: 54, fontWeight: 800, letterSpacing: -1.8 }}>$132,840</span>
          <span style={{ color: '#848E9C', fontSize: 13 }}>{t(lang, 'epc.earnings.fromInstalls')}</span>
        </div>
        <div style={{ width: 1, height: 96, background: '#1A1A1A' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ color: '#5E6673', fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase' }}>{t(lang, 'epc.earnings.pending')}</span>
          <span style={{ color: '#F59E0B', fontSize: 24, fontWeight: 800 }}>$4,820</span>
          <span style={{ color: '#5E6673', fontSize: 11 }}>{t(lang, 'epc.earnings.pendingSub')}</span>
        </div>
        <div style={{ width: 1, height: 96, background: '#1A1A1A' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ color: '#02C076', fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase' }}>{t(lang, 'epc.earnings.paidOut')}</span>
          <span style={{ color: '#02C076', fontSize: 24, fontWeight: 800 }}>$128,020</span>
          <span style={{ color: '#5E6673', fontSize: 11 }}>{t(lang, 'epc.earnings.paidOutSub')}</span>
        </div>
      </div>

      {/* Chart + Breakdown */}
      <div style={{ display: 'flex', gap: 16, flex: 1 }}>
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#EAECEF', fontSize: 16, fontWeight: 800 }}>{t(lang, 'epc.earnings.monthlyEarnings')}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px', height: 32, borderRadius: 8, background: '#0A0A0A', border: '1px solid #1A1A1A' }}>
              <span style={{ color: '#848E9C', fontSize: 12 }}>2025</span>
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" style={{ color: '#5E6673' }}>
                <path d={Icons['chevron-down']} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 180, gap: 12 }}>
            {monthImages.map((h, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                <div style={{
                  width: '100%', maxWidth: 48, height: `${h}%`, borderRadius: '8px 8px 0 0',
                  background: `linear-gradient(180deg, ${h > 85 ? '#F59E0B' : '#F59E0B80'} 0%, #F59E0B20 100%)`,
                  minHeight: 4,
                }} />
                <span style={{ color: '#5E6673', fontSize: 10, fontWeight: 600 }}>{months[i]}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card style={{ width: 360 }}>
          <span style={{ color: '#5E6673', fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>{t(lang, 'epc.earnings.paymentBreakdown')}</span>
          <span style={{ color: '#EAECEF', fontSize: 18, fontWeight: 800 }}>{t(lang, 'epc.earnings.thisMonth')} · $18,420</span>
          {breakdown.map((b, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: b.dot }} />
                <span style={{ color: '#848E9C', fontSize: 13 }}>{b.label}</span>
              </div>
              <span style={{ color: b.color, fontSize: 13, fontWeight: 800 }}>{b.value}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* Transactions */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        background: '#0E0E10', borderRadius: 18, border: '1px solid #1A1A1A',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', height: 48 }}>
          <span style={{ color: '#5E6673', fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>{t(lang, 'epc.earnings.recentTransactions')}</span>
          <span style={{ color: '#F59E0B', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{t(lang, 'epc.earnings.viewAllTx')} 156 →</span>
        </div>
        <div style={{ height: 1, background: '#1A1A1A' }} />
        {txs.map((tx, i) => (
          <div key={i}>
            <TxRow tx={tx} />
            {i < txs.length - 1 && <div style={{ height: 1, background: '#0A0A0A' }} />}
          </div>
        ))}
      </div>
    </>
  );
}

function TxRow({ tx }: { tx: { icon: string; bg: string; name: string; date: string; amount: string; color: string } }) {
  const iconColor = tx.color === '#02C076' ? '#02C076' : tx.color === '#848E9C' ? '#848E9C' : '#F59E0B';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '0 24px', height: 56 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: tx.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" style={{ color: iconColor }}>
          <path d={Icons[tx.icon as keyof typeof Icons] || Icons['dollar-sign']} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        <span style={{ color: '#EAECEF', fontSize: 13, fontWeight: 600 }}>{tx.name}</span>
        <span style={{ color: '#5E6673', fontSize: 11 }}>{tx.date}</span>
      </div>
      <span style={{ color: tx.color, fontSize: 14, fontWeight: 800, textAlign: 'right', width: 120 }}>{tx.amount}</span>
    </div>
  );
}

// ─── Schedule View ──────────────────────────────────────
function ScheduleView({ lang }: { lang: string }) {
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const today = 1;
  const stats = [
    { icon: 'calendar', label: t(lang, 'epc.schedule.thisWeek'), value: '7', sub: t(lang, 'epc.schedule.scheduled'), bg: '#FBBF2420' },
    { icon: 'check', label: t(lang, 'epc.schedule.completed'), value: '3', sub: t(lang, 'epc.schedule.soFar'), bg: '#A78BFA20' },
    { icon: 'clock', label: t(lang, 'epc.schedule.nextUp'), value: '10:30', sub: t(lang, 'epc.schedule.today'), bg: '#10B98120' },
    { icon: 'dollar-sign', label: t(lang, 'epc.schedule.potential'), value: '$8,640', sub: t(lang, 'epc.schedule.ifAllComplete'), bg: '#F59E0B18', highlight: true },
  ];

  const events = [
    { day: 0, top: 0, h: 120, color: '#A78BFA', title: '10 AM · 4h', name: 'Veronica P.', sub: '9.6 kW Pro', addr: 'Maple Ave' },
    { day: 1, top: 0, h: 140, color: '#F59E0B', title: '10:30 · NEXT', name: 'Veronica H.', sub: '9.6 kW Pro · 4h', addr: '1240 Maple', payout: '$1,200', highlight: true },
    { day: 1, top: 220, h: 140, color: '#02C076', title: '2 PM · 6h', name: 'Carlos M.', sub: '13.5 kW Max', addr: '892 Pine', payout: '$1,820' },
    { day: 2, top: 80, h: 60, color: '#A78BFA', title: '11 AM · 30m', name: 'Sofia R.', sub: 'Inspection' },
    { day: 3, top: 0, h: 120, color: '#02C076', title: '10 AM · 2h', name: 'Andrea P.', sub: 'Battery only', addr: '219 Cedar' },
    { day: 4, top: 140, h: 240, color: '#F59E0B', title: '1-5:30 PM', name: 'Daniel V.', sub: '13.5 Max + Batt', addr: '445 Oak', payout: '$1,820', highlight: true },
    { day: 5, top: 0, h: 90, color: '#A78BFA', title: '10 AM · 1h', name: 'Lucas T.', sub: 'Inspection' },
  ];

  const hourLabels = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 80 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#848E9C', fontSize: 13, fontWeight: 500 }}>{t(lang, 'epc.schedule.week')}</span>
          <span style={{ color: '#EAECEF', fontSize: 32, fontWeight: 800, letterSpacing: -0.5 }}>{t(lang, 'epc.schedule.title')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '0 4px', height: 36, borderRadius: 9, background: '#0A0A0A', border: '1px solid #1A1A1A' }}>
            <button style={calBtn}>&lt;</button>
            <button style={{ ...calBtn, background: '#1A1A1A', color: '#fff' }}>{t(lang, 'epc.schedule.weekView')}</button>
            <button style={calBtn}>{t(lang, 'epc.schedule.monthView')}</button>
            <button style={calBtn}>&gt;</button>
          </div>
          <button style={btnPrimary}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={{ color: '#0A0617' }}>
              <path d={Icons.plus} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t(lang, 'epc.schedule.addJob')}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14 }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 14, padding: '0 18px', height: 90,
            borderRadius: 14, border: s.highlight ? '1.5px solid #F59E0B40' : '1px solid #1A1A1A',
            background: s.highlight ? 'linear-gradient(135deg, #FBBF2425, #F59E0B12)' : '#0A0A0A',
            backdropFilter: 'blur(20px)',
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <path d={Icons[s.icon as keyof typeof Icons]} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ color: '#EAECEF', fontSize: 20, fontWeight: 800 }}>{s.value}</span>
              <span style={{ color: '#5E6673', fontSize: 11 }}>{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        background: 'linear-gradient(135deg, #FFFFFF08, #FFFFFF03)', borderRadius: 18,
        border: '1px solid #1A1A1A', backdropFilter: 'blur(30px)', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ padding: '22px 24px 0' }}>
          <span style={{ color: '#5E6673', fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>WEEK CALENDAR · JUL 7 — JUL 13</span>
        </div>
        <div style={{ height: 1, background: '#1A1A1A', margin: '14px 0 0' }} />
        <div style={{ display: 'flex', height: 42, borderBottom: '1px solid #1A1A1A' }}>
          {days.map((d, i) => (
            <div key={i} style={{
              flex: i === 6 ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: i === today ? '#F59E0B' : i === 6 ? '#3F3F46' : '#848E9C',
              fontSize: 11, fontWeight: i === today ? 800 : 700, letterSpacing: 1,
              borderRight: i < 6 ? '1px solid #0A0A0A' : 'none',
            }}>
              {d} · {7 + i}{i === today ? ' · TODAY' : ''}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
          <div style={{ width: 80, display: 'flex', flexDirection: 'column', borderRight: '1px solid #0A0A0A' }}>
            {hourLabels.map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', padding: '4px 12px 0 0' }}>
                <span style={{ color: '#5E6673', fontSize: 10, fontWeight: 600 }}>{h}</span>
              </div>
            ))}
          </div>
          <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
            {days.map((_, di) => (
              <div key={di} style={{
                flex: di === 6 ? 0.7 : 1, position: 'relative',
                borderRight: di < 6 ? '1px solid #0A0A0A' : 'none',
              }}>
                {hourLabels.map((_, hi) => (
                  <div key={hi} style={{ height: `${100 / hourLabels.length}%`, borderTop: hi > 0 ? '1px solid #FFFFFF05' : 'none' }} />
                ))}
                {events.filter(e => e.day === di).map((ev, ei) => (
                  <div key={ei} style={{
                    position: 'absolute', left: 2, right: 2, top: `${ev.top / 5.4}%`, height: `${ev.h / 5.4}%`,
                    background: ev.color, borderRadius: 10, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 1,
                    boxShadow: ev.highlight ? '0 6px 24px rgba(245,158,11,0.5)' : '0 4px 16px rgba(0,0,0,0.3)',
                    overflow: 'hidden', zIndex: ev.highlight ? 2 : 1,
                  }}>
                    <span style={{ color: ev.color === '#F59E0B' ? '#0A0617' : '#fff', fontWeight: 800, fontSize: ev.h > 100 ? 10 : 9 }}>{ev.title}</span>
                    {ev.h > 80 && <>
                      <span style={{ color: ev.color === '#F59E0B' ? '#0A0617' : '#fff', fontWeight: 800, fontSize: 11 }}>{ev.name}</span>
                      <span style={{ color: ev.color === '#F59E0B' ? '#0A061799' : '#ffffffCC', fontWeight: 600, fontSize: 10 }}>{ev.sub}</span>
                      {ev.addr && <span style={{ color: ev.color === '#F59E0B' ? '#0A0617' : '#fff', fontWeight: 700, fontSize: 9 }}>{ev.addr}</span>}
                      {ev.payout && <span style={{ color: ev.color === '#F59E0B' ? '#0A0617' : '#fff', fontWeight: 800, fontSize: 10 }}>{ev.payout}</span>}
                    </>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

const monthImages = [60, 75, 85, 65, 80, 95];
const calBtn: React.CSSProperties = { padding: '6px 10px', borderRadius: 7, border: 'none', cursor: 'pointer', color: '#848E9C', fontSize: 11, fontWeight: 600, fontFamily: 'inherit', background: 'transparent' };
const Card = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 24, background: '#0E0E10', borderRadius: 18, border: '1px solid #1A1A1A', ...style }}>{children}</div>
);
const btnGreen: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 8, padding: '0 18px', height: 40, background: '#02C076', borderRadius: 10, border: 'none', cursor: 'pointer', color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: 'inherit', boxShadow: '0 6px 20px #10B98130' };
const btnPrimary: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 6, padding: '0 18px', height: 40, background: '#F59E0B', borderRadius: 10, border: 'none', cursor: 'pointer', color: '#0A0617', fontSize: 14, fontWeight: 700, fontFamily: 'inherit' };

