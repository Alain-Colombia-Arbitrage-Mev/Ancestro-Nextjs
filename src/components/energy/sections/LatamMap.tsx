import { t } from '@/i18n/translations';
import { IMG, FLAGS } from '../EnergyHomePage';

const FLAG_COUNTRIES = [
  'colombia', 'panama', 'dominican-republic', 'mexico', 'peru',
  'guatemala', 'el-salvador', 'uruguay', 'costa-rica', 'brazil',
  'nicaragua', 'honduras', 'chile', 'argentina', 'bolivia',
  'belize', 'ecuador', 'paraguay',
];

const STATS = [
  { icon: 'icon-pin.webp', key: 'countries' },
  { icon: 'icon-solar.webp', key: 'installations' },
  { icon: 'icon-helmet.webp', key: 'installers' },
];

export default function LatamMap({ lang }: { lang: string }) {
  return (
    <section className="eh-latam">
      <img src={`${IMG}/latam-map-full.webp`} alt="" className="eh-latam-bg" />
      <div className="eh-latam-content">
        <div className="eh-latam-top">
          <h2 className="eh-latam-title">{t(lang, 'energyHome.latam.title')}</h2>
          <p className="eh-latam-desc">{t(lang, 'energyHome.latam.desc')}</p>
          <div className="eh-latam-flags">
            {FLAG_COUNTRIES.map((c) => (
              <img
                key={c}
                src={`${FLAGS}/${c}.png`}
                alt={c}
                className="eh-latam-flag"
              />
            ))}
          </div>
        </div>

        <div className="eh-latam-stats">
          {STATS.map((s) => (
            <div key={s.key} className="eh-latam-stat">
              <img src={`${IMG}/${s.icon}`} alt="" className="eh-latam-stat-icon" />
              <span className="eh-latam-stat-num">{t(lang, `energyHome.latam.${s.key}`)}</span>
              <span className="eh-latam-stat-label">{t(lang, `energyHome.latam.${s.key}`)}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .eh-latam{position:relative;width:100%;min-height:961px;display:flex;overflow:hidden}
        .eh-latam-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;display:block}
        .eh-latam-content{position:relative;z-index:1;width:100%;max-width:1148px;margin:0 auto;padding:100px 40px;display:flex;flex-direction:column;justify-content:space-between;min-height:961px}
        .eh-latam-top{text-align:center}
        .eh-latam-title{font-size:34px;font-weight:500;color:#fff;margin:0 0 12px}
        .eh-latam-desc{font-size:18px;color:#a3a3a3;margin:0 0 30px;max-width:650px;margin-left:auto;margin-right:auto}
        .eh-latam-flags{display:flex;flex-wrap:wrap;justify-content:center;gap:21px;max-width:700px;margin:0 auto}
        .eh-latam-flag{width:40px;height:27px;border-radius:6px;object-fit:cover;display:block}
        .eh-latam-stats{display:flex;gap:30px}
        .eh-latam-stat{flex:1 1 0;border-radius:12px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);padding:50px;display:flex;flex-direction:column;align-items:center;gap:12px;transition:all .3s ease;cursor:pointer}
        .eh-latam-stat:hover{border-color:rgba(248,176,59,.4);transform:translateY(-2px)}
        .eh-latam-stat-icon{height:74px;object-fit:contain;display:block}
        .eh-latam-stat-num{font-size:40px;font-weight:600;color:#fff}
        .eh-latam-stat-label{font-size:14px;color:#a3a3a3}
        @media(max-width:1024px){
          .eh-latam{min-height:auto}
          .eh-latam-content{min-height:auto;gap:40px;padding:80px 40px}
          .eh-latam-stats{gap:20px}
          .eh-latam-stat{padding:30px}
          .eh-latam-title{font-size:28px}
          .eh-latam-stat-num{font-size:32px}
        }
        @media(max-width:768px){
          .eh-latam-content{padding:60px 40px}
          .eh-latam-title{font-size:24px}
          .eh-latam-desc{font-size:16px}
          .eh-latam-stat{padding:24px}
          .eh-latam-stat-num{font-size:28px}
          .eh-latam-stat-icon{height:50px}
        }
        @media(max-width:480px){
          .eh-latam-content{padding:60px 24px}
          .eh-latam-stats{flex-direction:column;gap:16px}
          .eh-latam-stat{padding:24px}
          .eh-latam-title{font-size:24px}
        }
      `}</style>
    </section>
  );
}
