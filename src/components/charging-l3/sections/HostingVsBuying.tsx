import { t } from '@/i18n/translations';

const cardBase: React.CSSProperties = {
  flex: 1, padding: '100px 50px', borderRadius: 10,
  background: 'linear-gradient(180deg, rgba(255,255,255,.1) 0%, rgba(255,255,255,0) 100%)',
  border: '1px solid rgba(255,255,255,.1)',
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 50,
};

export default function HostingVsBuying({ lang }: { lang: string }) {
  return (
    <section style={{ background: '#0a0a0a', position: 'relative', zIndex: 1, isolation: 'isolate', padding: '80px 32px', textAlign: 'center' }}>
      <h2 style={{ fontSize: 36, fontWeight: 700, color: '#fff', margin: '0 0 50px', letterSpacing: '-.5px' }}>
        {t(lang, 'chargingL3.hosting.title')}
      </h2>
      <div className="cl3-hosting-grid" style={{ display: 'flex', flexDirection: 'row', gap: 50, justifyContent: 'center', maxWidth: 1128, margin: '0 auto' }}>
        <div style={cardBase}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, flex: 1 }}>
            <h3 style={{ fontSize: 24, fontWeight: 500, color: '#fff', margin: 0, textAlign: 'center' }}>{t(lang, 'chargingL3.hosting.buyTitle')}</h3>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,.5)', margin: 0, lineHeight: 1.5, textAlign: 'center' }}>{t(lang, 'chargingL3.hosting.buyDesc')}</p>
          </div>
          <a href={`/${lang}/join?profile=customer`} style={{ display: 'block', width: '100%', padding: '12px 20px', background: 'rgba(255,255,255,.1)', backdropFilter: 'blur(26px)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 15, color: '#fff', fontSize: 15, fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>{t(lang, 'chargingL3.hosting.buyCta')}</a>
        </div>
        <div style={{ ...cardBase, borderColor: 'rgba(248,176,59,.2)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, flex: 1 }}>
            <h3 style={{ fontSize: 26, fontWeight: 500, color: '#fff', margin: 0, textAlign: 'center' }}>{t(lang, 'chargingL3.hosting.hostTitle')}</h3>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,.5)', margin: 0, lineHeight: 1.5, textAlign: 'center', fontWeight: 500 }}>{t(lang, 'chargingL3.hosting.hostDesc')}</p>
          </div>
          <a href={`/${lang}/join?profile=host`} style={{ display: 'block', width: '100%', padding: '12px 20px', background: '#f8b03b', border: '1px solid transparent', borderRadius: 15, color: '#000', fontSize: 15, fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>{t(lang, 'chargingL3.hosting.hostCta')}</a>
        </div>
      </div>
    </section>
  );
}
