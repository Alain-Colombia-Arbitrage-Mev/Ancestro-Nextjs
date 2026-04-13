import { t } from '@/i18n/translations';
import { IMG_BIZ } from '../EnergyBusinessPage';

export default function ChooseCoverageBiz({ lang }: { lang: string }) {
  return (
    <section className="eb-coverage">
      <div className="eb-coverage-inner">
        <p className="eb-coverage-sub">{t(lang, 'energyBiz.coverage.title')}</p>
        <div className="eb-coverage-images">
          <div className="eb-coverage-img-wrap">
            <img src={`${IMG_BIZ}/plan-solar-biz.webp`} alt="" className="eb-coverage-img" />
          </div>
          <div className="eb-coverage-img-wrap">
            <img src={`${IMG_BIZ}/plan-battery-biz.webp`} alt="" className="eb-coverage-img" />
          </div>
          <div className="eb-coverage-img-wrap">
            <img src={`${IMG_BIZ}/plan-bundle-biz.webp`} alt="" className="eb-coverage-img" />
          </div>
        </div>
        <div className="eb-coverage-bottom">
          <span className="eb-coverage-cta-label">{t(lang, 'energyBiz.coverage.cta')}</span>
          <p className="eb-coverage-cta-desc">{t(lang, 'energyBiz.coverage.desc')}</p>
        </div>
      </div>
    </section>
  );
}
