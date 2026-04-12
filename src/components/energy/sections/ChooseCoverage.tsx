import { t } from '@/i18n/translations';
import { IMG } from '../EnergyHomePage';

export default function ChooseCoverage({ lang }: { lang: string }) {
  const plans = [
    { key: 'solar', img: 'plan-solar.webp', fit: 'cover' as const, featured: false },
    { key: 'battery', img: 'battery-product.webp', fit: 'contain' as const, featured: false },
    { key: 'bundle', img: 'plan-bundle.webp', fit: 'cover' as const, featured: true },
  ];

  return (
    <section className="eh-cov">
      <h2 className="eh-cov-title">{t(lang, 'energyHome.plans.title')}</h2>
      <div className="eh-cov-grid">
        {plans.map((p) => (
          <div key={p.key} className={`eh-cov-card${p.featured ? ' eh-cov-featured' : ''}`}>
            <div className="eh-cov-img-wrap">
              <img
                src={`${IMG}/${p.img}`}
                alt=""
                className="eh-cov-img"
                style={{ objectFit: p.fit }}
              />
            </div>
            <div className="eh-cov-body">
              <h3 className="eh-cov-card-title">{t(lang, `energyHome.plans.${p.key}.title`)}</h3>
              <p className="eh-cov-card-desc">{t(lang, `energyHome.plans.${p.key}.desc`)}</p>
              <p className={`eh-cov-tagline${p.featured ? ' eh-cov-tagline-orange' : ''}`}>
                {t(lang, `plan.${p.key}.tagline`)}
              </p>
            </div>
            <button className="eh-cov-cta">{t(lang, 'energyHome.plans.cta')}</button>
          </div>
        ))}
      </div>

      <style>{`
        .eh-cov{padding:80px 24px;max-width:1200px;margin:0 auto}
        .eh-cov-title{font-size:34px;font-weight:500;text-align:center;color:#fff;margin:0 0 50px}
        .eh-cov-grid{display:flex;gap:30px;justify-content:center}
        .eh-cov-card{flex:1;border-radius:20px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.1);padding:10px 10px 30px;display:flex;flex-direction:column;align-items:stretch}
        .eh-cov-featured{border-color:orange}
        .eh-cov-img-wrap{height:257px;border-radius:20px;overflow:hidden}
        .eh-cov-img{width:100%;height:100%;object-fit:cover;border-radius:20px}
        .eh-cov-body{padding:15px 30px;flex:1;display:flex;flex-direction:column}
        .eh-cov-card-title{font-size:22px;font-weight:600;color:#fff;margin:0 0 8px}
        .eh-cov-card-desc{font-size:14px;color:gray;margin:0 0 12px;flex:1}
        .eh-cov-tagline{font-size:12px;font-style:italic;color:#a3a3a3;margin:0}
        .eh-cov-tagline-orange{color:orange}
        .eh-cov-cta{display:block;margin:0 30px;padding:12px 24px;border-radius:30px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#fff;font-size:14px;cursor:pointer;text-align:center;backdrop-filter:blur(10px)}
        .eh-cov-cta:hover{background:rgba(255,255,255,.2)}
        @media(max-width:768px){
          .eh-cov-grid{flex-direction:column}
          .eh-cov-title{font-size:26px}
        }
      `}</style>
    </section>
  );
}
