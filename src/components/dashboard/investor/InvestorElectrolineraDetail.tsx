'use client';
import { t } from '@/i18n/translations';
import { Ic, goldGrad } from '../shared';
import { UserMenu } from '../UserMenu';
import { InvestorSidePanel } from './InvestorSidePanel';
import { InvestorProjectsList, type InvestorProjectRow } from './InvestorProjectsList';

interface Props { lang: string; user: { name: string; email: string } }

export default function InvestorElectrolineraDetail({ lang, user }: Props) {
  const firstName = (user.name || user.email).split(/\s+|@/)[0];

  const tiles = [
    { tone: '#F59E0B' as const, label: t(lang, 'inv.el.revenueToday'), value: '$284',   sub: '42 kW dispensed',         icon: 'dollar-sign' as const },
    { tone: '#02C076' as const, label: t(lang, 'inv.el.avgFreq'),       value: '$6.76',  sub: '42 sessions today',        icon: 'zap' as const },
    { tone: '#A78BFA' as const, label: t(lang, 'inv.el.uptime'),        value: '99.2 %', sub: t(lang, 'inv.el.uptimeSub'),icon: 'shield-check' as const },
    { tone: '#FBBF24' as const, label: t(lang, 'inv.el.yourShareYtd'),  value: '$1,420', sub: t(lang, 'inv.el.yourShareSub'), icon: 'star' as const },
  ];

  const sessions: InvestorProjectRow[] = [
    { time: '10:30', period: 'AM', tag: 'IN PROGRESS', customer: 'Tesla Model Y',  system: 'Bay 02 · 120 kW', addr: 'Session #4528', amount: '$8.40', active: true },
    { time: '11:55', period: 'AM', tag: 'COMPLETED',    customer: 'BYD Atto 3',     system: 'Bay 01 · 90 kW',  addr: 'Session #4527', amount: '$5.20' },
    { time: '12:12', period: 'PM', tag: 'COMPLETED',    customer: 'Renault Megane', system: 'Bay 03 · 60 kW',  addr: 'Session #4526', amount: '$3.10' },
  ];

  return (
    <>
      <div className="dash-header dash-fade">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#02C076', fontSize: 11, fontWeight: 800, letterSpacing: 1.5 }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 4, background: '#02C076', marginRight: 6 }} className="dash-live-dot" />
            ONLINE · ESTACIÓN 04
          </span>
          <h1 style={{ color: '#F5F3FF', fontSize: 32, fontWeight: 800, letterSpacing: -0.5, margin: 0 }}>
            {t(lang, 'inv.el.title')}
          </h1>
          <span style={{ color: '#5E6673', fontSize: 13 }}>{t(lang, 'inv.el.subtitle')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="dash-btn" style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 14px', background: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: 10, color: '#A1A1AA', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>
            <Ic n="settings" s={14} /> {t(lang, 'inv.el.configure')}
          </button>
          <UserMenu lang={lang} />
        </div>
      </div>

      <div className="dash-grid-4col dash-fade-1">
        {tiles.map((k, i) => (
          <div key={i} className="dash-card" style={{
            display: 'flex', flexDirection: 'column', gap: 8, padding: 20,
            background: '#0E0E10', border: `1px solid ${k.tone}40`, borderRadius: 16,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#5E6673', fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase' }}>{k.label}</span>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `${k.tone}18`, border: `1px solid ${k.tone}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ic n={k.icon} s={14} c={k.tone} />
              </div>
            </div>
            <span style={{ color: '#F5F3FF', fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>{k.value}</span>
            <span style={{ color: k.tone, fontSize: 11, fontWeight: 600 }}>{k.sub}</span>
          </div>
        ))}
      </div>

      <div className="dash-grid-hero">
        <InvestorProjectsList lang={lang} rows={sessions} title={t(lang, 'inv.el.sessions')} />
        <InvestorSidePanel
          lang={lang}
          mapTitle={t(lang, 'inv.el.location')}
          mapSub="Av. Reforma 47, CDMX"
          bannerTitle={t(lang, 'inv.el.allOnline')}
          bannerSub={t(lang, 'inv.el.allOnlineSub')}
          materials={[
            { label: t(lang, 'inv.el.bay1'), value: 'Online',  statusLabel: 'Online',  statusColor: '#02C076' },
            { label: t(lang, 'inv.el.bay2'), value: 'In use',  statusLabel: 'In use',  statusColor: '#F59E0B' },
            { label: t(lang, 'inv.el.bay3'), value: 'Online',  statusLabel: 'Online',  statusColor: '#02C076' },
            { label: t(lang, 'inv.el.grid'), value: 'Stable',  statusLabel: 'Stable',  statusColor: '#02C076' },
          ]}
        />
      </div>
    </>
  );
}
