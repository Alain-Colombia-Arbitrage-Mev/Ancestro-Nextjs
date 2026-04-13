import { t } from '@/i18n/translations';
import { IMG_BIZ } from '../EnergyBusinessPage';

const plans = [
  {
    key: 'solar',
    img: 'plan-solar-biz.webp',
    icon: '☀️',
    titleKey: 'energyBiz.plan.solar.name',
    subtitleKey: 'energyBiz.plan.solar.subtitle',
    featuresKey: 'energyBiz.plan.solar.features',
    taglineKey: 'energyBiz.plan.solar.tagline',
  },
  {
    key: 'battery',
    img: 'plan-battery-biz.webp',
    icon: '🔋',
    titleKey: 'energyBiz.plan.battery.name',
    subtitleKey: 'energyBiz.plan.battery.subtitle',
    featuresKey: 'energyBiz.plan.battery.features',
    taglineKey: 'energyBiz.plan.battery.tagline',
  },
  {
    key: 'bundle',
    img: 'plan-bundle-biz.webp',
    icon: '⚡',
    titleKey: 'energyBiz.plan.bundle.name',
    subtitleKey: 'energyBiz.plan.bundle.subtitle',
    featuresKey: 'energyBiz.plan.bundle.features',
    taglineKey: 'energyBiz.plan.bundle.tagline',
    featured: true,
  },
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
                <div className="eb-coverage-card-header">
                  <span className="eb-coverage-card-title">{t(lang, p.titleKey)}</span>
                </div>
                <div className="eb-coverage-card-content">
                  <h4 className="eb-coverage-card-subtitle">{t(lang, p.subtitleKey)}</h4>
                  <p className="eb-coverage-card-features">{t(lang, p.featuresKey)}</p>
                </div>
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
