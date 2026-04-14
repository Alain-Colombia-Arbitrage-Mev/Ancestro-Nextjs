import Image from 'next/image';
import { t } from '@/i18n/translations';

interface FlagData { country: string; imageUrl: string; }
interface LATAMSectionProps { lang: string; mapImage: string; flags: FlagData[]; }

export default function LATAMSection({ lang, mapImage, flags }: LATAMSectionProps) {
  return (
    <>
      <section className="latam-section">
        <div className="latam-grid">
          <div className="latam-left">
            <div className="latam-content">
              <h2 className="latam-title">{t(lang, 'latam.title')} {t(lang, 'latam.title2')}</h2>
              <p className="latam-subtitle">{t(lang, 'latam.subtitle')}</p>
              <div className="flags-grid">
                {flags.map((flag) => (
                  <div key={flag.country} className="flag" title={flag.country}>
                    <Image src={flag.imageUrl} alt={`${flag.country} flag`} width={90} height={60} sizes="90px" loading="lazy" />
                  </div>
                ))}
              </div>
              <a href={`/${lang}/join`} className="latam-cta-button">{t(lang, 'hero.cta')}</a>
            </div>
          </div>
          <div className="latam-right">
            <img src={mapImage} alt="LATAM coverage map" className="map-image" loading="lazy" />
          </div>
        </div>
      </section>

      <style>{`
        .latam-section{padding:50px;border:1px solid rgba(255,255,255,0.1);border-radius:10px;max-width:1797px;margin:0 auto;background-color:rgba(20,20,20,0.5)}
        .latam-grid{display:grid;grid-template-columns:minmax(0,1fr) 500px;align-items:center;column-gap:40px}
        .latam-left{min-width:0}
        .latam-right{display:flex;align-items:center;justify-content:center;min-height:100%}
        .latam-content{display:flex;flex-direction:column;gap:40px}
        .latam-title{font-size:clamp(36px,4vw,65px);font-weight:600;text-transform:capitalize;color:#fff;line-height:1.1;margin:0}
        .latam-subtitle{font-size:clamp(14px,1.2vw,20px);font-weight:400;color:#a3a3a3;margin:0}
        .flags-grid{display:flex;flex-wrap:wrap;gap:20px;max-width:700px}
        .flag{width:90px;height:60px;border-radius:8px;overflow:hidden;flex-shrink:0;transition:transform var(--transition-fast)}
        .flag:hover{transform:scale(1.05)}
        .flag img{width:100%;height:100%;object-fit:cover}
        .latam-cta-button{display:inline-flex;align-items:center;justify-content:center;padding:12px 24px;background-color:#f8b03b;color:#000;font-size:16px;font-weight:600;text-decoration:none;border-radius:15px;border:1px solid rgba(255,255,255,0.1);width:fit-content;transition:all 0.2s ease}
        .latam-cta-button:hover{background-color:#e9a235;transform:translateY(-2px)}
        .map-image{width:500px;height:auto;display:block;filter:drop-shadow(0 0 80px rgba(248,176,59,0.5))}
        @media(max-width:1500px){.latam-grid{grid-template-columns:minmax(0,1fr) 450px}.map-image{width:450px;height:auto}}
        @media(max-width:1300px){.latam-grid{grid-template-columns:minmax(0,1fr) 380px}.map-image{width:380px;height:auto}.latam-content{gap:30px}.flags-grid{gap:15px}.flag{width:70px;height:47px}}
        @media(max-width:1100px){.latam-section{padding:40px}.latam-grid{grid-template-columns:minmax(0,1fr) 320px;column-gap:30px}.map-image{width:320px;height:auto}.flag{width:60px;height:40px}}
        @media(max-width:900px){.latam-grid{grid-template-columns:1fr;row-gap:40px;column-gap:0}.latam-left{text-align:center}.latam-right{justify-content:center}.latam-content{align-items:center}.flags-grid{justify-content:center;max-width:100%}.map-image{width:350px;height:auto;margin:0 auto}}
        @media(max-width:600px){.latam-section{padding:30px 20px}.latam-content{gap:25px}.flags-grid{gap:10px}.flag{width:50px;height:34px;border-radius:5px}.map-image{width:280px;height:auto}}
      `}</style>
    </>
  );
}
