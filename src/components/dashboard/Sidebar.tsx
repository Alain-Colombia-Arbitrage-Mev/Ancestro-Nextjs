'use client';
import { t } from '@/i18n/translations';
import { CDN_URL } from '@/lib/cdn';
import { Ic } from './shared';
import type { NavItem, Role, SupportCard } from './navItems';

interface SidebarProps<T extends string> {
  lang: string;
  items: NavItem<T>[];
  activeId: T;
  onSelect: (id: T) => void;
  support: SupportCard;
  open?: boolean;          // mobile drawer state
  onClose?: () => void;
  /** Optional role-switcher (admin only). Rendered above the nav list. */
  roleSwitcher?: React.ReactNode;
  /** Optional admin badge next to the logo */
  isAdmin?: boolean;
}

export function Sidebar<T extends string>({
  lang, items, activeId, onSelect, support, open, isAdmin, roleSwitcher,
}: SidebarProps<T>) {
  return (
    <aside className={`dash-sidebar${open ? ' open' : ''}`}>
      {/* Logo only — matches Pencil iiPJA */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '4px 12px', height: 52, marginBottom: isAdmin || roleSwitcher ? 16 : 28 }}>
        <img
          src={`${CDN_URL}/logo.svg`}
          alt="Ancestro"
          style={{ height: 32, width: 'auto', objectFit: 'contain' }}
        />
      </div>

      {/* Role section — separate row BELOW the logo */}
      {(isAdmin || roleSwitcher) && (
        <div style={{ marginBottom: 16 }}>
          {roleSwitcher}
        </div>
      )}

      {/* Nav list — matches Pencil oBf2e */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              className={`dash-nav-item${active ? ' active' : ''}`}
              onClick={() => onSelect(item.id)}
            >
              <span className="dash-nav-icon" style={{ display: 'inline-flex' }}>
                <Ic n={item.icon} s={18} />
              </span>
              <span className="dash-nav-label">{t(lang, item.labelKey)}</span>
              {item.badge && (
                <span
                  className="dash-nav-badge"
                  style={{ background: item.badge.bg, color: item.badge.fg }}
                >
                  {item.badge.text}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Support card — matches Pencil W7FaMe / ZWcpC */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 6, padding: 18,
        background: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: 14,
      }}>
        <Ic n={support.icon} s={20} c={support.iconColor} />
        <span style={{
          color: support.titleColor, fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
        }}>
          {t(lang, support.titleKey)}
        </span>
        <span style={{ color: '#848E9C', fontSize: 11, fontFamily: 'inherit' }}>
          {t(lang, support.subKey)}
        </span>
        <button
          className="dash-btn"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: 34, marginTop: 4,
            background: '#02C07618', border: '1px solid #02C07640', borderRadius: 8,
            color: '#02C076', fontFamily: 'inherit', fontSize: 11, fontWeight: 700, cursor: 'pointer',
          }}
        >
          {t(lang, support.buttonKey)}
        </button>
      </div>
    </aside>
  );
}
