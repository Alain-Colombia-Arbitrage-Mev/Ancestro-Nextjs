import { t } from '@/i18n/translations';

export default function FooterCtaL3({ lang }: { lang: string }) {
  return (
    <section className="cl3-footercta" style={{
      background: '#0a0a0a', position: 'relative', zIndex: 1, isolation: 'isolate',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 60px', minHeight: 500,
    }}>
      <div style={{ textAlign: 'center', maxWidth: 900, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <h2 className="cl3-footercta-title" style={{ fontSize: 42, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-.5px' }}>
          {t(lang, 'chargingL3.cta.title')}
        </h2>
        <p style={{ fontSize: 16, color: '#c0c0c0', fontWeight: 300, margin: 0, lineHeight: 1.6 }}>
          {t(lang, 'chargingL3.cta.desc')}
        </p>
        <a href={`/${lang}/join?profile=host`} style={{
          display: 'inline-block', padding: '16px 50px', background: '#f8b03b', color: '#000',
          fontSize: 18, fontWeight: 600, borderRadius: 50, textDecoration: 'none', marginTop: 8,
        }}>{t(lang, 'chargingL3.hero.cta')}</a>
      </div>
    </section>
  );
}
