import { t } from '@/i18n/translations';
import { IMG } from '../EnergyBusinessPage';

const plans = [
  { key: 'solar', img: 'plan-solar-v2.webp' },
  { key: 'battery', img: 'shop-battery-v2.webp' },
  { key: 'bundle', img: 'plan-bundle.webp' },
];

export default function ChooseCoverageBiz({ lang }: { lang: string }) {
  return (
    <section className="eb-coverage">
      <div className="eb-coverage-inner">
        <h2 className="eb-coverage-title">{t(lang, 'energyBiz.coverage.title')}</h2>
        <div className="eb-coverage-grid">
          {plans.map((p) => (
            <div key={p.key} className="eb-coverage-card">
              <img
                src={`${IMG}/${p.img}`}
                alt=""
                className="eb-coverage-img"
              />
            </div>
          ))}
        </div>
        <div className="eb-coverage-cta-wrap">
          <span className="eb-coverage-cta-text">{t(lang, 'energyBiz.coverage.cta')}</span>
        </div>
      </div>
    </section>
  );
}
