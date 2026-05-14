'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '@/lib/api-client';
import type { Stats } from './shared';
import {
  demoCustomerProduction,
  demoStats,
  isStatsPopulated,
  isProductionPopulated,
  pickDemo,
} from '@/lib/demoData';

interface CustomerProduction {
  producing_now_kw: number | null;
  today_kwh: number | null;
  month_kwh: number | null;
  month_goal_kwh: number | null;
  used_kwh: number | null;
  to_grid_kwh: number | null;
  to_battery_kwh: number | null;
  battery_pct: number | null;
  battery_capacity_kwh: number | null;
  savings_month_usd: number | null;
  savings_change_pct: number | null;
  co2_kg_month: number | null;
  next_bill_amount: number | null;
  next_bill_date: string | null;
  system_status: string;
}

interface DashboardDataValue {
  refCode: string;
  refUrl: string;
  stats: Stats | null;
  production: CustomerProduction | null;
  /** Force-refresh stats (e.g. after a conversion). */
  refreshStats: () => Promise<void>;
}

const Ctx = createContext<DashboardDataValue | null>(null);
const CACHE_KEY = 'ancestro_dashboard_cache';
const TTL_MS = 60_000; // 1 min stale-while-revalidate window

interface CacheShape {
  refCode?: string;
  stats?: Stats | null;
  production?: CustomerProduction | null;
  ts?: number;
}

function readCache(): CacheShape {
  try {
    if (typeof window === 'undefined') return {};
    const raw = sessionStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}
function writeCache(c: CacheShape) {
  try { if (typeof window !== 'undefined') sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ...c, ts: Date.now() })); } catch {}
}

interface ProviderProps {
  lang: string;
  userId?: string | number;
  children: React.ReactNode;
}

export function DashboardDataProvider({ lang, userId, children }: ProviderProps) {
  const cached = useMemo(() => readCache(), []);
  const fresh = useMemo(() => (cached.ts ?? 0) > Date.now() - TTL_MS, [cached.ts]);

  const [refCode, setRefCode] = useState<string>(cached.refCode || '');
  const [stats, setStats] = useState<Stats | null>(fresh ? (cached.stats ?? null) : null);
  const [production, setProduction] = useState<CustomerProduction | null>(fresh ? (cached.production ?? null) : null);
  const inFlight = useRef<AbortController | null>(null);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const refUrl = refCode ? `${origin}/${lang}/r/${refCode}` : '';

  // Single fetch on mount (or when user changes), de-duplicating against in-flight requests.
  useEffect(() => {
    inFlight.current?.abort();
    const controller = new AbortController();
    inFlight.current = controller;

    (async () => {
      try {
        // Always (re)ensure a referral code exists for this user; idempotent.
        const linkP = api<{ code?: string }>('/api/referrals', {
          method: 'POST', body: {}, signal: controller.signal,
        });
        const statsP = api<Stats>('/api/referrals/stats', { signal: controller.signal });
        const prodP  = api<CustomerProduction>('/api/dashboard/customer/production', { signal: controller.signal })
          .catch(() => null);

        const [link, s, p] = await Promise.all([linkP, statsP, prodP]);

        if (controller.signal.aborted) return;

        // Apply demo fallback when the real backend returns empty/null
        // (the investor demo always shows credible numbers).
        const effectiveStats = pickDemo(s, demoStats, isStatsPopulated);
        const effectiveProduction = pickDemo(p, demoCustomerProduction, isProductionPopulated);

        if (link?.code) setRefCode(link.code);
        else if (!cached.refCode) setRefCode(demoStats.code || 'demo-1842');
        setStats(effectiveStats);
        setProduction(effectiveProduction);

        writeCache({
          refCode: link?.code || cached.refCode,
          stats: effectiveStats,
          production: effectiveProduction,
        });
      } catch (err) {
        if ((err as { name?: string })?.name === 'AbortError') return;
        // Keep stale cache on error.
      }
    })();

    return () => controller.abort();
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const refreshStats = useCallback(async () => {
    try {
      const s = await api<Stats>('/api/referrals/stats');
      setStats(s);
      writeCache({ ...readCache(), stats: s });
    } catch {}
  }, []);

  const value = useMemo<DashboardDataValue>(() => ({
    refCode, refUrl, stats, production, refreshStats,
  }), [refCode, refUrl, stats, production, refreshStats]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDashboardData(): DashboardDataValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useDashboardData must be used inside DashboardDataProvider');
  return v;
}
