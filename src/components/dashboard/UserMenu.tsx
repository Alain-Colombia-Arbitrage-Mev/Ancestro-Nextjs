'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { t } from '@/i18n/translations';
import { useAuth } from '@/lib/auth-context';
import { Ic } from './shared';

interface UserMenuProps {
  lang: string;
  /** Optional handler to open the in-app Settings tab. If omitted, navigates to a settings page. */
  onOpenSettings?: () => void;
  onOpenProfile?: () => void;
}

export function UserMenu({ lang, onOpenSettings, onOpenProfile }: UserMenuProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click + ESC
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!user) return null;

  const firstName = (user.name || user.email).split(/\s+|@/)[0];
  const initial = firstName[0]?.toUpperCase() || 'U';

  const switchLang = (target: 'es' | 'en') => {
    const next = (pathname || '/').replace(/^\/(es|en)(\/|$)/, `/${target}$2`);
    router.push(next.startsWith('/') ? next : `/${target}/dashboard`);
    setOpen(false);
  };
  const currentLang: 'es' | 'en' = (lang === 'en' ? 'en' : 'es');

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        className="dash-btn"
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          height: 36, padding: '0 4px 0 4px',
          background: 'transparent', border: '1px solid #1F1F23', borderRadius: 8,
          cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        <span style={{
          width: 28, height: 28, borderRadius: 6,
          background: '#F59E0B', color: '#0A0617',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700,
        }}>{initial}</span>
        <span style={{ color: '#EDEDEE', fontSize: 13, fontWeight: 500, paddingRight: 6 }}>
          {firstName}
        </span>
        <Ic n="chevron-down" s={12} c="#A1A1A6" />
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute', right: 0, top: 'calc(100% + 6px)',
            minWidth: 240, padding: 6, zIndex: 80,
            background: '#101013', border: '1px solid #1F1F23', borderRadius: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            display: 'flex', flexDirection: 'column', gap: 2,
          }}
        >
          {/* Header */}
          <div style={{ padding: '10px 10px 8px', borderBottom: '1px solid #1F1F23', marginBottom: 4 }}>
            <div style={{ color: '#EDEDEE', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.name || firstName}
            </div>
            <div style={{ color: '#A1A1A6', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email}
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', marginTop: 6,
              padding: '2px 6px', borderRadius: 4,
              background: '#F59E0B14', border: '1px solid #F59E0B33',
              color: '#F59E0B', fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
            }}>
              {user.role || 'user'}
            </div>
          </div>

          <MenuItem
            icon="user"
            label={t(lang, 'menu.profile')}
            onClick={() => { onOpenProfile?.(); setOpen(false); }}
          />
          <MenuItem
            icon="settings"
            label={t(lang, 'menu.settings')}
            onClick={() => { onOpenSettings?.(); setOpen(false); }}
          />

          <div style={{ height: 1, background: '#1F1F23', margin: '4px 0' }} />

          <div style={{ padding: '4px 10px', color: '#6B6B71', fontSize: 10, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>
            {t(lang, 'menu.language')}
          </div>
          <div style={{ display: 'flex', gap: 4, padding: '0 6px 6px' }}>
            <LangPill active={currentLang === 'es'} onClick={() => switchLang('es')}>ES</LangPill>
            <LangPill active={currentLang === 'en'} onClick={() => switchLang('en')}>EN</LangPill>
          </div>

          <div style={{ height: 1, background: '#1F1F23', margin: '4px 0' }} />

          <MenuItem
            icon="log-out"
            label={t(lang, 'menu.logout')}
            tone="danger"
            onClick={() => { setOpen(false); logout(); }}
          />
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon, label, onClick, tone = 'default',
}: {
  icon: 'user' | 'settings' | 'log-out';
  label: string;
  onClick: () => void;
  tone?: 'default' | 'danger';
}) {
  const color = tone === 'danger' ? '#E5484D' : '#EDEDEE';
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="dash-btn"
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        height: 34, padding: '0 10px', borderRadius: 6,
        background: 'transparent', border: 'none',
        color, fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
        cursor: 'pointer', textAlign: 'left', width: '100%',
      }}
    >
      <Ic n={icon} s={14} c={tone === 'danger' ? '#E5484D' : '#A1A1A6'} />
      {label}
    </button>
  );
}

function LangPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="dash-btn"
      style={{
        flex: 1, height: 28, borderRadius: 6,
        border: '1px solid', borderColor: active ? '#F59E0B' : '#1F1F23',
        background: active ? '#F59E0B14' : 'transparent',
        color: active ? '#F59E0B' : '#A1A1A6',
        fontFamily: 'inherit', fontSize: 11, fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}
