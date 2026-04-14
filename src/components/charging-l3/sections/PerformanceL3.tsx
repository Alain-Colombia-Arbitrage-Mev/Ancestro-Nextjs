import { t } from '@/i18n/translations';
import { IMG_L3 } from '../constants';

const featureKeys = [
  { titleKey: 'chargingL3.perf.speed', descKey: 'chargingL3.perf.speedDesc', icon: `${IMG_L3}/icon-speed.png` },
  { titleKey: 'chargingL3.perf.design', descKey: 'chargingL3.perf.designDesc', icon: `${IMG_L3}/icon-design.png` },
  { titleKey: 'chargingL3.perf.smart', descKey: 'chargingL3.perf.smartDesc', icon: `${IMG_L3}/icon-smart.png` },
];

const sectionStyle: React.CSSProperties = {
  background: '#0a0a0a', position: 'relative', zIndex: 1, isolation: 'isolate', padding: '80px 32px', textAlign: 'center',
};

const cardStyle: React.CSSProperties = {
  flex: 1, padding: '50px 30px', borderRadius: 10,
  background: 'linear-gradient(180deg, rgba(255,255,255,.1) 0%, rgba(255,255,255,0) 100%)',
  border: '1px solid rgba(255,255,255,.1)', backdropFilter: 'blur(26px)', WebkitBackdropFilter: 'blur(26px)',
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30,
};

export default function PerformanceL3({ lang }: { lang: string }) {
  return (
    <section style={sectionStyle}>
      <h2 style={{ fontSize: 36, fontWeight: 700, color: '#fff', margin: '0 0 40px', letterSpacing: '-.5px' }}>
        {t(lang, 'chargingL3.perf.title')}
      </h2>
      <div className="cl3-perf-grid" style={{ display: 'flex', flexDirection: 'row', gap: 50, justifyContent: 'center', maxWidth: 1128, margin: '0 auto 30px' }}>
        {featureKeys.map((f) => (
          <div key={f.titleKey} style={cardStyle}>
            <img src={f.icon} alt={t(lang, f.titleKey)} style={{ width: 75, height: 75, objectFit: 'contain' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <h3 style={{ fontSize: 24, fontWeight: 500, color: '#fff', margin: 0 }}>{t(lang, f.titleKey)}</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', margin: 0, lineHeight: 1.5, fontWeight: 500, maxWidth: 220, textAlign: 'center' }}>{t(lang, f.descKey)}</p>
            </div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 15, color: '#b0b0b0', margin: 0, letterSpacing: '-.17px' }}>
        {t(lang, 'chargingL3.perf.note')}
      </p>
    </section>
  );
}
