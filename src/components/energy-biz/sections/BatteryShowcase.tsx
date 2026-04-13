import { t } from '@/i18n/translations';
import { IMG_BIZ } from '../EnergyBusinessPage';

const features = [
  { key: 'energyBiz.battery.feat1', first: true },
  { key: 'energyBiz.battery.feat2', first: false },
  { key: 'energyBiz.battery.feat3', first: false },
  { key: 'energyBiz.battery.feat4', first: false },
];

export default function BatteryShowcase({ lang }: { lang: string }) {
  return (
    <section className="eb-battery">
      <div className="eb-battery-inner">
        <h2 className="eb-battery-title">{t(lang, 'energyBiz.battery.title')}</h2>
        <p className="eb-battery-desc">{t(lang, 'energyBiz.battery.desc')}</p>
        <div className="eb-battery-img-wrap">
          <img
            src={`${IMG_BIZ}/battery-tabs.webp`}
            alt=""
            className="eb-battery-img"
          />
        </div>
        <div className="eb-battery-feats">
          {features.map((f, i) => (
            <div key={i} className={`eb-battery-feat${f.first ? ' eb-battery-feat-active' : ''}`}>
              <span className="eb-battery-feat-title">{t(lang, f.key)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
