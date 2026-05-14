'use client';
import { t } from '@/i18n/translations';
import { Ic } from '../shared';

interface MaterialItem { label: string; value: string; statusColor?: string; statusLabel?: string }

interface Props {
  lang: string;
  /** Hero label above the map (e.g. "Station 04 - Online") */
  mapTitle?: string;
  mapSub?: string;
  /** Bottom status banner. */
  bannerTitle?: string;
  bannerSub?: string;
  bannerTone?: 'green' | 'amber';
  /** Right list of inventory / materials / specs. */
  materials?: MaterialItem[];
}

export function InvestorSidePanel({
  lang,
  mapTitle = t(lang, 'inv.side.mapTitle'),
  mapSub   = t(lang, 'inv.side.mapSub'),
  bannerTitle = t(lang, 'inv.side.bannerTitle'),
  bannerSub   = t(lang, 'inv.side.bannerSub'),
  bannerTone = 'green',
  materials = [
    { label: t(lang, 'inv.mat.solarPanels'),  value: 'OK',         statusLabel: 'OK',         statusColor: '#02C076' },
    { label: t(lang, 'inv.mat.batteries'),    value: 'OK',         statusLabel: 'OK',         statusColor: '#02C076' },
    { label: t(lang, 'inv.mat.mounting'),     value: 'Backup OK',  statusLabel: 'Backup OK',  statusColor: '#02C076' },
    { label: t(lang, 'inv.mat.inverters'),    value: 'Pickup 7d',  statusLabel: '7 days',     statusColor: '#F59E0B' },
  ],
}: Props) {
  const bannerBg = bannerTone === 'green' ? '#02C07614' : '#F59E0B14';
  const bannerBorder = bannerTone === 'green' ? '#02C07640' : '#F59E0B40';
  const bannerColor = bannerTone === 'green' ? '#02C076' : '#F59E0B';

  return (
    <div className="dash-fade-2" style={{ display: 'flex', flexDirection: 'column', gap: 14, alignSelf: 'stretch' }}>
      {/* Map card */}
      <div className="dash-card" style={{
        position: 'relative', height: 280, padding: 0, overflow: 'hidden',
        background: 'linear-gradient(135deg, #142016 0%, #0E1810 50%, #0A0A0A 100%)',
        border: '1px solid #1A1A1A', borderRadius: 18,
      }}>
        <div style={{ position: 'absolute', inset: 0,
          backgroundImage:
            'radial-gradient(circle at 30% 40%, rgba(2,192,118,0.12), transparent 60%),' +
            'radial-gradient(circle at 70% 70%, rgba(245,158,11,0.10), transparent 60%),' +
            'linear-gradient(45deg, transparent 49%, rgba(255,255,255,0.04) 50%, transparent 51%) 0 0/60px 60px',
        }} />
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ color: '#F5F3FF', fontSize: 13, fontWeight: 700 }}>{mapTitle}</span>
          <span style={{ color: '#848E9C', fontSize: 11 }}>{mapSub}</span>
        </div>
        {/* Map pins */}
        {[
          { x: 35, y: 55, color: '#F59E0B' },
          { x: 60, y: 35, color: '#02C076' },
          { x: 70, y: 70, color: '#A78BFA' },
        ].map((p, i) => (
          <div key={i} style={{
            position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
            width: 16, height: 16, borderRadius: 8,
            background: p.color, boxShadow: `0 0 12px ${p.color}80`,
            border: '2px solid #0A0A0A',
          }} />
        ))}
      </div>

      {/* Materials list */}
      <div className="dash-card" style={{ padding: 16, background: '#0E0E10', border: '1px solid #1A1A1A', borderRadius: 16 }}>
        <span style={{ color: '#5E6673', fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10, display: 'block' }}>
          {t(lang, 'inv.side.materialsTitle')}
        </span>
        {materials.map((m, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '8px 0',
            borderTop: i === 0 ? 'none' : '1px solid #0A0A0A',
          }}>
            <span style={{ color: '#A1A1AA', fontSize: 12 }}>{m.label}</span>
            <span style={{
              color: m.statusColor || '#02C076', fontSize: 11, fontWeight: 700,
              padding: '2px 8px', borderRadius: 6,
              background: `${m.statusColor || '#02C076'}15`,
              border: `1px solid ${m.statusColor || '#02C076'}30`,
            }}>{m.statusLabel || m.value}</span>
          </div>
        ))}
      </div>

      {/* Status banner */}
      <div className="dash-card" style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: 14, background: bannerBg, border: `1px solid ${bannerBorder}`, borderRadius: 14,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: `${bannerColor}22`, border: `1px solid ${bannerColor}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Ic n="shield-check" s={16} c={bannerColor} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 }}>
          <span style={{ color: '#F5F3FF', fontSize: 13, fontWeight: 700 }}>{bannerTitle}</span>
          <span style={{ color: bannerColor, fontSize: 11 }}>{bannerSub}</span>
        </div>
      </div>
    </div>
  );
}
