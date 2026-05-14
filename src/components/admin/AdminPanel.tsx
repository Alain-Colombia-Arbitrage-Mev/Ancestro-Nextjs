'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { t } from '@/i18n/translations';
import { useAuth } from '@/lib/auth-context';
import { isAdminEmail } from '@/lib/admin';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { adminNav, supportCards, type AdminTab } from '@/components/dashboard/navItems';
import { Ic, btnP, centered, useMediaQuery, glassBg, fmtMoney } from '@/components/dashboard/shared';
import { AdminOverview } from './AdminOverview';
import { AdminUsersTable } from './AdminUsersTable';
import { AdminProjectsView } from './AdminProjectsView';
import { AdminCommissionsView } from './AdminCommissionsView';
import { AdminAuditView } from './AdminAuditView';
import { TabPlaceholder } from '@/components/dashboard/TabPlaceholder';

export default function AdminPanel({ lang }: { lang: string }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<AdminTab>('overview');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 900px)');

  useEffect(() => { if (!isMobile) setDrawerOpen(false); }, [isMobile]);
  useEffect(() => { setDrawerOpen(false); }, [tab]);

  if (isLoading) return <div style={centered}><span style={{ color: '#848E9C', fontSize: 16 }}>{t(lang, 'auth.loading')}</span></div>;

  if (!user || !isAdminEmail(user.email)) {
    return (
      <div style={{ ...centered, flexDirection: 'column', gap: 16 }}>
        <Ic n="shield" s={64} c="#F59E0B" />
        <h2 style={{ color: '#EAECEF', fontSize: 24, fontWeight: 800, margin: 0 }}>{t(lang, 'admin.forbidden')}</h2>
        <p style={{ color: '#848E9C', fontSize: 14, margin: 0 }}>{t(lang, 'admin.forbiddenDesc')}</p>
        <button onClick={() => router.push(`/${lang}/dashboard`)} style={btnP} className="dash-btn">
          {t(lang, 'admin.backToDashboard')}
        </button>
      </div>
    );
  }

  const goBackToUserDashboard = (
    <div style={{ padding: '0 16px', marginBottom: 8 }}>
      <button
        type="button"
        onClick={() => router.push(`/${lang}/dashboard`)}
        className="dash-btn"
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          width: '100%', height: 28, padding: '0 10px', borderRadius: 8,
          background: '#0E0E10', border: '1px solid #1A1A1A', color: '#848E9C',
          fontSize: 10, fontWeight: 700, fontFamily: 'inherit', letterSpacing: 0.5,
          textTransform: 'uppercase',
        }}
      >
        ← {t(lang, 'admin.backToDashboard')}
      </button>
    </div>
  );

  let content: React.ReactNode = null;
  if (tab === 'overview') content = <AdminOverview lang={lang} />;
  else if (tab === 'users' || tab === 'customers' || tab === 'epcs' || tab === 'investors')
    content = <AdminUsersTable lang={lang} filter={tab} />;
  else if (tab === 'projects') content = <AdminProjectsView lang={lang} />;
  else if (tab === 'commissions') content = <AdminCommissionsView lang={lang} />;
  else if (tab === 'audit') content = <AdminAuditView lang={lang} />;
  else content = <TabPlaceholder lang={lang} labelKey={`sidebar.adm.${tab}`} />;

  return (
    <div className="dash-shell">
      <div className="dash-mobile-bar">
        <button
          aria-label="Open menu"
          onClick={() => setDrawerOpen(true)}
          className="dash-btn"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 10, background: '#0E0E10', border: '1px solid #1A1A1A', color: '#EAECEF' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <span style={{ color: '#F59E0B', fontSize: 13, fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase' }}>
          Admin
        </span>
      </div>

      <div className={`dash-overlay${drawerOpen ? ' open' : ''}`} onClick={() => setDrawerOpen(false)} aria-hidden="true" />

      <Sidebar<AdminTab>
        lang={lang}
        items={adminNav}
        activeId={tab}
        onSelect={setTab}
        support={supportCards.admin}
        open={drawerOpen}
        isAdmin
        roleSwitcher={goBackToUserDashboard}
      />

      <main className="dash-content">
        {content}
        {!isMobile && (
          <button
            onClick={logout}
            className="dash-btn"
            style={{
              position: 'fixed', right: 20, bottom: 20, zIndex: 40,
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 8,
              background: '#0E0E10', border: '1px solid #1A1A1A',
              color: '#848E9C', fontSize: 12, fontWeight: 500, fontFamily: 'inherit',
            }}
          >
            <Ic n="log-out" s={14} />
            {t(lang, 'auth.logout')}
          </button>
        )}
      </main>
    </div>
  );
}

export { glassBg, fmtMoney };
