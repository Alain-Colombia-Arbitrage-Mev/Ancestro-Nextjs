import { t } from '@/i18n/translations';
import { IMG, FLAGS } from '../EnergyHomePage';

const FLAG_COUNTRIES = [
  'colombia', 'panama', 'dominican-republic', 'mexico', 'peru',
  'guatemala', 'el-salvador', 'uruguay', 'costa-rica', 'brazil',
  'nicaragua', 'honduras', 'chile', 'argentina', 'bolivia',
  'belize', 'ecuador', 'paraguay',
];

const STATS = [
  { icon: 'icon-pin.webp', num: '18+', labelKey: 'energyHome.latam.countries' },
  { icon: 'icon-solar.webp', num: '25,000+', labelKey: 'energyHome.latam.installations' },
  { icon: 'icon-helmet.webp', num: '500+', labelKey: 'energyHome.latam.installers' },
];

export default function LatamMap({ lang }: { lang: string }) {
  return (
    <section className="eh-latam">
      <img src={`${IMG}/latam-map-full.webp`} alt="" className="eh-latam-bg" />

      <div className="eh-latam-header">
        <h2 className="eh-latam-title">{t(lang, 'energyHome.latam.title')}</h2>
        <p className="eh-latam-desc">{t(lang, 'energyHome.latam.desc')}</p>
        <div className="eh-latam-flags">
          {FLAG_COUNTRIES.map((c) => (
            <img key={c} src={`${FLAGS}/${c}.png`} alt={c} className="eh-latam-flag" />
          ))}
        </div>
      </div>

      <div className="eh-latam-stats">
        {STATS.map((s) => (
          <div key={s.num} className="eh-latam-stat">
            <img src={`${IMG}/${s.icon}`} alt="" className="eh-latam-stat-icon" />
            <div className="eh-latam-stat-info">
              <span className="eh-latam-stat-num">{s.num}</span>
              <span className="eh-latam-stat-label">{t(lang, s.labelKey)}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
