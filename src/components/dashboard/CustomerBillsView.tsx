'use client';
import { t } from '@/i18n/translations';
import { Ic } from './shared';
import { UserMenu } from './UserMenu';
import { demoCustomerBills } from '@/lib/demoData';

export default function CustomerBillsView({ lang }: { lang: string }) {
  const bills = demoCustomerBills;
  const ytdSavings = bills.reduce((s, b) => s + b.solarSavingsUsd, 0);
  const ytdNet     = bills.reduce((s, b) => s + b.netUsd, 0);
  const next       = bills[0];

  return (
    <>
      <div className="dash-header dash-fade">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#A1A1A6', fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>
            {t(lang, 'sidebar.customer.bills')}
          </span>
          <h1 style={{ color: '#EDEDEE', fontSize: 28, fontWeight: 600, letterSpacing: -0.2, margin: 0 }}>
            {t(lang, 'cust.bills.title')}
          </h1>
          <span style={{ color: '#A1A1A6', fontSize: 13 }}>{t(lang, 'cust.bills.subtitle')}</span>
        </div>
        <UserMenu lang={lang} />
      </div>

      <div className="dash-grid-3col dash-fade-1">
        <Tile label={t(lang, 'cust.bills.nextBill')}    value={`$${next.netUsd}`}       sub={`${t(lang, 'cust.bills.dueAt')} ${next.dueAt}`} accent="#F59E0B" />
        <Tile label={t(lang, 'cust.bills.ytdSavings')}  value={`$${ytdSavings}`}        sub={t(lang, 'cust.bills.solarSavings')}            accent="#2BB673" />
        <Tile label={t(lang, 'cust.bills.ytdNet')}      value={`$${ytdNet}`}            sub={t(lang, 'cust.bills.afterSolar')}              accent="#A78BFA" />
      </div>

      <div className="dash-card dash-fade-2" style={{ background: '#101013', border: '1px solid #1F1F23', borderRadius: 8, padding: 0, overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1.2fr 100px 100px 100px 100px 90px',
          gap: 8, padding: '12px 16px', borderBottom: '1px solid #1F1F23',
          color: '#A1A1A6', fontSize: 10, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase',
        }}>
          <span>{t(lang, 'cust.bills.col.period')}</span>
          <span style={{ textAlign: 'right' }}>{t(lang, 'cust.bills.col.produced')}</span>
          <span style={{ textAlign: 'right' }}>{t(lang, 'cust.bills.col.gross')}</span>
          <span style={{ textAlign: 'right' }}>{t(lang, 'cust.bills.col.savings')}</span>
          <span style={{ textAlign: 'right' }}>{t(lang, 'cust.bills.col.net')}</span>
          <span style={{ textAlign: 'right' }}>{t(lang, 'cust.bills.col.status')}</span>
        </div>
        {bills.map((b, i) => (
          <div key={b.id} style={{
            display: 'grid', gridTemplateColumns: '1.2fr 100px 100px 100px 100px 90px', gap: 8,
            padding: '12px 16px', alignItems: 'center',
            borderBottom: i < bills.length - 1 ? '1px solid #16161A' : 'none',
          }}>
            <span style={{ color: '#EDEDEE', fontSize: 13, fontWeight: 500 }}>{b.period}</span>
            <span style={{ color: '#A1A1A6', fontSize: 12, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{b.producedKwh} kWh</span>
            <span style={{ color: '#A1A1A6', fontSize: 12, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>${b.grossUsd}</span>
            <span style={{ color: '#2BB673', fontSize: 12, textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>-${b.solarSavingsUsd}</span>
            <span style={{ color: '#EDEDEE', fontSize: 13, textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>${b.netUsd}</span>
            <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <span style={{
                padding: '2px 8px', borderRadius: 4,
                background: b.status === 'paid' ? '#2BB67318' : '#F59E0B18',
                color: b.status === 'paid' ? '#2BB673' : '#F59E0B',
                fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
              }}>{b.status}</span>
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

function Tile({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: string }) {
  return (
    <div className="dash-card" style={{
      position: 'relative', display: 'flex', flexDirection: 'column', gap: 6, padding: 16,
      background: '#101013', border: '1px solid #1F1F23', borderRadius: 8, overflow: 'hidden',
    }}>
      <span aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: accent || '#F59E0B' }} />
      <span style={{ color: '#A1A1A6', fontSize: 10, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>{label}</span>
      <span style={{ color: '#EDEDEE', fontSize: 24, fontWeight: 600, letterSpacing: -0.2, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      <span style={{ color: '#A1A1A6', fontSize: 11 }}>{sub}</span>
    </div>
  );
}
