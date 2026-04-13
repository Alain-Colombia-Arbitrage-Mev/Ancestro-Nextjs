import { t } from '@/i18n/translations';
import { IMG_BIZ } from '../EnergyBusinessPage';

const plans = [
  { key: 'solar', img: 'strategy-solar.webp' },
  { key: 'battery', img: 'strategy-battery.webp' },
  { key: 'bundle', img: 'strategy-bundle.webp', featured: true },
];

export default function ChooseCoverageBiz({ lang }: { lang: string }) {
  return (
    <section className="eb-strategy">
      <div className="eb-strategy-header">
        <h2 className="eb-strategy-title">{t(lang, 'energyBiz.coverage.heading')}</h2>
        <p className="eb-strategy-sub">{t(lang, 'energyBiz.coverage.title')}</p>
      </div>
      <div className="eb-strategy-grid">
        {plans.map((p) => (
          <div key={p.key} className={`eb-strategy-card ${p.featured ? 'eb-strategy-featured' : ''}`}>
            <div className="eb-strategy-img-wrap">
              <img src={`${IMG_BIZ}/${p.img}`} alt="" className="eb-strategy-img" />
            </div>
            <div className="eb-strategy-body">
              <h3 className="eb-strategy-name">{t(lang, `energyBiz.plan.${p.key}.name`)}</h3>
              <h4 className="eb-strategy-subtitle">{t(lang, `energyBiz.plan.${p.key}.subtitle`)}</h4>
              <p className="eb-strategy-features">{t(lang, `energyBiz.plan.${p.key}.features`)}</p>
              <p className={`eb-strategy-tagline ${p.featured ? 'eb-strategy-tagline-orange' : ''}`}>
                {t(lang, `energyBiz.plan.${p.key}.tagline`)}
              </p>
            </div>
            <div className="eb-strategy-cta-wrap">
              <button type="button" className="eb-strategy-cta">{t(lang, 'energyBiz.coverage.cta')}</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
