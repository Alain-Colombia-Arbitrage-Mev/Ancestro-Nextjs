'use client';
import { useState, useEffect } from 'react';
import { t } from '@/i18n/translations';
import { api } from '@/lib/api-client';
import { Ic, Card, btnG } from './shared';
import { demoEpcEarnings } from '@/lib/demoData';

interface EpcTransaction { icon: 'dollar-sign' | 'hardhat' | 'wrench'; bg: string; iconColor: string; name: string; date: string; amount: string; color: string }
interface EpcEarningsData {
  ytd: number;
  pending: number;
  paid: number;
  monthly: number[];
  breakdown: { l: string; v: string; d: string }[];
  transactions: EpcTransaction[];
}

export default function EpcEarningsView({ lang }: { lang: string }) {
  const [data, setData] = useState<EpcEarningsData | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    api<EpcEarningsData>('/api/dashboard/epc/earnings', { signal: controller.signal })
      .then((d) => {
        const empty = !d || (d.ytd === 0 && d.pending === 0 && d.paid === 0);
        setData(empty ? (demoEpcEarnings as unknown as EpcEarningsData) : d);
      })
      .catch(() => setData(demoEpcEarnings as unknown as EpcEarningsData));
    return () => controller.abort();
  }, []);
  const txs = data?.transactions || [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const monthHeights = data?.monthly?.length ? data.monthly : [0, 0, 0, 0, 0, 0];
  const breakdown = data?.breakdown || [];
  return (
    <>
      <div className="dash-header dash-fade">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#848E9C', fontSize: 13 }}>{t(lang, 'epc.earnings.subtitle')}</span>
          <h1 style={{ color: '#F5F3FF', fontSize: 32, fontWeight: 800, letterSpacing: -0.5, margin: 0 }}>{t(lang, 'epc.earnings.title')}</h1>
        </div>
        <button className="dash-btn" style={{ ...btnG, height: 40 }}>{t(lang, 'epc.earnings.requestPayout')}</button>
      </div>

      <div className="dash-card dash-card-strong dash-fade-1" style={{ display: 'flex', alignItems: 'center', gap: 32, padding: 32, background: '#12100B', border: '1px solid #2A2218', borderRadius: 24, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          <span style={{ color: '#F59E0B', fontSize: 11, fontWeight: 800, letterSpacing: 1.5 }}>{t(lang, 'epc.earnings.yearEarned')}</span>
          <span style={{ color: '#F5F3FF', fontSize: 54, fontWeight: 800, letterSpacing: -1.8, lineHeight: 1 }}>${Math.round(data?.ytd ?? 0).toLocaleString('en-US')}</span>
          <span style={{ color: '#848E9C', fontSize: 13 }}>{t(lang, 'epc.earnings.fromInstalls')}</span>
        </div>
        <div style={{ width: 1, height: 96, background: '#1A1A1A' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ color: '#5E6673', fontSize: 10, fontWeight: 700, letterSpacing: 1.2 }}>{t(lang, 'epc.earnings.pending').toUpperCase()}</span>
          <span style={{ color: '#F59E0B', fontSize: 24, fontWeight: 800 }}>${Math.round(data?.pending ?? 0).toLocaleString('en-US')}</span>
          <span style={{ color: '#5E6673', fontSize: 11 }}>{t(lang, 'epc.earnings.pendingSub')}</span>
        </div>
        <div style={{ width: 1, height: 96, background: '#1A1A1A' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ color: '#02C076', fontSize: 10, fontWeight: 700, letterSpacing: 1.2 }}>{t(lang, 'epc.earnings.paidOut').toUpperCase()}</span>
          <span style={{ color: '#02C076', fontSize: 24, fontWeight: 800 }}>${Math.round(data?.paid ?? 0).toLocaleString('en-US')}</span>
          <span style={{ color: '#5E6673', fontSize: 11 }}>{t(lang, 'epc.earnings.paidOutSub')}</span>
        </div>
      </div>

      <div className="dash-grid-hero dash-fade-2">
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ color: '#5E6673', fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>{t(lang, 'epc.earnings.monthlyEarnings').toUpperCase()}</span>
              <span style={{ color: '#F5F3FF', fontSize: 18, fontWeight: 800 }}>{new Date().getFullYear()} · YTD</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 180, gap: 12 }}>
            {monthHeights.map((h, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                <div style={{ width: '100%', maxWidth: 48, height: `${h}%`, borderRadius: '8px 8px 0 0', background: `linear-gradient(180deg, ${h > 85 ? '#F59E0B' : '#F59E0B80'} 0%, #F59E0B20 100%)`, minHeight: 4 }} />
                <span style={{ color: '#5E6673', fontSize: 10, fontWeight: 600 }}>{months[i]}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <span style={{ color: '#5E6673', fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>{t(lang, 'epc.earnings.paymentBreakdown').toUpperCase()}</span>
          <span style={{ color: '#F5F3FF', fontSize: 18, fontWeight: 800 }}>{t(lang, 'epc.earnings.thisMonth')} · ${Math.round((data?.pending ?? 0) + (data?.paid ?? 0)).toLocaleString('en-US')}</span>
          {breakdown.length === 0 && (
            <div style={{ padding: 12, color: '#5E6673', fontSize: 12 }}>{t(lang, 'dashboard.affiliate.empty')}</div>
          )}
          {breakdown.map((b, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: b.d }} />
                <span style={{ color: '#848E9C', fontSize: 13 }}>{b.l}</span>
              </div>
              <span style={{ color: b.d, fontSize: 13, fontWeight: 800 }}>{b.v}</span>
            </div>
          ))}
        </Card>
      </div>

      <div className="dash-card dash-fade-3" style={{ display: 'flex', flexDirection: 'column', background: '#0E0E10', border: '1px solid #1A1A1A', borderRadius: 18, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 48, padding: '0 24px' }}>
          <span style={{ color: '#5E6673', fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>{t(lang, 'epc.earnings.recentTransactions').toUpperCase()}</span>
          <span style={{ color: '#F59E0B', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{t(lang, 'epc.earnings.viewAllTx')} {txs.length} →</span>
        </div>
        <div style={{ height: 1, background: '#1A1A1A' }} />
        {txs.length === 0 && (
          <div style={{ padding: 32, color: '#5E6673', fontSize: 13, textAlign: 'center' }}>{t(lang, 'dashboard.affiliate.empty')}</div>
        )}
        {txs.map((tx, i) => (
          <div key={i}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 56, padding: '0 24px' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: tx.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ic n={tx.icon} s={14} c={tx.iconColor} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ color: '#F5F3FF', fontSize: 13, fontWeight: 600 }}>{tx.name}</span>
                <span style={{ color: '#5E6673', fontSize: 11 }}>{tx.date}</span>
              </div>
              <span style={{ color: tx.color, fontSize: 14, fontWeight: 800, textAlign: 'right', width: 120 }}>{tx.amount}</span>
            </div>
            {i < txs.length - 1 && <div style={{ height: 1, background: '#0A0A0A' }} />}
          </div>
        ))}
      </div>
    </>
  );
}
