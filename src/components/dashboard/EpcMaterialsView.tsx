'use client';
import { t } from '@/i18n/translations';
import { Ic } from './shared';
import { UserMenu } from './UserMenu';
import { demoEpcMaterials } from '@/lib/demoData';

const CATEGORY_ICONS: Record<string, 'sun' | 'zap' | 'briefcase' | 'package' | 'hardhat'> = {
  panels: 'sun', inverters: 'zap', batteries: 'briefcase', mounting: 'package', wiring: 'hardhat',
};

export default function EpcMaterialsView({ lang }: { lang: string }) {
  const items = demoEpcMaterials;
  const totalValue = items.reduce((s, m) => s + m.stock * m.unitCost, 0);
  const lowStock = items.filter(m => m.stock - m.allocated < m.reorder).length;
  const totalSkus = items.length;

  return (
    <>
      <div className="dash-header dash-fade">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#A1A1A6', fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>
            {t(lang, 'sidebar.epc.materials')}
          </span>
          <h1 style={{ color: '#EDEDEE', fontSize: 28, fontWeight: 600, letterSpacing: -0.2, margin: 0 }}>
            {t(lang, 'epc.mat.title')}
          </h1>
          <span style={{ color: '#A1A1A6', fontSize: 13 }}>{totalSkus} SKUs · {t(lang, 'epc.mat.subtitle')}</span>
        </div>
        <UserMenu lang={lang} />
      </div>

      <div className="dash-grid-3col dash-fade-1">
        <Kpi label={t(lang, 'epc.mat.inventoryValue')} value={`$${(totalValue / 1000).toFixed(1)}k`} sub={t(lang, 'epc.mat.warehouseTotal')} accent="#F59E0B" />
        <Kpi label={t(lang, 'epc.mat.lowStock')}       value={String(lowStock)}                       sub={t(lang, 'epc.mat.needReorder')}  accent={lowStock > 0 ? '#E5484D' : '#2BB673'} />
        <Kpi label={t(lang, 'epc.mat.suppliers')}      value={String(new Set(items.map(i => i.supplier)).size)} sub={t(lang, 'epc.mat.activePartners')} accent="#A78BFA" />
      </div>

      <div className="dash-card dash-fade-2" style={{ background: '#101013', border: '1px solid #1F1F23', borderRadius: 8, padding: 0, overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '90px 2fr 90px 80px 80px 80px 110px',
          gap: 8, padding: '12px 16px', borderBottom: '1px solid #1F1F23',
          color: '#A1A1A6', fontSize: 10, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase',
        }}>
          <span>{t(lang, 'epc.mat.col.sku')}</span>
          <span>{t(lang, 'epc.mat.col.item')}</span>
          <span style={{ textAlign: 'right' }}>{t(lang, 'epc.mat.col.stock')}</span>
          <span style={{ textAlign: 'right' }}>{t(lang, 'epc.mat.col.allocated')}</span>
          <span style={{ textAlign: 'right' }}>{t(lang, 'epc.mat.col.free')}</span>
          <span style={{ textAlign: 'right' }}>{t(lang, 'epc.mat.col.cost')}</span>
          <span style={{ textAlign: 'right' }}>{t(lang, 'epc.mat.col.supplier')}</span>
        </div>
        {items.map((m, i) => {
          const free = m.stock - m.allocated;
          const low = free < m.reorder;
          const icon = CATEGORY_ICONS[m.category];
          return (
            <div key={m.sku} style={{
              display: 'grid', gridTemplateColumns: '90px 2fr 90px 80px 80px 80px 110px', gap: 8,
              padding: '12px 16px', alignItems: 'center',
              borderBottom: i < items.length - 1 ? '1px solid #16161A' : 'none',
              background: low ? '#E5484D08' : 'transparent',
            }}>
              <span style={{ color: '#6B6B71', fontSize: 11, fontFamily: 'monospace' }}>{m.sku}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: '#16161A', border: '1px solid #1F1F23', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Ic n={icon} s={14} c="#F59E0B" />
                </div>
                <span style={{ color: '#EDEDEE', fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</span>
              </div>
              <span style={{ color: '#EDEDEE', fontSize: 12, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{m.stock} {m.unit}</span>
              <span style={{ color: '#A1A1A6', fontSize: 12, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{m.allocated}</span>
              <span style={{ color: low ? '#E5484D' : '#2BB673', fontSize: 12, fontWeight: 600, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{free}</span>
              <span style={{ color: '#A1A1A6', fontSize: 12, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>${m.unitCost.toLocaleString('en-US')}</span>
              <span style={{ color: '#A1A1A6', fontSize: 11, textAlign: 'right' }}>{m.supplier}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

function Kpi({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: string }) {
  return (
    <div className="dash-card" style={{
      position: 'relative', display: 'flex', flexDirection: 'column', gap: 6, padding: 16,
      background: '#101013', border: '1px solid #1F1F23', borderRadius: 8, overflow: 'hidden',
    }}>
      <span aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: accent || '#F59E0B' }} />
      <span style={{ color: '#A1A1A6', fontSize: 10, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>{label}</span>
      <span style={{ color: '#EDEDEE', fontSize: 22, fontWeight: 600, letterSpacing: -0.2, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      <span style={{ color: '#A1A1A6', fontSize: 11 }}>{sub}</span>
    </div>
  );
}
