'use client';
import { t } from '@/i18n/translations';
import { Ic } from '../shared';
import { UserMenu } from '../UserMenu';
import { demoInvestorWallet } from '@/lib/demoData';

const TYPE_TONES: Record<string, { color: string; icon: 'dollar-sign' | 'arrow-up-right' | 'arrow-down-right' | 'briefcase' | 'percent' }> = {
  distribution: { color: '#2BB673', icon: 'dollar-sign' },
  deposit:      { color: '#2BB673', icon: 'arrow-down-right' },
  withdrawal:   { color: '#E5484D', icon: 'arrow-up-right' },
  investment:   { color: '#F59E0B', icon: 'briefcase' },
  fee:          { color: '#6B6B71', icon: 'percent' },
};

export default function InvestorWalletView({ lang }: { lang: string }) {
  const w = demoInvestorWallet;
  return (
    <>
      <div className="dash-header dash-fade">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#A1A1A6', fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>
            {t(lang, 'inv.wallet.kicker')}
          </span>
          <h1 style={{ color: '#EDEDEE', fontSize: 28, fontWeight: 600, letterSpacing: -0.2, margin: 0 }}>
            {t(lang, 'inv.wallet.title')}
          </h1>
        </div>
        <UserMenu lang={lang} />
      </div>

      <div className="dash-grid-3col dash-fade-1">
        <BalanceCard label={t(lang, 'inv.wallet.balance')}   value={`$${w.balanceUsd.toLocaleString('en-US')}`}   sub={t(lang, 'inv.wallet.total')} primary />
        <BalanceCard label={t(lang, 'inv.wallet.available')} value={`$${w.availableUsd.toLocaleString('en-US')}`} sub={t(lang, 'inv.wallet.readyToDeploy')} />
        <BalanceCard label={t(lang, 'inv.wallet.reserved')}  value={`$${w.reservedUsd.toLocaleString('en-US')}`}  sub={t(lang, 'inv.wallet.committed')} />
      </div>

      <div className="dash-grid-3col dash-fade-2">
        <Lifetime label={t(lang, 'inv.wallet.lifetimeDeposited')}      value={`$${w.lifetimeDeposited.toLocaleString('en-US')}`} icon="arrow-down-right" tone="#2BB673" />
        <Lifetime label={t(lang, 'inv.wallet.lifetimeWithdrawn')}      value={`$${w.lifetimeWithdrawn.toLocaleString('en-US')}`} icon="arrow-up-right"   tone="#E5484D" />
        <Lifetime label={t(lang, 'inv.wallet.lifetimeDistributions')}  value={`$${w.lifetimeDistributions.toLocaleString('en-US')}`} icon="trending-up" tone="#F59E0B" />
      </div>

      <div className="dash-card dash-fade-3" style={{ background: '#101013', border: '1px solid #1F1F23', borderRadius: 8, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #1F1F23', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#A1A1A6', fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>
            {t(lang, 'inv.wallet.transactions')}
          </span>
          <button className="dash-btn" style={{
            height: 28, padding: '0 12px', borderRadius: 6,
            background: 'transparent', border: '1px solid #1F1F23',
            color: '#A1A1A6', fontFamily: 'inherit', fontSize: 11, fontWeight: 500, cursor: 'pointer',
          }}>{t(lang, 'admin.users.export')}</button>
        </div>
        {w.transactions.map((tx, i) => {
          const tone = TYPE_TONES[tx.type];
          const sign = tx.amount >= 0 ? '+' : '';
          return (
            <div key={tx.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px',
              borderBottom: i < w.transactions.length - 1 ? '1px solid #16161A' : 'none',
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, background: '#16161A', border: '1px solid #1F1F23', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Ic n={tone.icon} s={14} c={tone.color} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                <span style={{ color: '#EDEDEE', fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.label}</span>
                <span style={{ color: '#6B6B71', fontSize: 11 }}>
                  {new Date(tx.date).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <span style={{
                color: tx.amount >= 0 ? '#2BB673' : '#E5484D',
                fontSize: 14, fontWeight: 600, fontVariantNumeric: 'tabular-nums',
              }}>{sign}${Math.abs(tx.amount).toLocaleString('en-US')}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

function BalanceCard({ label, value, sub, primary }: { label: string; value: string; sub: string; primary?: boolean }) {
  return (
    <div className="dash-card" style={{
      position: 'relative', display: 'flex', flexDirection: 'column', gap: 8, padding: 20,
      background: '#101013', border: '1px solid #1F1F23', borderRadius: 8, overflow: 'hidden',
    }}>
      {primary && <span aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: '#F59E0B' }} />}
      <span style={{ color: '#A1A1A6', fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>{label}</span>
      <span style={{ color: '#EDEDEE', fontSize: 26, fontWeight: 600, letterSpacing: -0.2, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      <span style={{ color: '#A1A1A6', fontSize: 11 }}>{sub}</span>
    </div>
  );
}

function Lifetime({ label, value, icon, tone }: { label: string; value: string; icon: 'arrow-down-right' | 'arrow-up-right' | 'trending-up'; tone: string }) {
  return (
    <div className="dash-card" style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: 14,
      background: '#101013', border: '1px solid #1F1F23', borderRadius: 8,
    }}>
      <div style={{ width: 32, height: 32, borderRadius: 6, background: '#16161A', border: '1px solid #1F1F23', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Ic n={icon} s={14} c={tone} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, flex: 1 }}>
        <span style={{ color: '#A1A1A6', fontSize: 10, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>{label}</span>
        <span style={{ color: '#EDEDEE', fontSize: 17, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      </div>
    </div>
  );
}
