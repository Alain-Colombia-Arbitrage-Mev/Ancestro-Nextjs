import { t } from '@/i18n/translations';
import { IMG_BIZ } from '../EnergyBusinessPage';

const plans = [
  { key: 'solar', img: 'plan-solar-biz.webp', taglineKey: 'energyBiz.plan.solar.tagline' },
  { key: 'battery', img: 'plan-battery-biz.webp', taglineKey: 'energyBiz.plan.battery.tagline' },
  { key: 'bundle', img: 'plan-bundle-biz.webp', taglineKey: 'energyBiz.plan.bundle.tagline', featured: true },
];

export default function ChooseCoverageBiz({ lang }: { lang: string }) {
  return (
    <section className="eb-coverage">
      <div className="eb-coverage-inner">
        <div className="eb-coverage-header">
          <h2 className="eb-coverage-title">{t(lang, 'energyBiz.coverage.heading')}</h2>
          <p className="eb-coverage-sub">{t(lang, 'energyBiz.coverage.title')}</p>
        </div>
        <div className="eb-coverage-grid">
          {plans.map((p) => (
            <div key={p.key} className={`eb-coverage-card ${p.featured ? 'eb-coverage-featured' : ''}`}>
              <div className="eb-coverage-img-wrap">
                <img src={`${IMG_BIZ}/${p.img}`} alt="" className="eb-coverage-img" />
              </div>
              <div className="eb-coverage-body">
                <h3 className="eb-coverage-card-title">{t(lang, `energyBiz.plan.${p.key}.title`)}</h3>
                <p className="eb-coverage-card-desc">{t(lang, `energyBiz.plan.${p.key}.desc`)}</p>
                <p className={`eb-coverage-tagline ${p.featured ? 'eb-coverage-tagline-orange' : ''}`}>{t(lang, p.taglineKey)}</p>
              </div>
              <button type="button" className="eb-coverage-card-cta">{t(lang, 'energyBiz.coverage.cta')}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
