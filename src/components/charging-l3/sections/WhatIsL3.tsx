import { IMG_L3 } from '../constants';

export default function WhatIsL3({ lang }: { lang: string }) {
  const levels = [
    { name: 'Level 1', time: '8-12 Hours', icon: `${IMG_L3}/icon-level1.png` },
    { name: 'Level 2', time: '3-5 Hours', icon: `${IMG_L3}/icon-level2.png` },
    { name: 'Level 3', time: 'Coffee stops or highway break\n~30-40 minutes', icon: `${IMG_L3}/icon-level3.png`, featured: true },
  ];

  return (
    <section className="cl3-what">
      <h2 className="cl3-what-title">What level 3 charging means</h2>
      <div className="cl3-what-grid">
        {levels.map((l) => (
          <div key={l.name} className={`cl3-what-card ${l.featured ? 'cl3-what-featured' : ''}`}>
            <img src={l.icon} alt={l.name} className="cl3-what-icon" />
            <h3 className="cl3-what-name">{l.name}</h3>
            <p className="cl3-what-time">{l.time}</p>
          </div>
        ))}
      </div>
      <div className="cl3-what-footer">
        <p className="cl3-what-note">Level 3 DC Fast Chargers delivers high-power charging for public use where speed, reliability, and throughput matter.</p>
        <p className="cl3-what-disclaimer">Charging times vary by vehicle and battery state.</p>
      </div>
    </section>
  );
}
