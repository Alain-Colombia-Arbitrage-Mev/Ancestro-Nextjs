import { t } from '@/i18n/translations';
import { IMG_L3 } from '../constants';

export default function NetworkTrust({ lang }: { lang: string }) {
  return (
    <section className="cl3-trust" style={{
      position: 'relative', zIndex: 1, isolation: 'isolate', display: 'flex', alignItems: 'center', gap: 58, padding: 0, minHeight: 487, background: '#000',
    }}>
      <div className="cl3-trust-img" style={{
        flex: '0 0 60%', minHeight: 487, borderRadius: '0 20px 20px 0',
        backgroundImage: `url(${IMG_L3}/trust-map.webp)`, backgroundSize: 'cover', backgroundPosition: 'center',
        border: '1px solid rgba(255,255,255,.1)', borderLeft: 'none',
      }} />
      <div className="cl3-trust-text" style={{ flex: 1, padding: '0 80px 0 0', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-.5px' }}>{t(lang, 'chargingL3.trust.title')}</h2>
        <p style={{ fontSize: 16, color: '#a3a3a3', margin: 0, lineHeight: 1.35, fontWeight: 500 }}>{t(lang, 'chargingL3.trust.desc1')}</p>
        <p style={{ fontSize: 16, color: '#a3a3a3', margin: 0, lineHeight: 1.35, fontWeight: 500 }}>{t(lang, 'chargingL3.trust.desc2')}</p>
        <p style={{ fontSize: 16, color: '#a3a3a3', margin: 0, lineHeight: 1.35, fontWeight: 500 }}>{t(lang, 'chargingL3.trust.desc3')}</p>
      </div>
    </section>
  );
}
