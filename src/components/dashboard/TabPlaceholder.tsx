'use client';
import { t } from '@/i18n/translations';
import { Ic } from './shared';

/** Lightweight placeholder for tabs whose screen hasn't been built yet. */
export function TabPlaceholder({ lang, labelKey }: { lang: string; labelKey: string }) {
  return (
    <div className="dash-fade" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 16, padding: '80px 20px',
      background: '#0E0E10', border: '1px solid #1A1A1A', borderRadius: 18,
      minHeight: 'calc(100vh - 120px)',
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 16,
        background: '#F59E0B14', border: '1px solid #F59E0B40',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Ic n="clock" s={28} c="#F59E0B" />
      </div>
      <span style={{ color: '#F5F3FF', fontSize: 22, fontWeight: 800 }}>
        {t(lang, labelKey)}
      </span>
      <span style={{ color: '#848E9C', fontSize: 13, textAlign: 'center', maxWidth: 360 }}>
        {t(lang, 'dashboard.placeholder.soon') || 'This screen is coming soon.'}
      </span>
    </div>
  );
}
