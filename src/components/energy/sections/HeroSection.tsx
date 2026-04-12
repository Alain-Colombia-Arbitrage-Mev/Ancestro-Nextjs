import { t } from '@/i18n/translations';
import { IMG } from '../EnergyHomePage';

export default function HeroSection({ lang }: { lang: string }) {
  return (
    <section className="eh-hero">
      <div className="eh-hero-bg">
        <video
          className="eh-hero-video"
          src={`${IMG}/hero-video.mp4`}
          autoPlay muted loop playsInline
          preload="metadata"
          poster={`${IMG}/hero-bg.webp`}
          aria-hidden="true"
        />
        <div className="eh-hero-gradient" />
      </div>
      <div className="eh-hero-content">
        <h1 className="eh-hero-title">{t(lang, 'energyHome.hero.title')}</h1>
        <p className="eh-hero-sub">{t(lang, 'energyHome.hero.subtitle')}</p>
      </div>
      <div className="eh-hero-cta-wrap">
        <button type="button" className="eh-cta-glass">{t(lang, 'energyHome.hero.cta')}</button>
      </div>

      <style>{`
        .eh-hero{position:relative;width:100%;height:100vh;min-height:720px;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden}
        .eh-hero-bg{position:absolute;inset:0}
        .eh-hero-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;display:block}
        .eh-hero-gradient{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.5) 0%,transparent 40%,rgba(0,0,0,.85) 100%)}
        .eh-hero-content{position:relative;z-index:1;text-align:center;padding:0 40px;margin-top:-60px}
        .eh-hero-title{font-size:50px;font-weight:600;line-height:1.05;color:#fff;margin:0;text-shadow:0 2px 20px rgba(0,0,0,.5);max-width:650px}
        .eh-hero-sub{font-size:20px;font-weight:600;color:#fff;margin:16px 0 0;text-shadow:0 2px 12px rgba(0,0,0,.5);max-width:650px}
        .eh-hero-cta-wrap{position:absolute;bottom:100px;z-index:1}
        .eh-cta-glass{padding:14px 30px;min-height:44px;background:rgba(255,255,255,.1);backdrop-filter:blur(26px);-webkit-backdrop-filter:blur(26px);border:1px solid rgba(255,255,255,.15);border-radius:15px;color:#fff;font-family:inherit;font-size:16px;font-weight:600;cursor:pointer;transition:all .3s ease}
        .eh-cta-glass:hover{background:rgba(248,176,59,.2);border-color:rgba(248,176,59,.5)}
        @media(max-width:1024px){
          .eh-hero-title{font-size:40px}
          .eh-hero-sub{font-size:18px}
          .eh-hero-cta-wrap{bottom:80px}
        }
        @media(max-width:768px){
          .eh-hero{min-height:600px}
          .eh-hero-content{padding:0 40px}
          .eh-hero-title{font-size:32px}
          .eh-hero-sub{font-size:16px}
          .eh-hero-cta-wrap{bottom:60px}
        }
        @media(max-width:480px){
          .eh-hero-content{padding:0 24px}
          .eh-hero-title{font-size:32px}
          .eh-hero-sub{font-size:16px}
          .eh-hero-cta-wrap{bottom:60px}
        }
      `}</style>
    </section>
  );
}
