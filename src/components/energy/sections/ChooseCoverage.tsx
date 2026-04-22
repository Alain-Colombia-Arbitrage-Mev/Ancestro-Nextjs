import { t } from '@/i18n/translations';
import { imgUrl } from '../cdn';

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
                src={imgUrl(p.img)}
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
            <a href={`/${lang}/join`} className="eh-cov-cta" style={{display:'block',textAlign:'center',textDecoration:'none'}}>{t(lang, 'energyHome.plans.cta')}</a>
          </div>
        ))}
      </div>
    </section>
  );
}
