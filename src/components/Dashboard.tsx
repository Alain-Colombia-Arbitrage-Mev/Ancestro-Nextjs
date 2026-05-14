'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { t } from '@/i18n/translations';
import { useAuth } from '@/lib/auth-context';
import { isAdminEmail } from '@/lib/admin';
import {
  Ic, btnP, centered, useMediaQuery,
} from './dashboard/shared';
import { Sidebar } from './dashboard/Sidebar';
import {
  customerNav, epcNav, investorNav, supportCards,
  type Role, type CustomerTab, type EpcTab, type InvestorTab,
} from './dashboard/navItems';
import AffiliateView from './dashboard/AffiliateView';
import CustomerView from './dashboard/CustomerView';
import EpcDashboardView from './dashboard/EpcDashboardView';
import EpcEarningsView from './dashboard/EpcEarningsView';
import EpcScheduleView from './dashboard/EpcScheduleView';
import EpcActiveJobsView from './dashboard/EpcActiveJobsView';
import EpcMaterialsView from './dashboard/EpcMaterialsView';
import EpcTeamView from './dashboard/EpcTeamView';
import { TabPlaceholder } from './dashboard/TabPlaceholder';
import InvestorOverview from './dashboard/investor/InvestorOverview';
import InvestorRoiCalculator from './dashboard/investor/InvestorRoiCalculator';
import InvestorElectrolineraDetail from './dashboard/investor/InvestorElectrolineraDetail';
import InvestorPortfolioView from './dashboard/investor/InvestorPortfolioView';
import InvestorOpportunitiesView from './dashboard/investor/InvestorOpportunitiesView';
import InvestorWalletView from './dashboard/investor/InvestorWalletView';
import CustomerEnergyView from './dashboard/CustomerEnergyView';
import CustomerBillsView from './dashboard/CustomerBillsView';
import { DashboardDataProvider } from './dashboard/DashboardDataProvider';
import { SettingsView } from './dashboard/SettingsView';

/** End-user roles. Admin lives on a separate panel at /[lang]/admin. */
type EndUserRole = Exclude<Role, 'admin'>;

export default function Dashboard({ lang, children }: { lang: string; children?: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<EndUserRole>('customer');

  const [customerTab, setCustomerTab] = useState<CustomerTab>('my-solar');
  const [epcTab, setEpcTab] = useState<EpcTab>('dashboard');
  const [invTab, setInvTab] = useState<InvestorTab>('overview');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 900px)');

  useEffect(() => {
    if (user?.role) {
      const m: EndUserRole = user.role === 'installer' ? 'epc'
        : user.role === 'investor' ? 'investor'
        : 'customer';
      setRole(m);
    }
  }, [user?.role]);

  useEffect(() => { if (!isMobile) setDrawerOpen(false); }, [isMobile]);
  useEffect(() => { setDrawerOpen(false); }, [role, customerTab, epcTab, invTab]);

  if (isLoading) return <div style={centered}><span style={{ color: '#848E9C', fontSize: 16 }}>{t(lang, 'auth.loading')}</span></div>;
  if (!user) {
    return (
      <div style={{ ...centered, flexDirection: 'column', gap: 20 }}>
        <Ic n="shield" s={64} c="#F59E0B" />
        <h2 style={{ color: '#EAECEF', fontSize: 24, fontWeight: 800, margin: 0 }}>{t(lang, 'auth.required')}</h2>
        <p style={{ color: '#848E9C', fontSize: 14, margin: 0 }}>{t(lang, 'auth.requiredDesc')}</p>
        <button onClick={() => router.push(`/${lang}/login`)} style={btnP} className="dash-btn">{t(lang, 'auth.login')}</button>
      </div>
    );
  }

  const userRole: EndUserRole = user.role === 'installer' ? 'epc' : user.role === 'investor' ? 'investor' : 'customer';
  const isAdmin = isAdminEmail(user.email);
  // Admins can also impersonate any end-user role from /dashboard for QA;
  // their primary destination is /[lang]/admin though.
  const allowedRoles: EndUserRole[] = isAdmin ? ['customer', 'epc', 'investor'] : [userRole];
  const activeRole: EndUserRole = allowedRoles.includes(role) ? role : userRole;

  const roleSwitcher = isAdmin ? (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '0 16px' }}>
        <span style={{ color: '#5E6673', fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>
          {t(lang, 'dashboard.sidebar.role')}
        </span>
        <button
          type="button"
          onClick={() => router.push(`/${lang}/admin`)}
          className="dash-btn"
          style={{
            height: 20, padding: '0 8px', borderRadius: 6,
            background: '#F59E0B', color: '#0A0617',
            fontSize: 9, fontWeight: 800, fontFamily: 'inherit',
            letterSpacing: 0.5, border: 'none', cursor: 'pointer',
          }}
        >
          ADMIN PANEL →
        </button>
      </div>
      <div style={{ display: 'flex', gap: 4, padding: '0 12px', flexWrap: 'wrap' }}>
        {(['customer', 'epc', 'investor'] as EndUserRole[]).map(r => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className="dash-btn"
            style={{
              height: 24, padding: '0 8px', borderRadius: 6,
              border: '1px solid', borderColor: activeRole === r ? '#F59E0B' : '#1A1A1A',
              background: activeRole === r ? '#F59E0B18' : 'transparent',
              color: activeRole === r ? '#F59E0B' : '#848E9C',
              fontSize: 10, fontWeight: 700, fontFamily: 'inherit',
              textTransform: 'capitalize',
            }}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  ) : undefined;

  let sidebar: React.ReactNode = null;
  if (activeRole === 'customer') {
    sidebar = (
      <Sidebar<CustomerTab>
        lang={lang} items={customerNav} activeId={customerTab} onSelect={setCustomerTab}
        support={supportCards.customer} open={drawerOpen} isAdmin={isAdmin} roleSwitcher={roleSwitcher}
      />
    );
  } else if (activeRole === 'epc') {
    sidebar = (
      <Sidebar<EpcTab>
        lang={lang} items={epcNav} activeId={epcTab} onSelect={setEpcTab}
        support={supportCards.epc} open={drawerOpen} isAdmin={isAdmin} roleSwitcher={roleSwitcher}
      />
    );
  } else if (activeRole === 'investor') {
    sidebar = (
      <Sidebar<InvestorTab>
        lang={lang} items={investorNav} activeId={invTab} onSelect={setInvTab}
        support={supportCards.investor} open={drawerOpen} isAdmin={isAdmin} roleSwitcher={roleSwitcher}
      />
    );
  }

  let content: React.ReactNode = null;
  if (activeRole === 'customer') {
    if (customerTab === 'my-solar') content = <CustomerView lang={lang} user={user} />;
    else if (customerTab === 'energy') content = <CustomerEnergyView lang={lang} />;
    else if (customerTab === 'bills')  content = <CustomerBillsView lang={lang} />;
    else if (customerTab === 'refer') content = <AffiliateView lang={lang} user={user} />;
    else if (customerTab === 'settings') content = <SettingsView lang={lang} role={activeRole} />;
    else content = <TabPlaceholder lang={lang} labelKey={`sidebar.customer.${customerTab}`} />;
  } else if (activeRole === 'epc') {
    if (epcTab === 'dashboard') content = <EpcDashboardView lang={lang} />;
    else if (epcTab === 'active-jobs') content = <EpcActiveJobsView lang={lang} />;
    else if (epcTab === 'materials') content = <EpcMaterialsView lang={lang} />;
    else if (epcTab === 'team') content = <EpcTeamView lang={lang} />;
    else if (epcTab === 'earnings') content = <EpcEarningsView lang={lang} />;
    else if (epcTab === 'schedule') content = <EpcScheduleView lang={lang} />;
    else if (epcTab === 'refer') content = <AffiliateView lang={lang} user={user} />;
    else if (epcTab === 'settings') content = <SettingsView lang={lang} role={activeRole} />;
    else content = <TabPlaceholder lang={lang} labelKey={`sidebar.epc.${epcTab}`} />;
  } else if (activeRole === 'investor') {
    if (invTab === 'overview') content = <InvestorOverview lang={lang} user={user} />;
    else if (invTab === 'portfolio') content = <InvestorPortfolioView lang={lang} />;
    else if (invTab === 'projects')  content = <InvestorOpportunitiesView lang={lang} />;
    else if (invTab === 'wallet')    content = <InvestorWalletView lang={lang} />;
    else if (invTab === 'roi') content = <InvestorRoiCalculator lang={lang} user={user} />;
    else if (invTab === 'electrolineras') content = <InvestorElectrolineraDetail lang={lang} user={user} />;
    else if (invTab === 'my-solar') content = <CustomerView lang={lang} user={user} />;
    else if (invTab === 'energy') content = <CustomerEnergyView lang={lang} />;
    else if (invTab === 'bills') content = <CustomerBillsView lang={lang} />;
    else if (invTab === 'refer') content = <AffiliateView lang={lang} user={user} />;
    else if (invTab === 'settings') content = <SettingsView lang={lang} role={activeRole} />;
    else content = <TabPlaceholder lang={lang} labelKey={`sidebar.inv.${invTab}`} />;
  }

  return (
    <div className="dash-shell">
      <div className="dash-mobile-bar">
        <button
          aria-label="Open menu"
          onClick={() => setDrawerOpen(true)}
          className="dash-btn"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 40, height: 40, borderRadius: 10,
            background: '#0E0E10', border: '1px solid #1A1A1A', color: '#EAECEF',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>

      <div
        className={`dash-overlay${drawerOpen ? ' open' : ''}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {sidebar}

      <main className="dash-content">
        <DashboardDataProvider lang={lang} userId={user.id || user.email}>
          {children ?? content}
        </DashboardDataProvider>
      </main>
    </div>
  );
}
