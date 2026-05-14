'use client';
import { t } from '@/i18n/translations';
import { Ic } from './shared';
import { UserMenu } from './UserMenu';
import { demoEpcTeam } from '@/lib/demoData';

const ROLE_ICONS: Record<string, 'hardhat' | 'zap' | 'shield-check' | 'user'> = {
  foreman: 'hardhat',
  electrician: 'zap',
  inspector: 'shield-check',
  apprentice: 'user',
};

export default function EpcTeamView({ lang }: { lang: string }) {
  const members = demoEpcTeam;
  const available = members.filter(m => m.available).length;
  const onJob = members.filter(m => !m.available).length;
  const avgRating = +(members.reduce((s, m) => s + m.rating, 0) / members.length).toFixed(2);

  return (
    <>
      <div className="dash-header dash-fade">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#A1A1A6', fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>
            {t(lang, 'sidebar.epc.team')}
          </span>
          <h1 style={{ color: '#EDEDEE', fontSize: 28, fontWeight: 600, letterSpacing: -0.2, margin: 0 }}>
            {t(lang, 'epc.team.title')}
          </h1>
          <span style={{ color: '#A1A1A6', fontSize: 13 }}>{members.length} {t(lang, 'epc.team.members')}</span>
        </div>
        <UserMenu lang={lang} />
      </div>

      <div className="dash-grid-3col dash-fade-1">
        <Kpi label={t(lang, 'epc.team.onJob')}     value={String(onJob)}      sub={t(lang, 'epc.team.activelyWorking')} accent="#F59E0B" />
        <Kpi label={t(lang, 'epc.team.available')} value={String(available)}  sub={t(lang, 'epc.team.readyToAssign')}   accent="#2BB673" />
        <Kpi label={t(lang, 'epc.team.avgRating')} value={`${avgRating} ★`}   sub={t(lang, 'epc.team.lastQuarter')}     accent="#FBBF24" />
      </div>

      <div className="dash-grid-2col dash-fade-2">
        {members.map(m => {
          const initials = m.name.split(' ').map(p => p[0]).slice(0, 2).join('');
          return (
            <div key={m.id} className="dash-card" style={{
              display: 'flex', gap: 14, padding: 16,
              background: '#101013', border: '1px solid #1F1F23', borderRadius: 8,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 8,
                background: m.avatarTone, color: '#0A0617',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                fontSize: 15, fontWeight: 700,
              }}>{initials}</div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ color: '#EDEDEE', fontSize: 14, fontWeight: 600 }}>{m.name}</span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '1px 6px', borderRadius: 4,
                    background: '#16161A', border: '1px solid #1F1F23',
                    color: '#A1A1A6', fontSize: 10, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase',
                  }}>
                    <Ic n={ROLE_ICONS[m.role]} s={10} />
                    {t(lang, `epc.team.role.${m.role}`)}
                  </span>
                </div>
                <span style={{ color: '#A1A1A6', fontSize: 11 }}>
                  {m.certs.join(' · ')}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                  <span style={{ color: '#FBBF24', fontSize: 12, fontWeight: 600 }}>
                    ★ {m.rating.toFixed(2)} <span style={{ color: '#6B6B71', fontSize: 11 }}>({m.reviews})</span>
                  </span>
                  <span style={{ color: '#6B6B71', fontSize: 11 }}>·</span>
                  {m.available ? (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      color: '#2BB673', fontSize: 11, fontWeight: 600,
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: 3, background: '#2BB673' }} />
                      {t(lang, 'epc.team.statusAvail')}
                    </span>
                  ) : (
                    <span style={{ color: '#F59E0B', fontSize: 11, fontWeight: 600 }}>
                      {t(lang, 'epc.team.onJobNow')} {m.currentJob}
                    </span>
                  )}
                </div>
              </div>
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
