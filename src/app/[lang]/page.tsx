import Image from 'next/image';
import Navbar from '@/components/Navbar';
import HeroBanner from '@/components/HeroBanner';
import AskBox from '@/components/AskBox';
import InfoSection from '@/components/InfoSection';
import LATAMSection from '@/components/LATAMSection';
import ShopSection from '@/components/ShopSection';
import Footer from '@/components/Footer';
import { t } from '@/i18n/translations';
import { CDN_URL } from '@/lib/cdn';

interface PageProps { params: Promise<{ lang: string }> }

export default async function HomePage({ params }: PageProps) {
  const { lang } = await params;
  const cdn = CDN_URL;

  const images = {
    heroBg: `${cdn}/1.webp`,
    infoSection1: `${cdn}/images/info-section-1.webp?v=3`,
    infoSection2: `${cdn}/images/info-section-2.webp?v=3`,
    charger: `${cdn}/images/charger-bg.webp`,
    vehicle: `${cdn}/images/vehicle.webp`,
    latamMap: `${cdn}/MAPA.svg`,
    footerBg: `${cdn}/images/footer-bg.webp`,
    backgroundSection: `${cdn}/images/nature-bg.webp`,
    solarPanels: `${cdn}/images/shop-solar-v2.webp`,
    battery: `${cdn}/images/shop-battery-v2.webp`,
    charging: `${cdn}/images/shop-charging-v2.webp`,
    vehicles: `${cdn}/images/shop-vehicles-v2.webp`,
  };

  const flags = [
    { country: "Colombia", imageUrl: `${cdn}/images/flags/colombia.png` },
    { country: "Panama", imageUrl: `${cdn}/images/flags/panama.png` },
    { country: "Dominican Republic", imageUrl: `${cdn}/images/flags/dominican-republic.png` },
    { country: "Mexico", imageUrl: `${cdn}/images/flags/mexico.png` },
    { country: "Peru", imageUrl: `${cdn}/images/flags/peru.png` },
    { country: "Guatemala", imageUrl: `${cdn}/images/flags/guatemala.png` },
    { country: "El Salvador", imageUrl: `${cdn}/images/flags/el-salvador.png` },
    { country: "Uruguay", imageUrl: `${cdn}/images/flags/uruguay.png` },
    { country: "Costa Rica", imageUrl: `${cdn}/images/flags/costa-rica.png` },
    { country: "Brazil", imageUrl: `${cdn}/images/flags/brazil.png` },
    { country: "Nicaragua", imageUrl: `${cdn}/images/flags/nicaragua.png` },
    { country: "Honduras", imageUrl: `${cdn}/images/flags/honduras.png` },
    { country: "Chile", imageUrl: `${cdn}/images/flags/chile.png` },
    { country: "Argentina", imageUrl: `${cdn}/images/flags/argentina.png` },
    { country: "Bolivia", imageUrl: `${cdn}/images/flags/bolivia.png` },
    { country: "Belize", imageUrl: `${cdn}/images/flags/belize.png` },
    { country: "Ecuador", imageUrl: `${cdn}/images/flags/ecuador.png` },
    { country: "Paraguay", imageUrl: `${cdn}/images/flags/paraguay.png` },
  ];

  const heroSlides = [
    {
      type: 'image' as const,
      src: images.heroBg,
      badge: t(lang, 'hero.badge'),
      title: t(lang, 'hero.title'),
      title2: t(lang, 'hero.title2'),
      ctaLeft: { text: t(lang, 'hero.cta2'), href: `/${lang}/energy/home` },
      ctaRight: { text: t(lang, 'hero.cta'), href: `/${lang}/join` },
    },
    {
      type: 'video' as const,
      src: `${cdn}/bg2.mp4`,
      badge: t(lang, 'hero.slide2.badge'),
      title: t(lang, 'hero.slide2.title'),
      title2: t(lang, 'hero.slide2.title2'),
      ctaLeft: { text: t(lang, 'hero.slide2.cta2'), href: `/${lang}/energy/home` },
      ctaRight: { text: t(lang, 'hero.slide2.cta'), href: `/${lang}/join` },
    },
  ];

  const products = [
    { title: t(lang, 'shop.solar.title'), description: t(lang, 'shop.solar.desc'), backgroundImage: images.solarPanels, orderHref: `/${lang}/join`, learnHref: `/${lang}/energy/home` },
    { title: t(lang, 'shop.battery.title'), description: t(lang, 'shop.battery.desc'), backgroundImage: images.battery, orderHref: `/${lang}/join`, learnHref: `/${lang}/energy/home` },
    { title: t(lang, 'shop.charging.title'), description: t(lang, 'shop.charging.desc'), backgroundImage: images.charging, orderHref: `/${lang}/join`, learnHref: `/${lang}/coming-soon` },
    { title: t(lang, 'shop.vehicles.title'), description: t(lang, 'shop.vehicles.desc'), backgroundImage: images.vehicles, orderHref: `/${lang}/join`, learnHref: `/${lang}/coming-soon` },
  ];

  return (
    <>
      <div className="page-wrapper">
        <Navbar lang={lang} />
        <main id="main-content" role="main">
          <div className="hero-section">
            <HeroBanner slides={heroSlides} />
            <AskBox lang={lang} />
          </div>

          <section className="main-content-section">
            <div className="nature-bg">
              <Image src={images.backgroundSection} alt="" fill sizes="100vw" quality={60} loading="lazy" className="nature-bg-image" />
              <div className="nature-bg-gradient"></div>
            </div>

            <div className="content-grid">
              <div className="content-column">
                <InfoSection title={t(lang, 'info.title')} subtitle={t(lang, 'info.subtitle')} ctaVariant="secondary" ctaText={t(lang, 'info.cta')} imageUrl={images.infoSection1} ctaHref={`/${lang}/energy/home`} />
                <div className="charger-card">
                  <div className="charger-card-bg">
                    <Image src={images.charger} alt={t(lang, 'charger.title')} fill sizes="(max-width: 1100px) 100vw, 50vw" quality={75} />
                    <div className="charger-overlay"></div>
                  </div>
                  <div className="charger-card-content">
                    <h3 className="charger-title">{t(lang, 'charger.title')}</h3>
                    <p className="charger-subtitle">{t(lang, 'charger.subtitle')}</p>
                    <div className="charger-actions">
                      <a href={`/${lang}/join?profile=host`} className="cta-btn secondary">{t(lang, 'charger.hostBtn')}</a>
                      <a href={`/${lang}/coming-soon`} className="cta-btn secondary">{t(lang, 'charger.downloadBtn')}</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="content-column">
                <InfoSection title={t(lang, 'promo.title')} subtitle={t(lang, 'promo.subtitle')} ctaVariant="primary" ctaText={t(lang, 'shop.order')} imageUrl={images.infoSection2} ctaHref={`/${lang}/join`} />
                <div className="vehicle-card">
                  <h3 className="vehicle-title">{t(lang, 'promo.vehicle')}</h3>
                  <div className="vehicle-image">
                    <Image src={images.vehicle} alt={t(lang, 'promo.vehicle')} width={600} height={400} sizes="(max-width: 1100px) 100vw, 50vw" style={{ width: '100%', height: 'auto' }} />
                  </div>
                  <a href={`/${lang}/coming-soon`} className="cta-btn primary vehicle-order-btn">{t(lang, 'shop.order')}</a>
                </div>
              </div>
            </div>
          </section>

          <section className="latam-wrapper">
            <LATAMSection lang={lang} mapImage={images.latamMap} flags={flags} />
          </section>

          <section className="shop-wrapper">
            <ShopSection lang={lang} products={products} />
          </section>
        </main>

        <Footer lang={lang} backgroundImage={images.footerBg} />
      </div>

      <style>{`
        .hero-section{position:relative;height:100vh;min-height:600px;max-height:1080px}
        .main-content-section{position:relative;padding:60px 0 0}
        .nature-bg{position:absolute;top:0;left:0;right:0;height:70%;pointer-events:none;overflow:hidden}
        .nature-bg-image{object-fit:cover}
        .nature-bg-gradient{position:absolute;inset:0;background:linear-gradient(to bottom,#000 0%,rgba(0,0,0,0.4) 20%,rgba(0,0,0,0.4) 80%,#000 100%)}
        .content-grid{position:relative;z-index:10;display:grid;grid-template-columns:1fr 1fr;gap:clamp(20px,3vw,40px);padding:0 var(--spacing-2xl);max-width:1800px;margin:0 auto}
        .content-column{display:flex;flex-direction:column;gap:clamp(20px,3vw,40px)}
        .charger-card{position:relative;border-radius:10px;overflow:hidden;height:500px;display:flex;flex-direction:column;justify-content:flex-end;padding:40px;border:1px solid var(--color-white-10)}
        .charger-card-bg{position:absolute;inset:0;pointer-events:none}
        .charger-card-bg img{object-fit:cover}
        .charger-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.3) 0%,rgba(0,0,0,0.8) 100%)}
        .charger-card-content{position:relative;z-index:1;display:flex;flex-direction:column;gap:15px}
        .charger-title{font-size:clamp(24px,2.5vw,34px);font-weight:600;text-transform:capitalize;color:var(--color-white)}
        .charger-subtitle{font-size:clamp(16px,1.5vw,20px);font-weight:400;color:var(--color-gray)}
        .charger-actions{display:flex;gap:15px;flex-wrap:wrap;margin-top:10px}
        .vehicle-card{background-color:var(--color-dark-gray);border-radius:10px;padding:40px;display:flex;flex-direction:column}
        .vehicle-title{font-size:clamp(24px,2.5vw,34px);font-weight:600;text-transform:capitalize;color:var(--color-white);margin:0}
        .vehicle-image{flex:1;display:flex;align-items:center;justify-content:center;margin-top:20px}
        .vehicle-image img{max-width:100%;height:auto;object-fit:contain}
        .vehicle-order-btn{margin-top:24px;align-self:flex-start}
        .cta-btn{display:inline-flex;align-items:center;justify-content:center;padding:12px 20px;border-radius:15px;font-size:14px;font-weight:600;text-decoration:none;transition:all var(--transition-fast);border:1px solid var(--color-white-10)}
        .cta-btn.primary{background-color:var(--color-primary);color:var(--color-black)}
        .cta-btn.primary:hover{background-color:#e9a235;transform:translateY(-2px)}
        .cta-btn.secondary{background-color:var(--color-white-10);backdrop-filter:blur(15px);color:var(--color-white)}
        .cta-btn.secondary:hover{background-color:var(--color-white-20);transform:translateY(-2px)}
        .latam-wrapper{padding:100px var(--spacing-2xl)}
        .shop-wrapper{padding:100px var(--spacing-2xl)}
        @media(max-width:1100px){.content-grid{grid-template-columns:1fr;max-width:700px}.nature-bg{height:50%}}
        @media(max-width:768px){.hero-section{height:100svh;max-height:none}.main-content-section{padding:40px 0 0}.content-grid{padding:0 var(--spacing-md)}.charger-card{height:400px;padding:30px}.vehicle-card{padding:30px}.latam-wrapper{padding:50px var(--spacing-md)}.shop-wrapper{padding:50px var(--spacing-md)}}
        @media(max-width:480px){.main-content-section{padding:24px 0 0}.content-grid{padding:0 12px;gap:16px}.charger-card{height:320px;padding:20px}.charger-title{font-size:22px}.charger-subtitle{font-size:14px}.charger-actions{flex-direction:column;gap:8px}.cta-btn{width:100%;text-align:center;padding:12px 16px;font-size:14px}.vehicle-card{padding:20px}.vehicle-title{font-size:22px}.latam-wrapper{padding:32px 12px}.shop-wrapper{padding:32px 12px}}
      `}</style>
    </>
  );
}
