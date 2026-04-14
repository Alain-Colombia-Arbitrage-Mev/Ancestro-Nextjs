import { t } from '@/i18n/translations';
import { IMG_L3 } from '../constants';

export default function WhatIsL3({ lang }: { lang: string }) {
  const levels = [
    { nameKey: 'chargingL3.what.level1', timeKey: 'chargingL3.what.level1Time', icon: `${IMG_L3}/icon-level1.png` },
    { nameKey: 'chargingL3.what.level2', timeKey: 'chargingL3.what.level2Time', icon: `${IMG_L3}/icon-level2.png` },
    { nameKey: 'chargingL3.what.level3', timeKey: 'chargingL3.what.level3Time', icon: `${IMG_L3}/icon-level3.png`, featured: true },
  ];

  return (
    <section className="cl3-what">
      <h2 className="cl3-what-title">{t(lang, 'chargingL3.what.title')}</h2>
      <div className="cl3-what-grid">
        {levels.map((l) => (
          <div key={l.nameKey} className={`cl3-what-card ${l.featured ? 'cl3-what-featured' : ''}`}>
            <img src={l.icon} alt={t(lang, l.nameKey)} className="cl3-what-icon" />
            <h3 className="cl3-what-name">{t(lang, l.nameKey)}</h3>
            <p className="cl3-what-time">{t(lang, l.timeKey)}</p>
          </div>
        ))}
      </div>
      <div className="cl3-what-footer">
        <p className="cl3-what-note">{t(lang, 'chargingL3.what.note')}</p>
        <p className="cl3-what-disclaimer">{t(lang, 'chargingL3.what.disclaimer')}</p>
      </div>
    </section>
  );
}
