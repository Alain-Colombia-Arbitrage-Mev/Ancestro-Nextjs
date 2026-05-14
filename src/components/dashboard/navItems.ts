import type { Icons } from './shared';

/**
 * Domain roles (matches backend `users.role`):
 *  - customer:  requests installations (can be referred)
 *  - epc:       installer, uploads projects (can be referred)
 *  - investor:  invests in installations + can act as customer (can be referred)
 *  - admin:     ops/admin staff, lives on a SEPARATE panel at /[lang]/admin
 *
 * Note: "affiliate" is NOT a role — every user can refer; "Refer & Earn"
 * shows up as a tab inside each role's sidebar.
 */
export type Role = 'customer' | 'epc' | 'investor' | 'admin';

export type CustomerTab = 'my-solar' | 'energy' | 'battery' | 'bills' | 'service' | 'refer' | 'settings';
export type EpcTab = 'dashboard' | 'active-jobs' | 'schedule' | 'map' | 'materials' | 'team' | 'earnings' | 'refer' | 'settings';
export type InvestorTab =
  | 'overview' | 'portfolio' | 'roi' | 'projects' | 'electrolineras'
  | 'documents' | 'wallet' | 'withdrawals'
  | 'my-solar' | 'energy' | 'bills'          // can also act as customer
  | 'refer' | 'settings';
export type AdminTab =
  | 'overview' | 'users' | 'customers' | 'epcs' | 'investors'
  | 'projects' | 'referrals' | 'commissions' | 'audit' | 'settings';

export interface NavItem<T extends string = string> {
  id: T;
  icon: keyof typeof Icons;
  labelKey: string;        // i18n key resolved at render time
  /** Renders a small chip next to the label. */
  badge?: { text: string; bg: string; fg: string };
}

export interface SupportCard {
  icon: keyof typeof Icons;
  iconColor: string;
  titleKey: string;
  titleColor: string;
  subKey: string;
  buttonKey: string;
}

/* --- Per-role nav config — matches Pencil 1:1 --- */

export const customerNav: NavItem<CustomerTab>[] = [
  { id: 'my-solar', icon: 'sun',              labelKey: 'sidebar.customer.mySolar' },
  { id: 'energy',   icon: 'chart-line',       labelKey: 'sidebar.customer.energy' },
  { id: 'battery',  icon: 'battery-charging', labelKey: 'sidebar.customer.battery' },
  { id: 'bills',    icon: 'file-text',        labelKey: 'sidebar.customer.bills' },
  { id: 'service',  icon: 'wrench',           labelKey: 'sidebar.customer.service' },
  { id: 'refer',    icon: 'gift',             labelKey: 'sidebar.customer.refer',
    badge: { text: 'NEW', bg: '#02C076', fg: '#0A0617' } },
  { id: 'settings', icon: 'settings',         labelKey: 'sidebar.customer.settings' },
];

export const epcNav: NavItem<EpcTab>[] = [
  { id: 'dashboard',   icon: 'layout-dashboard', labelKey: 'sidebar.epc.dashboard' },
  { id: 'active-jobs', icon: 'hardhat',          labelKey: 'sidebar.epc.activeJobs',
    badge: { text: '4', bg: '#F59E0B', fg: '#0A0617' } },
  { id: 'schedule',    icon: 'calendar',         labelKey: 'sidebar.epc.schedule' },
  { id: 'map',         icon: 'map',              labelKey: 'sidebar.epc.map' },
  { id: 'materials',   icon: 'package',          labelKey: 'sidebar.epc.materials' },
  { id: 'team',        icon: 'users',            labelKey: 'sidebar.epc.team' },
  { id: 'earnings',    icon: 'dollar-sign',      labelKey: 'sidebar.epc.earnings' },
  { id: 'refer',       icon: 'gift',             labelKey: 'sidebar.epc.refer',
    badge: { text: 'NEW', bg: '#02C076', fg: '#0A0617' } },
  { id: 'settings',    icon: 'settings',         labelKey: 'sidebar.epc.settings' },
];

export const investorNav: NavItem<InvestorTab>[] = [
  // Investor-specific section — matches Pencil Cu5Rv
  { id: 'overview',       icon: 'layout-dashboard', labelKey: 'sidebar.inv.overview' },
  { id: 'portfolio',      icon: 'briefcase',        labelKey: 'sidebar.inv.portfolio' },
  { id: 'roi',            icon: 'percent',          labelKey: 'sidebar.inv.roi' },
  { id: 'projects',       icon: 'clipboard-list',   labelKey: 'sidebar.inv.projects' },
  { id: 'electrolineras', icon: 'zap',              labelKey: 'sidebar.inv.electrolineras' },
  { id: 'documents',      icon: 'file-text',        labelKey: 'sidebar.inv.documents' },
  { id: 'wallet',         icon: 'credit-card',      labelKey: 'sidebar.inv.wallet' },
  { id: 'withdrawals',    icon: 'download',         labelKey: 'sidebar.inv.withdrawals' },
  // Acts-as-customer section
  { id: 'my-solar',       icon: 'sun',              labelKey: 'sidebar.customer.mySolar' },
  { id: 'energy',         icon: 'chart-line',       labelKey: 'sidebar.customer.energy' },
  { id: 'bills',          icon: 'file-text',        labelKey: 'sidebar.customer.bills' },
  { id: 'refer',          icon: 'gift',             labelKey: 'sidebar.customer.refer',
    badge: { text: 'NEW', bg: '#02C076', fg: '#0A0617' } },
  { id: 'settings',       icon: 'settings',         labelKey: 'sidebar.inv.settings' },
];

export const adminNav: NavItem<AdminTab>[] = [
  { id: 'overview',    icon: 'layout-dashboard', labelKey: 'sidebar.adm.overview' },
  { id: 'users',       icon: 'users',            labelKey: 'sidebar.adm.users' },
  { id: 'customers',   icon: 'home',             labelKey: 'sidebar.adm.customers' },
  { id: 'epcs',        icon: 'hardhat',          labelKey: 'sidebar.adm.epcs' },
  { id: 'investors',   icon: 'briefcase',        labelKey: 'sidebar.adm.investors' },
  { id: 'projects',    icon: 'clipboard-list',   labelKey: 'sidebar.adm.projects' },
  { id: 'referrals',   icon: 'link',             labelKey: 'sidebar.adm.referrals' },
  { id: 'commissions', icon: 'percent',          labelKey: 'sidebar.adm.commissions' },
  { id: 'audit',       icon: 'shield-check',     labelKey: 'sidebar.adm.audit' },
  { id: 'settings',    icon: 'settings',         labelKey: 'sidebar.adm.settings' },
];

/* --- Per-role bottom support card --- */

export const supportCards: Record<Role, SupportCard> = {
  customer: {
    icon: 'headset',
    iconColor: '#02C076',
    titleKey: 'sidebar.customer.supTitle',
    titleColor: '#EAECEF',
    subKey: 'sidebar.customer.supSub',
    buttonKey: 'sidebar.customer.supBtn',
  },
  epc: {
    icon: 'shield',
    iconColor: '#02C076',
    titleKey: 'sidebar.epc.supTitle',
    titleColor: '#02C076',
    subKey: 'sidebar.epc.supSub',
    buttonKey: 'sidebar.epc.supBtn',
  },
  investor: {
    icon: 'shield-check',
    iconColor: '#02C076',
    titleKey: 'sidebar.inv.supTitle',
    titleColor: '#EAECEF',
    subKey: 'sidebar.inv.supSub',
    buttonKey: 'sidebar.inv.supBtn',
  },
  admin: {
    icon: 'shield',
    iconColor: '#F59E0B',
    titleKey: 'sidebar.adm.supTitle',
    titleColor: '#F59E0B',
    subKey: 'sidebar.adm.supSub',
    buttonKey: 'sidebar.adm.supBtn',
  },
};
