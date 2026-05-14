'use client';
import { t } from '@/i18n/translations';
import { Ic } from './shared';
import { UserMenu } from './UserMenu';
import { demoCustomerEnergy } from '@/lib/demoData';

export default function CustomerEnergyView({ lang }: { lang: string }) {
  const e = demoCustomerEnergy;
  const peak = Math.max(...e.hourly);

  return (
    <>
      <div className="dash-header dash-fade">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#A1A1A6', fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>
            {t(lang, 'sidebar.customer.energy')}
          </span>
          <h1 style={{ color: '#EDEDEE', fontSize: 28, fontWeight: 600, letterSpacing: -0.2, margin: 0 }}>
            {t(lang, 'cust.energy.title')}
          </h1>
          <span style={{ color: '#A1A1A6', fontSize: 13 }}>{e.ytdKwh.toLocaleString('en-US')} kWh YTD</span>
        </div>
        <UserMenu lang={lang} />
      </div>

      <div className="dash-grid-3col dash-fade-1">
        <Tile label={t(lang, 'cust.energy.selfUse')}  value={`${Math.round(e.selfConsumed * 100)}%`}     sub={t(lang, 'cust.energy.selfUseSub')}  accent="#F59E0B" />
        <Tile label={t(lang, 'cust.energy.export')}   value={`${Math.round(e.exportedToGrid * 100)}%`}   sub={t(lang, 'cust.energy.exportSub')}   accent="#2BB673" />
        <Tile label={t(lang, 'cust.energy.battery')}  value={`${Math.round(e.storedInBattery * 100)}%`}  sub={t(lang, 'cust.energy.batterySub')}  accent="#A78BFA" />
      </div>

      {/* Hourly chart */}
      <div className="dash-card dash-fade-2" style={{ padding: 20, background: '#101013', border: '1px solid #1F1F23', borderRadius: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <span style={{ color: '#A1A1A6', fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>
            {t(lang, 'cust.energy.today')}
          </span>
          <span style={{ color: '#A1A1A6', fontSize: 11 }}>{t(lang, 'cust.energy.peak')} {peak} kW</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 140 }}>
          {e.hourly.map((v, i) => (
            <div key={i} style={{
              flex: 1, height: `${(v / peak) * 100}%`,
              background: v > 0 ? '#F59E0B' : '#1F1F23',
              borderRadius: '2px 2px 0 0',
              minHeight: 2,
            }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, color: '#6B6B71', fontSize: 10 }}>
          {['00', '06', '12', '18', '24'].map(h => <span key={h}>{h}h</span>)}
        </div>
      </div>

      {/* Monthly chart */}
      <div className="dash-card dash-fade-3" style={{ padding: 20, background: '#101013', border: '1px solid #1F1F23', borderRadius: 8 }}>
        <span style={{ color: '#A1A1A6', fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>
          {t(lang, 'cust.energy.last6m')}
        </span>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 120, marginTop: 12 }}>
          {e.monthly.map((v, i) => {
            const maxM = Math.max(...e.monthly);
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#A1A1A6', fontSize: 10, fontVariantNumeric: 'tabular-nums' }}>{v}</span>
                <div style={{ width: '100%', height: `${(v / maxM) * 100}%`, background: i === e.monthly.length - 1 ? '#F59E0B' : '#1F1F23', borderRadius: '4px 4px 0 0', minHeight: 4 }} />
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 6, color: '#6B6B71', fontSize: 10 }}>
          {['Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May'].map(m => <span key={m}>{m}</span>)}
        </div>
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
