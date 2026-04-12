'use client';
import { useState } from 'react';
import { t } from '@/i18n/translations';
import { IMG } from '../EnergyHomePage';

const slides = [
  { titleKey: 'energyHome.flow.wifi.title', descKey: 'energyHome.flow.wifi.desc' },
  { titleKey: 'energyHome.flow.use.title', descKey: 'energyHome.flow.use.desc' },
  { titleKey: 'energyHome.flow.store.title', descKey: 'energyHome.flow.store.desc' },
  { titleKey: 'energyHome.flow.charge.title', descKey: 'energyHome.flow.charge.desc' },
];

export default function SolarSlide({ lang }: { lang: string }) {
  const [active, setActive] = useState(0);
  return (
    <section className="eh-slide">
      <img src={`${IMG}/night-house-bg.webp`} alt="" className="eh-slide-bg" />
      <div className="eh-slide-overlay" />
      <div className="eh-slide-content">
        <h2 className="eh-slide-heading">{t(lang, 'energyHome.install.title')}</h2>
        <p className="eh-slide-sub">{t(lang, 'energyHome.install.desc')}</p>
        <div className="eh-slide-panel">
          <h3 className="eh-slide-title">{t(lang, slides[active].titleKey)}</h3>
          <p className="eh-slide-desc">{t(lang, slides[active].descKey)}</p>
          <button type="button" className="eh-cta-glass" style={{marginTop:16}}>{t(lang, 'energyHome.flow.cta')}</button>
        </div>
        <div className="eh-slide-dots">
          {slides.map((_, i) => (
            <button key={i} type="button" className={`eh-dot ${i === active ? 'active' : ''}`} onClick={() => setActive(i)} />
          ))}
        </div>
      </div>
    </section>
  );
}
