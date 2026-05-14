/**
 * Investor-demo mock dataset.
 *
 * Used as a FALLBACK only — if the real backend returns populated data,
 * that wins. When endpoints return zeros/empty (current state), these
 * numbers fill the dashboards with credible, mid-stage-company scale.
 *
 * Numbers are intentionally tuned to feel real for a ~12-month-old
 * solar fintech with early traction in LATAM (pre-Series A).
 */

import type { Stats } from '@/components/dashboard/shared';

/* =================== CUSTOMER · production telemetry =================== */

export const demoCustomerProduction = {
  producing_now_kw: 4.2,
  today_kwh: 28.5,
  month_kwh: 754,
  month_goal_kwh: 850,
  used_kwh: 18.2,
  to_grid_kwh: 7.4,
  to_battery_kwh: 2.9,
  battery_pct: 78,
  battery_capacity_kwh: 13.5,
  savings_month_usd: 184,
  savings_change_pct: 23.4,
  co2_kg_month: 412,
  next_bill_amount: 54,
  next_bill_date: '2026-06-10',
  system_status: 'healthy' as const,
};

/* =================== REFERRALS · stats =================== */

const today = new Date('2026-05-14').getTime();
const daysAgo = (d: number) => new Date(today - d * 86_400_000).toISOString();

export const demoStats: Stats = {
  code: 'maria-1842',
  clicks: 487,
  signups: 41,
  conversion: 8.4,
  commission_total: 3_420,
  commission_pending: 1_860,
  commission_paid: 1_560,
  tier: 'Gold',
  recent: [
    { email: 'lucia.rivera@example.com',  amount: 1_200, commission: 144, status: 'paid',    created_at: daysAgo(2) },
    { email: 'd.suarez@example.com',      amount: 2_400, commission: 288, status: 'pending', created_at: daysAgo(3) },
    { email: 'a.fernandez@gmail.com',     amount: 1_800, commission: 216, status: 'paid',    created_at: daysAgo(5) },
    { email: 'pedro.castro@example.com',  amount: 3_200, commission: 384, status: 'pending', created_at: daysAgo(7) },
    { email: 'marta.l@example.com',       amount: 1_400, commission: 168, status: 'paid',    created_at: daysAgo(9) },
    { email: 'fer@example.com',           amount: 2_100, commission: 252, status: 'paid',    created_at: daysAgo(11) },
    { email: 's.rodriguez@hotmail.com',   amount: 1_650, commission: 198, status: 'pending', created_at: daysAgo(14) },
    { email: 'j.hernandez@example.com',   amount: 2_800, commission: 336, status: 'paid',    created_at: daysAgo(17) },
  ],
};

/* =================== AFFILIATE · top + leaderboard =================== */

export interface DemoTopAffiliate { rank: number; name: string; refs: number }
export const demoTopAffiliates: DemoTopAffiliate[] = [
  { rank: 1, name: 'María González', refs: 47 },
  { rank: 2, name: 'Carlos Méndez',  refs: 38 },
  { rank: 3, name: 'Sofia Ruiz',     refs: 29 },
  { rank: 4, name: 'Andrés Cruz',    refs: 22 },
  { rank: 5, name: 'Diego Suárez',   refs: 18 },
];

export const demoMyAffiliateRank = 12;

/* =================== EPC · dashboard =================== */

export const demoEpcSummary = {
  active_jobs: 8,
  completed_jobs: 142,
  rating: 4.81,
  rating_count: 52,
  earnings_month: 18_450,
  earnings_change_pct: 24.4,
};

export interface DemoEpcJob {
  time: string; period: string; tag: string; customer: string;
  system: string; addr: string; payout: string; active: boolean; isToday: boolean;
}
export const demoEpcJobs: DemoEpcJob[] = [
  { time: '10:30', period: 'AM', tag: 'NEXT',     customer: 'Veronica Hernández', system: '9.6 kW Pro',          addr: '1240 Maple Ave, Phoenix AZ', payout: '$2,400', active: true,  isToday: true },
  { time: '2:00',  period: 'PM', tag: 'UPCOMING', customer: 'Carlos Méndez',      system: '13.5 kW + Battery',   addr: '88 Brickell Dr, Miami FL',  payout: '$3,600', active: false, isToday: true },
  { time: '4:30',  period: 'PM', tag: '',         customer: 'Lucia Rivera',       system: 'Service inspection',  addr: '15 Oak Rd, Phoenix AZ',     payout: '$300',   active: false, isToday: true },
  { time: 'Tue',   period: '',   tag: 'PRE',      customer: 'Sofia Ruiz',         system: '6.4 kW pre-install',  addr: '405 Olive Ave, Austin TX',  payout: '$1,800', active: false, isToday: false },
  { time: 'Wed',   period: '',   tag: '',         customer: 'Andrés Cruz',        system: 'Service call',        addr: '21 Pine St, Denver CO',     payout: '$600',   active: false, isToday: false },
];

/* =================== EPC · earnings =================== */

export interface DemoEpcTransaction {
  icon: 'dollar-sign' | 'hardhat' | 'wrench';
  bg: string; iconColor: string; name: string; date: string; amount: string; color: string;
}

export const demoEpcEarnings = {
  ytd: 185_400,
  pending: 12_300,
  paid: 173_100,
  monthly: [42, 56, 48, 78, 85, 100],
  breakdown: [
    { l: 'Residential installs', v: '$98,400', d: '#F59E0B' },
    { l: 'Commercial',           v: '$54,200', d: '#02C076' },
    { l: 'Service & repairs',    v: '$22,400', d: '#A78BFA' },
    { l: 'Referral bonuses',     v: '$10,400', d: '#FBBF24' },
  ],
  transactions: [
    { icon: 'dollar-sign' as const, bg: '#02C07618', iconColor: '#02C076', name: 'Payout · Phoenix install',  date: '2026-05-12', amount: '+$2,400', color: '#02C076' },
    { icon: 'hardhat'     as const, bg: '#F59E0B18', iconColor: '#F59E0B', name: 'Job credit · Miami project', date: '2026-05-11', amount: '+$3,600', color: '#02C076' },
    { icon: 'wrench'      as const, bg: '#A78BFA18', iconColor: '#A78BFA', name: 'Service call · Denver',      date: '2026-05-09', amount: '+$600',   color: '#02C076' },
    { icon: 'dollar-sign' as const, bg: '#02C07618', iconColor: '#02C076', name: 'Payout · Austin install',    date: '2026-05-06', amount: '+$1,800', color: '#02C076' },
    { icon: 'hardhat'     as const, bg: '#F59E0B18', iconColor: '#F59E0B', name: 'Job credit · Phoenix repair', date: '2026-05-03', amount: '+$420',   color: '#02C076' },
  ] as DemoEpcTransaction[],
};

/* =================== EPC · schedule =================== */

export interface DemoEpcEvent {
  day: number; top: number; h: number; color: string; title: string;
  name: string; sub: string; addr?: string; payout?: string; hl?: boolean;
}
export const demoEpcSchedule = {
  week_start: '2026-05-12',
  events: [
    { day: 0, top: 60,  h: 110, color: '#F59E0B', title: 'INSTALL',   name: 'Veronica H. · 9.6 kW', sub: 'Solar Pro install', addr: 'Phoenix AZ',  payout: '$2,400', hl: true  },
    { day: 0, top: 240, h: 90,  color: '#A78BFA', title: 'INSPECT',   name: 'Lucia Rivera',         sub: 'Annual check-up',   addr: 'Phoenix AZ',  payout: '$300',   hl: false },
    { day: 1, top: 80,  h: 130, color: '#F59E0B', title: 'INSTALL',   name: 'Carlos M. · 13.5 kW',  sub: 'Solar + battery',   addr: 'Miami FL',    payout: '$3,600', hl: false },
    { day: 2, top: 60,  h: 80,  color: '#A78BFA', title: 'PRE-VISIT', name: 'Sofia Ruiz',           sub: 'Site assessment',   addr: 'Austin TX',   payout: '$300',   hl: false },
    { day: 3, top: 120, h: 70,  color: '#6C5CE7', title: 'SERVICE',   name: 'Andrés Cruz',          sub: 'Service call',      addr: 'Denver CO',   payout: '$600',   hl: false },
    { day: 4, top: 100, h: 110, color: '#F59E0B', title: 'INSTALL',   name: 'Pedro Castro · 8.4kW', sub: 'Residential roof',  addr: 'Bogotá CO',   payout: '$2,100', hl: false },
    { day: 5, top: 80,  h: 60,  color: '#A78BFA', title: 'TRAINING',  name: 'EPC crew',             sub: 'NABCEP refresh',    addr: 'HQ Phoenix',  payout: '',       hl: false },
  ] as DemoEpcEvent[],
  stats: { scheduled: 12, completed: 7, next_time: '10:30 AM', potential_usd: 14_800 },
};

/* =================== ADMIN · users + platform metrics =================== */

export interface DemoAdminUser {
  id: number; cognito_id: string; email: string; full_name: string | null;
  phone: string | null; role: 'client' | 'installer' | 'investor' | 'admin'; created_at: string;
}

export const demoAdminUsers: DemoAdminUser[] = [
  { id:  1, cognito_id: 'd1', email: 'maria.gonzalez@ancestro.ai',  full_name: 'María González', phone: '+52 55 1234 5678', role: 'client',    created_at: daysAgo(2) },
  { id:  2, cognito_id: 'd2', email: 'c.mendez@solarpro.com',       full_name: 'Carlos Méndez',  phone: '+57 311 222 3344', role: 'installer', created_at: daysAgo(4) },
  { id:  3, cognito_id: 'd3', email: 'sofia.ruiz@example.com',      full_name: 'Sofia Ruiz',     phone: '+54 11 5544 6677', role: 'client',    created_at: daysAgo(6) },
  { id:  4, cognito_id: 'd4', email: 'daniel.k@fondoazul.io',       full_name: 'Daniel Kornberg', phone: '+1 305 555 9988', role: 'investor',  created_at: daysAgo(7) },
  { id:  5, cognito_id: 'd5', email: 'lucia.rivera@example.com',    full_name: 'Lucia Rivera',   phone: '+52 33 8877 6655', role: 'client',    created_at: daysAgo(9) },
  { id:  6, cognito_id: 'd6', email: 'a.fernandez@gmail.com',       full_name: 'Andrés Fernández', phone: '+57 300 111 2233', role: 'client',  created_at: daysAgo(11) },
  { id:  7, cognito_id: 'd7', email: 'epc-orange@orangeenergy.co',  full_name: 'Orange Energy LLC', phone: '+57 311 444 5566', role: 'installer', created_at: daysAgo(14) },
  { id:  8, cognito_id: 'd8', email: 'pedro.castro@example.com',    full_name: 'Pedro Castro',   phone: '+56 9 7766 5544', role: 'client',    created_at: daysAgo(15) },
  { id:  9, cognito_id: 'd9', email: 'r.silva@latamcapital.com',    full_name: 'Renata Silva',   phone: '+55 11 9988 7766', role: 'investor',  created_at: daysAgo(17) },
  { id: 10, cognito_id: 'da', email: 'andres.cruz@solarinstall.co', full_name: 'Andrés Cruz',    phone: '+1 720 555 0033', role: 'installer', created_at: daysAgo(18) },
  { id: 11, cognito_id: 'db', email: 'm.lobo@example.com',          full_name: 'Marta Lobo',     phone: '+34 600 11 22 33', role: 'client',    created_at: daysAgo(20) },
  { id: 12, cognito_id: 'dc', email: 'd.suarez@example.com',        full_name: 'Diego Suárez',   phone: '+54 11 1133 4455', role: 'client',    created_at: daysAgo(22) },
  { id: 13, cognito_id: 'dd', email: 'f.gomez@example.com',         full_name: 'Fernanda Gómez', phone: '+52 81 2244 6688', role: 'client',    created_at: daysAgo(24) },
  { id: 14, cognito_id: 'de', email: 'epc-greenwatt@greenwatt.mx',  full_name: 'GreenWatt MX',   phone: '+52 55 3344 5566', role: 'installer', created_at: daysAgo(27) },
  { id: 15, cognito_id: 'df', email: 's.rodriguez@hotmail.com',     full_name: 'Sebastián Rodríguez', phone: '+1 305 222 7788', role: 'client', created_at: daysAgo(29) },
  { id: 16, cognito_id: 'e0', email: 'invest@cleanlatam.fund',      full_name: 'Clean LATAM Fund', phone: '+1 415 333 8899', role: 'investor', created_at: daysAgo(34) },
  { id: 17, cognito_id: 'e1', email: 'j.hernandez@example.com',     full_name: 'José Hernández', phone: '+57 312 666 7788', role: 'client',    created_at: daysAgo(38) },
  { id: 18, cognito_id: 'e2', email: 'epc-novasolar@novasolar.cl',  full_name: 'NovaSolar SpA',  phone: '+56 2 2987 1234', role: 'installer', created_at: daysAgo(42) },
  { id: 19, cognito_id: 'e3', email: 'i.romero@example.com',        full_name: 'Isabel Romero',  phone: '+34 691 22 33 44', role: 'client',    created_at: daysAgo(45) },
  { id: 20, cognito_id: 'e4', email: 'admin@ancestro.ai',           full_name: 'Ancestro Ops',   phone: '+1 305 000 0001', role: 'admin',     created_at: daysAgo(180) },
];

/** Inflated numbers shown on Admin Overview KPI tiles. */
export const demoPlatformMetrics = {
  totalUsers: 2_847,
  customers:  1_640,
  epcs:         412,
  investors:     38,
  admins:        12,
  signupsLast7d:  24,
  signupsLast30d: 96,
};

export const demoAdminProjects = {
  activeProjects: 47,
  inProgress: 23,
  awaitingReview: 18,
  completed: 6,
  monthly: [14, 22, 18, 31, 38, 47],
};

export const demoAdminCommissions = {
  paidYtd: 187_420,
  thisMonth: 22_840,
  pending: 14_220,
  growthPct: 18.2,
};

export const demoAdminCapital = {
  deployedYtd: 4_200_000,
  energyDeployedMW: 8.4,
  co2OffsetTons: 412,
};

/* =================== Helpers =================== */

/** Returns `real` if it looks populated, otherwise `demo`. */
export function pickDemo<T>(real: T | null | undefined, demo: T, isPopulated?: (v: T) => boolean): T {
  if (real == null) return demo;
  if (isPopulated && !isPopulated(real)) return demo;
  return real;
}

export const isStatsPopulated = (s: Stats | null): boolean =>
  !!s && (s.clicks > 0 || s.signups > 0 || s.commission_total > 0 || (s.recent?.length ?? 0) > 0);

export const isProductionPopulated = (p: { today_kwh: number | null } | null | undefined): boolean =>
  !!p && p.today_kwh != null;

/* =================== INVESTOR · portfolio holdings =================== */

export interface DemoInvestorHolding {
  id: string; name: string; type: 'Residential' | 'Commercial' | 'Electrolinera';
  city: string; size: string; stake: number; irr: number;
  status: 'active' | 'funding' | 'completed';
  monthly: number; startedAt: string; funded: number;
}

export const demoInvestorPortfolio: DemoInvestorHolding[] = [
  { id: 'phx-9-6',  name: 'Phoenix · 9.6 kW residential',    type: 'Residential',   city: 'Phoenix AZ',   size: '9.6 kW',   stake: 5_400,  irr: 12.4, status: 'active',    monthly: 56,  startedAt: daysAgo(120), funded: 1.0  },
  { id: 'cdmx-st4', name: 'CDMX · Station 04 expansion',     type: 'Electrolinera', city: 'CDMX',         size: '3× 120kW', stake: 8_200,  irr: 14.6, status: 'active',    monthly: 100, startedAt: daysAgo(90),  funded: 1.0  },
  { id: 'bcs-roof', name: 'BCS · Commercial roof PPA',       type: 'Commercial',    city: 'Bogotá',       size: '120 kW',   stake: 12_500, irr: 13.6, status: 'active',    monthly: 142, startedAt: daysAgo(180), funded: 1.0  },
  { id: 'med-13',   name: 'Medellín · 13 kW + battery',      type: 'Residential',   city: 'Medellín CO',  size: '13 kW',    stake: 6_800,  irr: 13.2, status: 'funding',   monthly: 0,   startedAt: daysAgo(15),  funded: 0.78 },
  { id: 'sao-mall', name: 'São Paulo · shopping mall PPA',   type: 'Commercial',    city: 'São Paulo BR', size: '420 kW',   stake: 15_000, irr: 14.2, status: 'funding',   monthly: 0,   startedAt: daysAgo(8),   funded: 0.41 },
  { id: 'lim-22',   name: 'Lima · 22 kW commercial',         type: 'Commercial',    city: 'Lima PE',      size: '22 kW',    stake: 4_200,  irr: 12.8, status: 'completed', monthly: 0,   startedAt: daysAgo(420), funded: 1.0  },
  { id: 'mty-14',   name: 'Monterrey · 14 kW comercial',      type: 'Commercial',    city: 'Monterrey MX', size: '14 kW',    stake: 5_800,  irr: 13.8, status: 'active',    monthly: 68,  startedAt: daysAgo(140), funded: 1.0  },
  { id: 'mia-13',   name: 'Miami · 13.5 kW + battery',        type: 'Residential',   city: 'Miami FL',     size: '13.5 kW',  stake: 7_200,  irr: 12.6, status: 'active',    monthly: 76,  startedAt: daysAgo(78),  funded: 1.0  },
  { id: 'qro-st-7', name: 'Querétaro · Station 07 DC fast',   type: 'Electrolinera', city: 'Querétaro MX', size: '4× 150kW', stake: 11_000, irr: 14.8, status: 'funding',   monthly: 0,   startedAt: daysAgo(4),   funded: 0.22 },
  { id: 'bog-roof2',name: 'Bogotá · Industrial rooftop PPA',  type: 'Commercial',    city: 'Bogotá CO',    size: '380 kW',   stake: 9_400,  irr: 13.6, status: 'funding',   monthly: 0,   startedAt: daysAgo(22),  funded: 0.65 },
  { id: 'pty-mall', name: 'Panamá · mall solar + storage',    type: 'Commercial',    city: 'Panamá PA',    size: '610 kW',   stake: 6_500,  irr: 14.4, status: 'funding',   monthly: 0,   startedAt: daysAgo(1),   funded: 0.08 },
  { id: 'cdmx-st1', name: 'CDMX · Station 01 (DC fast)',      type: 'Electrolinera', city: 'CDMX MX',      size: '6× 150kW', stake: 10_400, irr: 15.0, status: 'completed', monthly: 0,   startedAt: daysAgo(540), funded: 1.0  },
  { id: 'gdl-roof', name: 'Guadalajara · 80 kW rooftop',      type: 'Commercial',    city: 'GDL MX',       size: '80 kW',    stake: 4_800,  irr: 13.4, status: 'active',    monthly: 54,  startedAt: daysAgo(60),  funded: 1.0  },
];

/* =================== INVESTOR · marketplace opportunities =================== */

export interface DemoOpportunity {
  id: string; name: string; type: 'Residential' | 'Commercial' | 'Electrolinera';
  city: string; size: string; totalRaise: number; minStake: number;
  irr: number; horizonYears: number; funded: number; deadline: string;
}

export const demoInvestorOpportunities: DemoOpportunity[] = [
  { id: 'med-13',     name: 'Medellín · 13 kW + battery',       type: 'Residential',   city: 'Medellín CO',  size: '13 kW',    totalRaise:  28_000, minStake:   500, irr: 13.2, horizonYears: 7, funded: 0.78, deadline: '2026-05-22' },
  { id: 'sao-mall',   name: 'São Paulo · shopping mall PPA',    type: 'Commercial',    city: 'São Paulo BR', size: '420 kW',   totalRaise: 165_000, minStake: 2_500, irr: 14.2, horizonYears: 9, funded: 0.41, deadline: '2026-06-04' },
  { id: 'qro-st-7',   name: 'Querétaro · Station 07 (DC fast)', type: 'Electrolinera', city: 'Querétaro MX', size: '4× 150kW', totalRaise: 240_000, minStake: 5_000, irr: 14.8, horizonYears: 8, funded: 0.22, deadline: '2026-06-12' },
  { id: 'bog-roof2',  name: 'Bogotá · Industrial rooftop PPA',  type: 'Commercial',    city: 'Bogotá CO',    size: '380 kW',   totalRaise: 140_000, minStake: 2_000, irr: 13.6, horizonYears: 8, funded: 0.65, deadline: '2026-05-30' },
  { id: 'scl-res4',   name: 'Santiago · 4-unit residential',    type: 'Residential',   city: 'Santiago CL',  size: '4× 8 kW',  totalRaise:  42_000, minStake:   500, irr: 12.6, horizonYears: 6, funded: 0.12, deadline: '2026-06-18' },
  { id: 'pty-mall',   name: 'Panamá · mall solar + storage',    type: 'Commercial',    city: 'Panamá PA',    size: '610 kW',   totalRaise: 230_000, minStake: 5_000, irr: 14.4, horizonYears: 9, funded: 0.08, deadline: '2026-06-26' },
  { id: 'mty-roof',   name: 'Monterrey · 220 kW industrial',    type: 'Commercial',    city: 'Monterrey MX', size: '220 kW',   totalRaise:  98_000, minStake: 1_500, irr: 13.8, horizonYears: 8, funded: 0.34, deadline: '2026-06-08' },
  { id: 'mia-cluster',name: 'Miami · 8-home solar cluster',     type: 'Residential',   city: 'Miami FL',     size: '8× 11 kW', totalRaise:  84_000, minStake:   500, irr: 12.6, horizonYears: 7, funded: 0.52, deadline: '2026-05-28' },
  { id: 'cdmx-st-9', name: 'CDMX · Station 09 (megawatt)',      type: 'Electrolinera', city: 'CDMX MX',      size: '8× 200kW', totalRaise: 420_000, minStake: 10_000, irr: 15.0, horizonYears: 10, funded: 0.06, deadline: '2026-07-08' },
  { id: 'gdl-warehouse', name: 'GDL · 480 kW warehouse PPA',    type: 'Commercial',    city: 'GDL MX',       size: '480 kW',   totalRaise: 195_000, minStake: 3_000, irr: 14.1, horizonYears: 9, funded: 0.15, deadline: '2026-06-22' },
  { id: 'lim-cluster',name: 'Lima · 6 commercial roofs',         type: 'Commercial',    city: 'Lima PE',      size: '6× 28 kW', totalRaise: 122_000, minStake: 2_000, irr: 13.4, horizonYears: 8, funded: 0.28, deadline: '2026-06-14' },
  { id: 'bs-as-res',  name: 'Buenos Aires · 16 residential',    type: 'Residential',   city: 'BA AR',        size: '16× 6 kW', totalRaise:  72_000, minStake:   500, irr: 12.8, horizonYears: 7, funded: 0.44, deadline: '2026-06-02' },
  { id: 'mde-st-3',   name: 'Medellín · Charging Station 03',   type: 'Electrolinera', city: 'Medellín CO',  size: '3× 120kW', totalRaise: 175_000, minStake: 2_500, irr: 14.6, horizonYears: 8, funded: 0.71, deadline: '2026-05-25' },
];

/* =================== INVESTOR · wallet =================== */

export interface DemoWalletTx {
  id: string; date: string;
  type: 'distribution' | 'deposit' | 'withdrawal' | 'investment' | 'fee';
  label: string; amount: number; status: 'completed' | 'pending';
}

export const demoInvestorWallet = {
  balanceUsd: 14_280,
  availableUsd: 11_840,
  reservedUsd: 2_440,
  lifetimeDeposited: 60_000,
  lifetimeWithdrawn: 18_400,
  lifetimeDistributions: 7_842,
  transactions: [
    { id: 'tx-220', date: daysAgo(2),  type: 'distribution' as const, label: 'CDMX · Station 04 · April',          amount:    100, status: 'completed' as const },
    { id: 'tx-219', date: daysAgo(4),  type: 'distribution' as const, label: 'BCS · Commercial PPA · April',       amount:    142, status: 'completed' as const },
    { id: 'tx-218', date: daysAgo(6),  type: 'investment'   as const, label: 'Stake → Medellín · 13 kW',           amount: -6_800, status: 'completed' as const },
    { id: 'tx-217', date: daysAgo(9),  type: 'deposit'      as const, label: 'ACH from Chase ····6712',            amount: 10_000, status: 'completed' as const },
    { id: 'tx-216', date: daysAgo(14), type: 'distribution' as const, label: 'Phoenix · 9.6 kW · April',           amount:     56, status: 'completed' as const },
    { id: 'tx-215', date: daysAgo(18), type: 'withdrawal'   as const, label: 'Withdrawal → bank ····6712',         amount: -2_500, status: 'completed' as const },
    { id: 'tx-214', date: daysAgo(22), type: 'fee'          as const, label: 'Platform fee · April',               amount:    -28, status: 'completed' as const },
    { id: 'tx-213', date: daysAgo(28), type: 'distribution' as const, label: 'Lima · 22 kW · final payout',        amount:  1_240, status: 'completed' as const },
    { id: 'tx-212', date: daysAgo(31), type: 'distribution' as const, label: 'CDMX · Station 04 · March',          amount:    100, status: 'completed' as const },
    { id: 'tx-211', date: daysAgo(35), type: 'distribution' as const, label: 'BCS · Commercial PPA · March',       amount:    142, status: 'completed' as const },
    { id: 'tx-210', date: daysAgo(38), type: 'distribution' as const, label: 'Monterrey · 14 kW · March',          amount:     68, status: 'completed' as const },
    { id: 'tx-209', date: daysAgo(42), type: 'distribution' as const, label: 'Miami · 13.5 kW · March',            amount:     76, status: 'completed' as const },
    { id: 'tx-208', date: daysAgo(45), type: 'investment'   as const, label: 'Stake → São Paulo · mall PPA',       amount: -15_000, status: 'completed' as const },
    { id: 'tx-207', date: daysAgo(49), type: 'deposit'      as const, label: 'ACH from Chase ····6712',            amount: 20_000, status: 'completed' as const },
    { id: 'tx-206', date: daysAgo(53), type: 'distribution' as const, label: 'GDL · 80 kW · March',                amount:     54, status: 'completed' as const },
    { id: 'tx-205', date: daysAgo(56), type: 'fee'          as const, label: 'Platform fee · March',               amount:    -28, status: 'completed' as const },
    { id: 'tx-204', date: daysAgo(60), type: 'distribution' as const, label: 'Phoenix · 9.6 kW · March',           amount:     56, status: 'completed' as const },
    { id: 'tx-203', date: daysAgo(62), type: 'distribution' as const, label: 'CDMX · Station 04 · February',       amount:    100, status: 'completed' as const },
    { id: 'tx-202', date: daysAgo(64), type: 'distribution' as const, label: 'BCS · Commercial PPA · February',    amount:    142, status: 'completed' as const },
    { id: 'tx-201', date: daysAgo(70), type: 'distribution' as const, label: 'Monterrey · 14 kW · February',       amount:     68, status: 'completed' as const },
    { id: 'tx-200', date: daysAgo(74), type: 'distribution' as const, label: 'CDMX · Station 01 · final payout',   amount:  2_780, status: 'completed' as const },
    { id: 'tx-199', date: daysAgo(78), type: 'withdrawal'   as const, label: 'Withdrawal → bank ····6712',         amount: -3_500, status: 'completed' as const },
    { id: 'tx-198', date: daysAgo(85), type: 'investment'   as const, label: 'Stake → Querétaro · Station 07',     amount: -11_000, status: 'completed' as const },
  ] as DemoWalletTx[],
};

/* =================== ADMIN · projects (rich list) =================== */

export interface DemoAdminProject {
  id: string; name: string; epc: string; customer: string; city: string;
  capacityKw: number;
  status: 'review' | 'listing' | 'funding' | 'installing' | 'live' | 'paid';
  totalCost: number; fundedPct: number; createdAt: string;
}

export const demoAdminProjectsList: DemoAdminProject[] = [
  { id: 'p-2031', name: 'Phoenix · 9.6 kW residential',      epc: 'Orange Energy', customer: 'Veronica H.',    city: 'Phoenix AZ',   capacityKw:   9.6, status: 'live',       totalCost:  24_500, fundedPct: 1.00, createdAt: daysAgo(120) },
  { id: 'p-2030', name: 'CDMX · Station 04 expansion',       epc: 'GreenWatt MX',  customer: 'Charge LATAM',   city: 'CDMX',         capacityKw: 360,   status: 'installing', totalCost: 240_000, fundedPct: 1.00, createdAt: daysAgo(95)  },
  { id: 'p-2029', name: 'Medellín · 13 kW + battery',        epc: 'Orange Energy', customer: 'Andrés Fdez.',   city: 'Medellín CO',  capacityKw:  13,   status: 'funding',    totalCost:  32_400, fundedPct: 0.78, createdAt: daysAgo(15)  },
  { id: 'p-2028', name: 'São Paulo · mall PPA',              epc: 'SolarPro BR',   customer: 'BRX Holding',    city: 'São Paulo BR', capacityKw: 420,   status: 'listing',    totalCost: 165_000, fundedPct: 0.41, createdAt: daysAgo(8)   },
  { id: 'p-2027', name: 'Querétaro · DC fast station 07',    epc: 'NovaSolar',     customer: 'Charge LATAM',   city: 'Querétaro MX', capacityKw: 600,   status: 'review',     totalCost: 240_000, fundedPct: 0.22, createdAt: daysAgo(3)   },
  { id: 'p-2026', name: 'Bogotá · industrial rooftop',       epc: 'Orange Energy', customer: 'Logística SA',   city: 'Bogotá CO',    capacityKw: 380,   status: 'funding',    totalCost: 140_000, fundedPct: 0.65, createdAt: daysAgo(22)  },
  { id: 'p-2025', name: 'Santiago · 4-unit residential mix', epc: 'NovaSolar',     customer: 'Inmob. Andina',  city: 'Santiago CL',  capacityKw:  32,   status: 'listing',    totalCost:  42_000, fundedPct: 0.12, createdAt: daysAgo(2)   },
  { id: 'p-2024', name: 'Panamá · mall solar + storage',     epc: 'Caribe Solar',  customer: 'Panamall Group', city: 'Panamá PA',    capacityKw: 610,   status: 'review',     totalCost: 230_000, fundedPct: 0.08, createdAt: daysAgo(1)   },
  { id: 'p-2023', name: 'Miami · 13.5 kW + battery',         epc: 'SunCoast EPC',  customer: 'Carlos Méndez',  city: 'Miami FL',     capacityKw:  13.5, status: 'installing', totalCost:  36_800, fundedPct: 1.00, createdAt: daysAgo(45)  },
  { id: 'p-2022', name: 'Lima · 22 kW commercial',           epc: 'GreenWatt MX',  customer: 'Comercial RP',   city: 'Lima PE',      capacityKw:  22,   status: 'paid',       totalCost:  54_200, fundedPct: 1.00, createdAt: daysAgo(420) },
  { id: 'p-2032', name: 'Monterrey · 220 kW industrial',     epc: 'GreenWatt MX',  customer: 'Industrias MTY', city: 'Monterrey',   capacityKw: 220,   status: 'funding',    totalCost:  98_000, fundedPct: 0.34, createdAt: daysAgo(5)   },
  { id: 'p-2033', name: 'Miami · 8-home cluster',            epc: 'SunCoast EPC',  customer: 'Coral Holdings', city: 'Miami FL',     capacityKw:  88,   status: 'funding',    totalCost:  84_000, fundedPct: 0.52, createdAt: daysAgo(11)  },
  { id: 'p-2034', name: 'CDMX · Station 09 megawatt',        epc: 'NovaSolar',     customer: 'Charge LATAM',   city: 'CDMX MX',      capacityKw: 1600,  status: 'review',     totalCost: 420_000, fundedPct: 0.06, createdAt: daysAgo(2)   },
  { id: 'p-2035', name: 'GDL · 480 kW warehouse PPA',        epc: 'NovaSolar',     customer: 'Bodegas Mex',    city: 'GDL MX',       capacityKw: 480,   status: 'listing',    totalCost: 195_000, fundedPct: 0.15, createdAt: daysAgo(4)   },
  { id: 'p-2036', name: 'Lima · 6 commercial roofs',         epc: 'GreenWatt MX',  customer: 'Comercial RP',   city: 'Lima PE',      capacityKw: 168,   status: 'funding',    totalCost: 122_000, fundedPct: 0.28, createdAt: daysAgo(7)   },
  { id: 'p-2037', name: 'BA · 16 residential cluster',       epc: 'Sol del Sur',   customer: 'Inmob. del Sur', city: 'BA AR',        capacityKw:  96,   status: 'funding',    totalCost:  72_000, fundedPct: 0.44, createdAt: daysAgo(12)  },
  { id: 'p-2038', name: 'Medellín · Station 03',             epc: 'Orange Energy', customer: 'Charge LATAM',   city: 'Medellín CO',  capacityKw: 360,   status: 'funding',    totalCost: 175_000, fundedPct: 0.71, createdAt: daysAgo(19)  },
  { id: 'p-2039', name: 'Madrid · 11.2 kW + storage',        epc: 'IberSolar',     customer: 'Marta Lobo',     city: 'Madrid ES',    capacityKw:  11.2, status: 'installing', totalCost:  31_500, fundedPct: 1.00, createdAt: daysAgo(38)  },
  { id: 'p-2040', name: 'Sevilla · 6.8 kW residential',      epc: 'IberSolar',     customer: 'I. Romero',      city: 'Sevilla ES',   capacityKw:   6.8, status: 'live',       totalCost:  18_400, fundedPct: 1.00, createdAt: daysAgo(180) },
  { id: 'p-2021', name: 'Café Andino · 24 kW comercial',     epc: 'Orange Energy', customer: 'Café Andino SAS', city: 'Cali CO',     capacityKw:  24,   status: 'listing',    totalCost:  56_400, fundedPct: 0.18, createdAt: daysAgo(6)   },
  { id: 'p-2020', name: 'Hotel Mar Azul · 38 kW + storage',  epc: 'Sol del Sur',   customer: 'Hotel Mar Azul', city: 'Mar del P.',   capacityKw:  38,   status: 'live',       totalCost:  96_200, fundedPct: 1.00, createdAt: daysAgo(210) },
  { id: 'p-2019', name: 'Santiago · 8 kW residential',       epc: 'NovaSolar',     customer: 'Tomás Rojas',    city: 'Santiago CL',  capacityKw:   8,   status: 'review',     totalCost:  19_800, fundedPct: 0.00, createdAt: daysAgo(1)   },
  { id: 'p-2018', name: 'Brasília · 18 kW comercial',        epc: 'SolarPro BR',   customer: 'Tech Hub BSB',   city: 'Brasília',     capacityKw:  18,   status: 'listing',    totalCost:  48_600, fundedPct: 0.22, createdAt: daysAgo(9)   },
];

/* =================== ADMIN · commissions (latest payouts) =================== */

export interface DemoAdminCommissionRow {
  id: string; date: string; referrer: string; referred: string;
  amount: number; pct: number; commission: number; status: 'paid' | 'pending';
}

export const demoAdminCommissionsList: DemoAdminCommissionRow[] = [
  { id: 'c-501', date: daysAgo(1),  referrer: 'María González',    referred: 'lucia.rivera@example.com',   amount:  1_200, pct: 12, commission:   144, status: 'paid'    },
  { id: 'c-500', date: daysAgo(2),  referrer: 'Carlos Méndez',     referred: 'd.suarez@example.com',        amount:  2_400, pct: 12, commission:   288, status: 'pending' },
  { id: 'c-499', date: daysAgo(3),  referrer: 'María González',    referred: 'a.fernandez@gmail.com',       amount:  1_800, pct: 12, commission:   216, status: 'paid'    },
  { id: 'c-498', date: daysAgo(4),  referrer: 'Sofia Ruiz',        referred: 'pedro.castro@example.com',    amount:  3_200, pct: 12, commission:   384, status: 'pending' },
  { id: 'c-497', date: daysAgo(5),  referrer: 'Andrés Cruz',       referred: 'marta.l@example.com',         amount:  1_400, pct: 12, commission:   168, status: 'paid'    },
  { id: 'c-496', date: daysAgo(7),  referrer: 'Diego Suárez',      referred: 'fer@example.com',             amount:  2_100, pct: 12, commission:   252, status: 'paid'    },
  { id: 'c-495', date: daysAgo(9),  referrer: 'María González',    referred: 's.rodriguez@hotmail.com',     amount:  1_650, pct: 12, commission:   198, status: 'pending' },
  { id: 'c-494', date: daysAgo(11), referrer: 'Orange Energy LLC', referred: 'invest@cleanlatam.fund',      amount: 25_000, pct:  8, commission: 2_000, status: 'paid'    },
  { id: 'c-493', date: daysAgo(14), referrer: 'Sofia Ruiz',        referred: 'j.hernandez@example.com',     amount:  2_800, pct: 12, commission:   336, status: 'paid'    },
  { id: 'c-492', date: daysAgo(18), referrer: 'NovaSolar SpA',     referred: 'r.silva@latamcapital.com',    amount: 18_000, pct:  8, commission: 1_440, status: 'paid'    },
  { id: 'c-491', date: daysAgo(20), referrer: 'GreenWatt MX',      referred: 'industrias.mty@example.com',  amount: 32_000, pct:  8, commission: 2_560, status: 'pending' },
  { id: 'c-490', date: daysAgo(22), referrer: 'María González',    referred: 'm.lobo@example.com',          amount:  1_550, pct: 12, commission:   186, status: 'paid'    },
  { id: 'c-489', date: daysAgo(25), referrer: 'Diego Suárez',      referred: 'f.gomez@example.com',         amount:  2_240, pct: 12, commission:   269, status: 'paid'    },
  { id: 'c-488', date: daysAgo(28), referrer: 'Orange Energy LLC', referred: 'invest@latamfund.io',         amount: 21_500, pct:  8, commission: 1_720, status: 'paid'    },
  { id: 'c-487', date: daysAgo(31), referrer: 'Carlos Méndez',     referred: 'i.romero@example.com',        amount:  1_820, pct: 12, commission:   218, status: 'pending' },
  { id: 'c-486', date: daysAgo(33), referrer: 'Sofia Ruiz',        referred: 'tomas.r@example.com',         amount:  1_980, pct: 12, commission:   238, status: 'paid'    },
  { id: 'c-485', date: daysAgo(36), referrer: 'GreenWatt MX',      referred: 'bodegas.mex@example.com',     amount: 19_400, pct:  8, commission: 1_552, status: 'paid'    },
  { id: 'c-484', date: daysAgo(40), referrer: 'María González',    referred: 'cafe.andino@example.com',     amount:  3_400, pct: 12, commission:   408, status: 'paid'    },
  { id: 'c-483', date: daysAgo(44), referrer: 'Andrés Cruz',       referred: 'hotel.marazul@example.com',   amount:  4_200, pct: 12, commission:   504, status: 'paid'    },
  { id: 'c-482', date: daysAgo(48), referrer: 'NovaSolar SpA',     referred: 'tech.hub.bsb@example.com',    amount: 16_800, pct:  8, commission: 1_344, status: 'paid'    },
  { id: 'c-481', date: daysAgo(52), referrer: 'Sofia Ruiz',        referred: 'panamall@example.com',        amount:  2_650, pct: 12, commission:   318, status: 'paid'    },
  { id: 'c-480', date: daysAgo(56), referrer: 'María González',    referred: 'logistica.rp@example.com',    amount:  3_120, pct: 12, commission:   374, status: 'paid'    },
  { id: 'c-479', date: daysAgo(60), referrer: 'Carlos Méndez',     referred: 'edumx@example.com',           amount:  2_840, pct: 12, commission:   341, status: 'paid'    },
];

/* =================== ADMIN · audit log =================== */

export interface DemoAuditEntry {
  id: string; ts: string; actor: string; action: string; target: string;
  severity: 'info' | 'warn' | 'critical';
}

export const demoAdminAuditLog: DemoAuditEntry[] = [
  { id: 'a-1024', ts: daysAgo(0.04), actor: 'admin@ancestro.ai', action: 'project.approve',       target: 'p-2025',                          severity: 'info'     },
  { id: 'a-1023', ts: daysAgo(0.1),  actor: 'admin@ancestro.ai', action: 'commission.update',     target: 'role=affiliate · 15% → 12%',      severity: 'warn'     },
  { id: 'a-1022', ts: daysAgo(0.3),  actor: 'system',            action: 'payout.batch.executed', target: '$22,840 · 41 recipients',         severity: 'info'     },
  { id: 'a-1021', ts: daysAgo(0.6),  actor: 'admin@ancestro.ai', action: 'user.role.change',      target: 'pedro.castro@... → installer',    severity: 'warn'     },
  { id: 'a-1020', ts: daysAgo(1),    actor: 'system',            action: 'email.blast.sent',      target: 'project p-2024 · 3,400 contacts', severity: 'info'     },
  { id: 'a-1019', ts: daysAgo(1.4),  actor: 'admin@ancestro.ai', action: 'project.reject',        target: 'p-2019 · missing permits',        severity: 'warn'     },
  { id: 'a-1018', ts: daysAgo(2),    actor: 'system',            action: 'kyc.completed',         target: 'Daniel Kornberg',                 severity: 'info'     },
  { id: 'a-1017', ts: daysAgo(2.5),  actor: 'admin@ancestro.ai', action: 'fee.refund',            target: 'p-2014 · $2,500',                 severity: 'critical' },
  { id: 'a-1016', ts: daysAgo(3),    actor: 'system',            action: 'payment.received',      target: 'p-2024 · $2,500 EPC fee',         severity: 'info'     },
  { id: 'a-1015', ts: daysAgo(3.2),  actor: 'system',            action: 'investor.signup',       target: 'Clean LATAM Fund',                severity: 'info'     },
  { id: 'a-1014', ts: daysAgo(4),    actor: 'admin@ancestro.ai', action: 'project.approve',       target: 'p-2032 · Monterrey 220 kW',       severity: 'info'     },
  { id: 'a-1013', ts: daysAgo(4.5),  actor: 'system',            action: 'login.failure.threshold', target: 'IP 187.34.x.x · 8 attempts',    severity: 'warn'     },
  { id: 'a-1012', ts: daysAgo(5),    actor: 'system',            action: 'payment.received',      target: 'p-2033 · $2,500 EPC fee',         severity: 'info'     },
  { id: 'a-1011', ts: daysAgo(5.5),  actor: 'admin@ancestro.ai', action: 'commission.update',     target: 'role=installer · 8% → 9%',        severity: 'warn'     },
  { id: 'a-1010', ts: daysAgo(6),    actor: 'system',            action: 'email.blast.sent',      target: 'project p-2034 · 3,400 contacts', severity: 'info'     },
  { id: 'a-1009', ts: daysAgo(6.5),  actor: 'admin@ancestro.ai', action: 'kyc.review.approved',   target: 'investor · Renata Silva',         severity: 'info'     },
  { id: 'a-1008', ts: daysAgo(7),    actor: 'system',            action: 'payout.batch.executed', target: '$18,940 · 32 recipients',         severity: 'info'     },
  { id: 'a-1007', ts: daysAgo(8),    actor: 'admin@ancestro.ai', action: 'user.suspend',          target: 'epc-shadowsolar@... · TOS breach', severity: 'critical' },
  { id: 'a-1006', ts: daysAgo(9),    actor: 'system',            action: 'investor.signup',       target: 'LATAM Capital Fund',              severity: 'info'     },
  { id: 'a-1005', ts: daysAgo(10),   actor: 'admin@ancestro.ai', action: 'project.reject',        target: 'p-2017 · failed structural test', severity: 'warn'     },
  { id: 'a-1004', ts: daysAgo(11),   actor: 'system',            action: 'payment.received',      target: 'p-2035 · $2,500 EPC fee',         severity: 'info'     },
  { id: 'a-1003', ts: daysAgo(12),   actor: 'system',            action: 'kyc.completed',         target: 'Clean LATAM Fund',                severity: 'info'     },
  { id: 'a-1002', ts: daysAgo(13),   actor: 'admin@ancestro.ai', action: 'fee.adjust',            target: 'p-2014 · $200 credit',            severity: 'warn'     },
  { id: 'a-1001', ts: daysAgo(15),   actor: 'system',            action: 'email.blast.sent',      target: 'project p-2032 · 3,400 contacts', severity: 'info'     },
];

/* =================== CUSTOMER · energy breakdown =================== */

export const demoCustomerEnergy = {
  hourly: [
    0, 0, 0, 0, 0, 0.2, 0.8, 1.6, 2.8, 3.4, 4.1, 4.6,
    4.8, 4.7, 4.4, 3.9, 3.2, 2.3, 1.1, 0.3, 0, 0, 0, 0,
  ] as number[],
  monthly: [560, 612, 588, 705, 732, 754],
  monthly12: [668, 695, 728, 712, 658, 596, 548, 560, 612, 588, 705, 732, 754],
  ytdKwh: 4_120,
  selfConsumed: 0.62,
  exportedToGrid: 0.28,
  storedInBattery: 0.10,
};

/* =================== CUSTOMER · bills history =================== */

export interface DemoBill {
  id: string; period: string; producedKwh: number; consumedKwh: number;
  grossUsd: number; solarSavingsUsd: number; netUsd: number;
  status: 'paid' | 'open'; dueAt: string;
}

export const demoCustomerBills: DemoBill[] = [
  { id: 'b-2026-05', period: 'Mayo 2026',      producedKwh: 754, consumedKwh: 612, grossUsd: 154, solarSavingsUsd: 184, netUsd:  54, status: 'open', dueAt: '2026-06-10' },
  { id: 'b-2026-04', period: 'Abril 2026',     producedKwh: 732, consumedKwh: 645, grossUsd: 161, solarSavingsUsd: 178, netUsd:  62, status: 'paid', dueAt: '2026-05-10' },
  { id: 'b-2026-03', period: 'Marzo 2026',     producedKwh: 705, consumedKwh: 624, grossUsd: 156, solarSavingsUsd: 170, netUsd:  65, status: 'paid', dueAt: '2026-04-10' },
  { id: 'b-2026-02', period: 'Febrero 2026',   producedKwh: 588, consumedKwh: 598, grossUsd: 149, solarSavingsUsd: 142, netUsd:  80, status: 'paid', dueAt: '2026-03-10' },
  { id: 'b-2026-01', period: 'Enero 2026',     producedKwh: 612, consumedKwh: 668, grossUsd: 167, solarSavingsUsd: 148, netUsd:  88, status: 'paid', dueAt: '2026-02-10' },
  { id: 'b-2025-12', period: 'Diciembre 2025', producedKwh: 560, consumedKwh: 712, grossUsd: 178, solarSavingsUsd: 134, netUsd: 102, status: 'paid', dueAt: '2026-01-10' },
  { id: 'b-2025-11', period: 'Noviembre 2025', producedKwh: 548, consumedKwh: 678, grossUsd: 170, solarSavingsUsd: 130, netUsd: 105, status: 'paid', dueAt: '2025-12-10' },
  { id: 'b-2025-10', period: 'Octubre 2025',   producedKwh: 596, consumedKwh: 654, grossUsd: 164, solarSavingsUsd: 148, netUsd:  82, status: 'paid', dueAt: '2025-11-10' },
  { id: 'b-2025-09', period: 'Septiembre 2025',producedKwh: 658, consumedKwh: 620, grossUsd: 156, solarSavingsUsd: 162, netUsd:  60, status: 'paid', dueAt: '2025-10-10' },
  { id: 'b-2025-08', period: 'Agosto 2025',    producedKwh: 712, consumedKwh: 602, grossUsd: 152, solarSavingsUsd: 178, netUsd:  44, status: 'paid', dueAt: '2025-09-10' },
  { id: 'b-2025-07', period: 'Julio 2025',     producedKwh: 728, consumedKwh: 614, grossUsd: 154, solarSavingsUsd: 182, netUsd:  42, status: 'paid', dueAt: '2025-08-10' },
  { id: 'b-2025-06', period: 'Junio 2025',     producedKwh: 695, consumedKwh: 596, grossUsd: 150, solarSavingsUsd: 174, netUsd:  48, status: 'paid', dueAt: '2025-07-10' },
  { id: 'b-2025-05', period: 'Mayo 2025',      producedKwh: 668, consumedKwh: 580, grossUsd: 146, solarSavingsUsd: 168, netUsd:  52, status: 'paid', dueAt: '2025-06-10' },
];

/* =================== EPC · active jobs (extended list) =================== */

export interface DemoEpcActiveJob {
  id: string; customer: string; system: string; addr: string; city: string;
  kw: number; status: 'scheduled' | 'in-progress' | 'completed' | 'review';
  startAt: string; payout: number; crew: string;
}

export const demoEpcActiveJobsList: DemoEpcActiveJob[] = [
  { id: 'j-1124', customer: 'Veronica Hernández', system: '9.6 kW Pro',         addr: '1240 Maple Ave',     city: 'Phoenix AZ', kw:  9.6, status: 'in-progress', startAt: '2026-05-14', payout: 2_400, crew: 'Crew A' },
  { id: 'j-1125', customer: 'Carlos Méndez',      system: '13.5 kW + Battery',  addr: '88 Brickell Dr',     city: 'Miami FL',   kw: 13.5, status: 'scheduled',   startAt: '2026-05-14', payout: 3_600, crew: 'Crew B' },
  { id: 'j-1126', customer: 'Lucia Rivera',       system: 'Service inspection', addr: '15 Oak Rd',          city: 'Phoenix AZ', kw:  0,   status: 'scheduled',   startAt: '2026-05-14', payout:   300, crew: 'Crew A' },
  { id: 'j-1127', customer: 'Sofia Ruiz',         system: '6.4 kW pre-install', addr: '405 Olive Ave',      city: 'Austin TX',  kw:  6.4, status: 'scheduled',   startAt: '2026-05-19', payout: 1_800, crew: 'Crew C' },
  { id: 'j-1128', customer: 'Andrés Cruz',        system: 'Service call',       addr: '21 Pine St',         city: 'Denver CO',  kw:  0,   status: 'scheduled',   startAt: '2026-05-20', payout:   600, crew: 'Crew B' },
  { id: 'j-1129', customer: 'Pedro Castro',       system: '8.4 kW residential', addr: 'Cra 11 #82-13',      city: 'Bogotá CO',  kw:  8.4, status: 'scheduled',   startAt: '2026-05-22', payout: 2_100, crew: 'Crew C' },
  { id: 'j-1130', customer: 'Marta Lobo',         system: '11.2 kW + storage',  addr: 'Av. Andalucía 41',   city: 'Madrid ES',  kw: 11.2, status: 'review',      startAt: '2026-05-26', payout: 2_800, crew: '—'      },
  { id: 'j-1131', customer: 'Diego Suárez',       system: '6.0 kW residential', addr: 'Av. Callao 1280',    city: 'BA AR',      kw:  6.0, status: 'in-progress', startAt: '2026-05-13', payout: 1_500, crew: 'Crew C' },
  { id: 'j-1123', customer: 'Fernanda Gómez',     system: '14 kW commercial',   addr: 'Av. Constituyentes', city: 'Monterrey',  kw: 14,   status: 'completed',   startAt: '2026-05-08', payout: 3_400, crew: 'Crew A' },
  { id: 'j-1122', customer: 'José Hernández',     system: '9.0 kW + storage',   addr: 'Calle 7 #14-20',     city: 'Medellín',   kw:  9.0, status: 'completed',   startAt: '2026-05-04', payout: 2_300, crew: 'Crew B' },
  { id: 'j-1132', customer: 'Inmob. Andina',      system: '4× 8 kW residential', addr: 'Av. Apoquindo 6410', city: 'Santiago CL', kw: 32,  status: 'scheduled',   startAt: '2026-05-27', payout: 7_200, crew: 'Crew C' },
  { id: 'j-1133', customer: 'Logística RP SA',    system: '22 kW commercial',   addr: 'Av. Javier Prado',   city: 'Lima PE',    kw: 22,   status: 'review',      startAt: '2026-05-30', payout: 4_900, crew: '—'      },
  { id: 'j-1134', customer: 'Charge LATAM',       system: '3× 120 kW DC fast',  addr: 'Eje 8 Sur 134',      city: 'CDMX MX',    kw: 360,  status: 'in-progress', startAt: '2026-05-12', payout: 28_400, crew: 'Crew A' },
  { id: 'j-1135', customer: 'BRX Holding',        system: '420 kW mall PPA',    addr: 'Av. Paulista 1840',  city: 'São Paulo',  kw: 420,  status: 'scheduled',   startAt: '2026-06-03', payout: 32_600, crew: 'Crew B' },
  { id: 'j-1121', customer: 'Isabel Romero',      system: '7.8 kW residential', addr: 'C/ Hortaleza 87',    city: 'Madrid ES',  kw:  7.8, status: 'completed',   startAt: '2026-04-28', payout: 2_050, crew: 'Crew C' },
  { id: 'j-1120', customer: 'Comercial RP',       system: '18 kW commercial',   addr: 'Av. La Marina 2200', city: 'Lima PE',    kw: 18,   status: 'completed',   startAt: '2026-04-22', payout: 4_300, crew: 'Crew A' },
  { id: 'j-1136', customer: 'Panamall Group',     system: '610 kW + storage',   addr: 'Costa del Este',     city: 'Panamá PA',  kw: 610,  status: 'review',      startAt: '2026-06-10', payout: 48_500, crew: '—'      },
  { id: 'j-1137', customer: 'EduMX Foundation',   system: '12 kW school roof',  addr: 'Av. Cuauhtémoc 142', city: 'Querétaro',  kw: 12,   status: 'scheduled',   startAt: '2026-05-29', payout: 3_100, crew: 'Crew C' },
  { id: 'j-1119', customer: 'Hotel Mar Azul',     system: '38 kW + 60 kWh',     addr: 'Av. Costanera 2840', city: 'Mar del P.', kw: 38,   status: 'completed',   startAt: '2026-04-18', payout: 8_200, crew: 'Crew B' },
  { id: 'j-1118', customer: 'Marta L. (refer.)',  system: '6.8 kW residential', addr: 'Av. del Sol 78',     city: 'Sevilla ES', kw:  6.8, status: 'completed',   startAt: '2026-04-14', payout: 1_750, crew: 'Crew A' },
  { id: 'j-1138', customer: 'Café Andino SAS',    system: '24 kW commercial',   addr: 'Cra 50 #23-17',      city: 'Cali CO',    kw: 24,   status: 'scheduled',   startAt: '2026-06-05', payout: 5_400, crew: 'Crew C' },
  { id: 'j-1139', customer: 'D. Kornberg (inv.)', system: 'Site assessment',    addr: '88 Brickell Dr',     city: 'Miami FL',   kw:  0,   status: 'scheduled',   startAt: '2026-05-21', payout:   300, crew: 'Crew B' },
];

/* =================== EPC · materials inventory =================== */

export interface DemoEpcMaterial {
  sku: string; name: string;
  category: 'panels' | 'inverters' | 'batteries' | 'mounting' | 'wiring';
  unit: string; stock: number; allocated: number; reorder: number;
  unitCost: number; supplier: string;
}

export const demoEpcMaterials: DemoEpcMaterial[] = [
  { sku: 'JKN-580',    name: 'Jinko Tiger Neo 580 W',          category: 'panels',    unit: 'unit', stock: 184, allocated:  96, reorder:  60, unitCost:   215,   supplier: 'Jinko Solar' },
  { sku: 'LR-575',     name: 'LONGi Hi-MO 575 W',              category: 'panels',    unit: 'unit', stock:  48, allocated:  30, reorder:  50, unitCost:   209,   supplier: 'LONGi'       },
  { sku: 'ENPH-IQ8H',  name: 'Enphase IQ8H microinverter',     category: 'inverters', unit: 'unit', stock: 220, allocated:  64, reorder:  80, unitCost:   162,   supplier: 'Enphase'     },
  { sku: 'SE-7K',      name: 'SolarEdge SE7600H string',       category: 'inverters', unit: 'unit', stock:  12, allocated:   8, reorder:  15, unitCost: 1_980,   supplier: 'SolarEdge'   },
  { sku: 'TSL-PW3',    name: 'Tesla Powerwall 3 (13.5 kWh)',   category: 'batteries', unit: 'unit', stock:   6, allocated:   4, reorder:   8, unitCost: 9_400,   supplier: 'Tesla'       },
  { sku: 'BYD-HVS',    name: 'BYD Battery-Box HVS (10.2 kWh)', category: 'batteries', unit: 'unit', stock:   9, allocated:   3, reorder:  10, unitCost: 6_200,   supplier: 'BYD'         },
  { sku: 'IRO-RAIL',   name: 'IronRidge XR-100 rail · 168"',   category: 'mounting',  unit: 'pc',   stock: 312, allocated: 120, reorder:  80, unitCost:    34,   supplier: 'IronRidge'   },
  { sku: 'IRO-CLAMP',  name: 'IronRidge mid clamp · 35 mm',    category: 'mounting',  unit: 'pc',   stock: 940, allocated: 240, reorder: 200, unitCost:     2.4, supplier: 'IronRidge'   },
  { sku: 'WIR-10',     name: 'PV wire 10 AWG · black · 500ft', category: 'wiring',    unit: 'roll', stock:  18, allocated:   6, reorder:  12, unitCost:   165,   supplier: 'Southwire'   },
  { sku: 'CON-MC4',    name: 'MC4 connector kit',              category: 'wiring',    unit: 'pair', stock: 480, allocated: 120, reorder: 300, unitCost:     1.8, supplier: 'Stäubli'     },
  { sku: 'CAN-560',    name: 'Canadian Solar HiKu7 560 W',      category: 'panels',    unit: 'unit', stock: 132, allocated:  72, reorder:  60, unitCost:   198,   supplier: 'Canadian Solar' },
  { sku: 'QCL-410',    name: 'Q.PEAK DUO ML-G11 410 W',         category: 'panels',    unit: 'unit', stock:  64, allocated:  40, reorder:  50, unitCost:   162,   supplier: 'Q CELLS'     },
  { sku: 'FRO-SYM15',  name: 'Fronius Symo 15.0-3-M string',    category: 'inverters', unit: 'unit', stock:  18, allocated:   6, reorder:  10, unitCost: 2_640,   supplier: 'Fronius'     },
  { sku: 'SMA-STP25',  name: 'SMA Sunny Tripower 25 kW',        category: 'inverters', unit: 'unit', stock:   8, allocated:   3, reorder:  10, unitCost: 4_180,   supplier: 'SMA'         },
  { sku: 'LG-RESU16',  name: 'LG RESU16H Prime (16 kWh)',       category: 'batteries', unit: 'unit', stock:   5, allocated:   2, reorder:   8, unitCost: 8_950,   supplier: 'LG Energy'   },
  { sku: 'PYL-US5K',   name: 'Pylontech US5000 (4.8 kWh)',      category: 'batteries', unit: 'unit', stock:  22, allocated:  10, reorder:  15, unitCost: 1_640,   supplier: 'Pylontech'   },
  { sku: 'UFO-FOOT',   name: 'Unirac flush foot · L-foot',      category: 'mounting',  unit: 'pc',   stock: 720, allocated: 220, reorder: 200, unitCost:     3.2, supplier: 'Unirac'      },
  { sku: 'TFS-TILT',   name: 'TileFlash ballast bracket',       category: 'mounting',  unit: 'pc',   stock: 184, allocated:  64, reorder: 100, unitCost:    18,   supplier: 'EcoFasten'   },
  { sku: 'WIR-6',      name: 'PV wire 6 AWG · red · 500ft',     category: 'wiring',    unit: 'roll', stock:  12, allocated:   4, reorder:  10, unitCost:   245,   supplier: 'Southwire'   },
  { sku: 'BRK-25A',    name: 'Eaton BR125 DC breaker 25A',      category: 'wiring',    unit: 'pc',   stock: 160, allocated:  48, reorder:  80, unitCost:    24,   supplier: 'Eaton'       },
  { sku: 'GRD-COP',    name: 'Bare copper grounding · 6 AWG',   category: 'wiring',    unit: 'roll', stock:  28, allocated:  10, reorder:  20, unitCost:   118,   supplier: 'Southwire'   },
  { sku: 'IRO-EBA',    name: 'IronRidge end clamp · black',     category: 'mounting',  unit: 'pc',   stock: 880, allocated: 240, reorder: 200, unitCost:     1.6, supplier: 'IronRidge'   },
  { sku: 'JKN-565',    name: 'Jinko Tiger Neo 565 W (N-type)',  category: 'panels',    unit: 'unit', stock:  92, allocated:  48, reorder:  50, unitCost:   206,   supplier: 'Jinko Solar' },
  { sku: 'ENPH-IQ7+',  name: 'Enphase IQ7+ microinverter',      category: 'inverters', unit: 'unit', stock: 156, allocated:  40, reorder:  80, unitCost:   148,   supplier: 'Enphase'     },
];

/* =================== EPC · team members =================== */

export interface DemoEpcTeamMember {
  id: string; name: string; role: 'foreman' | 'electrician' | 'apprentice' | 'inspector';
  certs: string[]; rating: number; reviews: number;
  currentJob?: string; available: boolean; joinedAt: string; avatarTone: string;
}

export const demoEpcTeam: DemoEpcTeamMember[] = [
  { id: 't-1', name: 'Miguel Ángel Torres', role: 'foreman',     certs: ['NABCEP PV-IP', 'OSHA 30'],                  rating: 4.95, reviews: 87, currentJob: 'j-1124', available: false, joinedAt: '2024-02-14', avatarTone: '#F59E0B' },
  { id: 't-2', name: 'Camila Reyes',        role: 'electrician', certs: ['Licensed master EE'],                       rating: 4.88, reviews: 64, currentJob: 'j-1124', available: false, joinedAt: '2024-05-02', avatarTone: '#2BB673' },
  { id: 't-3', name: 'Diego Salinas',       role: 'electrician', certs: ['NABCEP PV-AS', 'OSHA 30'],                  rating: 4.84, reviews: 71, currentJob: 'j-1125', available: false, joinedAt: '2023-11-08', avatarTone: '#A78BFA' },
  { id: 't-4', name: 'Lucía Paredes',       role: 'foreman',     certs: ['NABCEP PV-IP', 'OSHA 30', 'Tesla cert'],    rating: 4.91, reviews: 92, currentJob: 'j-1125', available: false, joinedAt: '2023-08-21', avatarTone: '#FBBF24' },
  { id: 't-5', name: 'Hugo Ramírez',        role: 'apprentice',  certs: ['OSHA 10'],                                  rating: 4.62, reviews: 28, available: true,  joinedAt: '2025-09-10', avatarTone: '#6C5CE7' },
  { id: 't-6', name: 'Iván Castro',         role: 'electrician', certs: ['Master EE', 'NABCEP PV-AS'],                rating: 4.79, reviews: 55, currentJob: 'j-1127', available: false, joinedAt: '2024-01-15', avatarTone: '#2BB673' },
  { id: 't-7', name: 'Renata Silva',        role: 'inspector',   certs: ['NABCEP PV-IP', 'QA cert'],                  rating: 4.97, reviews: 41, available: true,  joinedAt: '2024-07-03', avatarTone: '#F59E0B' },
  { id: 't-8',  name: 'Pablo Morales',       role: 'apprentice',  certs: ['OSHA 10'],                                  rating: 4.54, reviews: 19, available: true,  joinedAt: '2026-01-22', avatarTone: '#A78BFA' },
  { id: 't-9',  name: 'Daniela Vargas',      role: 'electrician', certs: ['Master EE', 'OSHA 30', 'BYD cert'],         rating: 4.86, reviews: 58, currentJob: 'j-1131', available: false, joinedAt: '2023-06-19', avatarTone: '#FBBF24' },
  { id: 't-10', name: 'Ramón Beltrán',       role: 'foreman',     certs: ['NABCEP PV-IP', 'OSHA 30'],                  rating: 4.93, reviews: 76, currentJob: 'j-1134', available: false, joinedAt: '2022-09-04', avatarTone: '#2BB673' },
  { id: 't-11', name: 'Valentina Acuña',     role: 'inspector',   certs: ['NABCEP PV-IP', 'QA cert', 'Drone Part 107'], rating: 4.95, reviews: 38, available: true,  joinedAt: '2024-04-11', avatarTone: '#F59E0B' },
  { id: 't-12', name: 'Néstor Ibáñez',       role: 'electrician', certs: ['NABCEP PV-AS'],                             rating: 4.72, reviews: 44, available: true,  joinedAt: '2025-02-28', avatarTone: '#6C5CE7' },
  { id: 't-13', name: 'Esteban Fuentes',     role: 'apprentice',  certs: ['OSHA 10', 'CPR'],                           rating: 4.48, reviews: 14, available: true,  joinedAt: '2026-03-08', avatarTone: '#A78BFA' },
  { id: 't-14', name: 'Carolina Pinto',      role: 'electrician', certs: ['Master EE', 'NABCEP PV-AS', 'Tesla cert'],  rating: 4.89, reviews: 67, currentJob: 'j-1126', available: false, joinedAt: '2023-03-15', avatarTone: '#2BB673' },
  { id: 't-15', name: 'Joaquín Núñez',       role: 'foreman',     certs: ['NABCEP PV-IP', 'OSHA 30', 'Forklift'],       rating: 4.81, reviews: 51, currentJob: 'j-1135', available: false, joinedAt: '2024-08-30', avatarTone: '#FBBF24' },
  { id: 't-16', name: 'Adriana Maldonado',   role: 'inspector',   certs: ['NABCEP PV-IP'],                             rating: 4.66, reviews: 22, available: true,  joinedAt: '2025-11-12', avatarTone: '#A78BFA' },
];
