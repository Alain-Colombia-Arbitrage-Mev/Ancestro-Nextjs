'use client';
import { useRouter, usePathname } from 'next/navigation';
import { t } from '@/i18n/translations';
import { useAuth } from '@/lib/auth-context';
import { Ic } from './shared';

interface SettingsViewProps {
  lang: string;
  role: string;
}

export function SettingsView({ lang, role }: SettingsViewProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (!user) return null;

  const switchLang = (target: 'es' | 'en') => {
    const next = (pathname || '/').replace(/^\/(es|en)(\/|$)/, `/${target}$2`);
    router.push(next.startsWith('/') ? next : `/${target}/dashboard`);
  };
  const currentLang: 'es' | 'en' = (lang === 'en' ? 'en' : 'es');

  return (
    <>
      <div className="dash-header dash-fade">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#A1A1A6', fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>
            {t(lang, 'settings.kicker')}
          </span>
          <h1 style={{ color: '#EDEDEE', fontSize: 28, fontWeight: 600, letterSpacing: -0.2, margin: 0 }}>
            {t(lang, 'settings.title')}
          </h1>
          <span style={{ color: '#A1A1A6', fontSize: 13 }}>{t(lang, 'settings.subtitle')}</span>
        </div>
      </div>

      {/* Profile card */}
      <Section title={t(lang, 'settings.section.profile')}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 12,
            background: '#F59E0B', color: '#0A0617',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 700,
          }}>
            {(user.name || user.email)[0]?.toUpperCase() || 'U'}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ color: '#EDEDEE', fontSize: 16, fontWeight: 600 }}>{user.name || '—'}</span>
            <span style={{ color: '#A1A1A6', fontSize: 13 }}>{user.email}</span>
          </div>
          <span style={{
            padding: '4px 10px', borderRadius: 6,
            background: '#F59E0B14', border: '1px solid #F59E0B33',
            color: '#F59E0B', fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
          }}>
            {role}
          </span>
        </div>
      </Section>

      {/* Account info */}
      <Section title={t(lang, 'settings.section.account')}>
        <Row label={t(lang, 'settings.account.email')} value={user.email} />
        <Row label={t(lang, 'settings.account.name')}  value={user.name || '—'} />
        <Row label={t(lang, 'settings.account.role')}  value={role} />
        <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type="button" className="dash-btn" style={ghostBtn}>
            <Ic n="edit" s={12} /> {t(lang, 'settings.account.editProfile')}
          </button>
          <button type="button" className="dash-btn" style={ghostBtn} onClick={() => router.push(`/${lang}/forgot-password`)}>
            <Ic n="shield" s={12} /> {t(lang, 'settings.account.changePassword')}
          </button>
        </div>
      </Section>

      {/* Preferences */}
      <Section title={t(lang, 'settings.section.preferences')}>
        <Row label={t(lang, 'settings.pref.language')} value={(
          <div style={{ display: 'flex', gap: 6 }}>
            <LangPill active={currentLang === 'es'} onClick={() => switchLang('es')}>Español</LangPill>
            <LangPill active={currentLang === 'en'} onClick={() => switchLang('en')}>English</LangPill>
          </div>
        )} />
        <Row label={t(lang, 'settings.pref.theme')} value={(
          <span style={{ color: '#A1A1A6', fontSize: 12 }}>
            {t(lang, 'settings.pref.themeDark')} · <span style={{ color: '#6B6B71' }}>{t(lang, 'settings.pref.themeFixed')}</span>
          </span>
        )} />
      </Section>

      {/* Danger zone */}
      <Section title={t(lang, 'settings.section.session')} borderColor="#E5484D33">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ color: '#EDEDEE', fontSize: 13, fontWeight: 600 }}>{t(lang, 'settings.session.title')}</span>
            <span style={{ color: '#A1A1A6', fontSize: 12 }}>{t(lang, 'settings.session.sub')}</span>
          </div>
          <button
            type="button"
            className="dash-btn"
            onClick={logout}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              height: 36, padding: '0 14px', borderRadius: 8,
              background: 'transparent', border: '1px solid #E5484D66',
              color: '#E5484D', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            <Ic n="log-out" s={14} /> {t(lang, 'menu.logout')}
          </button>
        </div>
      </Section>
    </>
  );
}

function Section({ title, children, borderColor }: { title: string; children: React.ReactNode; borderColor?: string }) {
  return (
    <div className="dash-card dash-fade-1" style={{
      display: 'flex', flexDirection: 'column', gap: 12, padding: 18,
      background: '#101013', border: `1px solid ${borderColor || '#1F1F23'}`, borderRadius: 8,
    }}>
      <span style={{ color: '#A1A1A6', fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>
        {title}
      </span>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
      padding: '8px 0', borderBottom: '1px solid #16161A',
    }}>
      <span style={{ color: '#A1A1A6', fontSize: 12 }}>{label}</span>
      <span style={{ color: '#EDEDEE', fontSize: 13, fontWeight: 500 }}>{value}</span>
    </div>
  );
}

const ghostBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  height: 32, padding: '0 12px', borderRadius: 6,
  background: 'transparent', border: '1px solid #1F1F23',
  color: '#A1A1A6', fontFamily: 'inherit', fontSize: 12, fontWeight: 500, cursor: 'pointer',
};

function LangPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="dash-btn"
      style={{
        height: 28, padding: '0 10px', borderRadius: 6,
        border: '1px solid', borderColor: active ? '#F59E0B' : '#1F1F23',
        background: active ? '#F59E0B14' : 'transparent',
        color: active ? '#F59E0B' : '#A1A1A6',
        fontFamily: 'inherit', fontSize: 11, fontWeight: 600, cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}
