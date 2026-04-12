'use client';
import { useState } from 'react';
import { t } from '@/i18n/translations';
import { IMG } from '../EnergyHomePage';

const slides = [
  { titleKey: 'energyHome.flow.wifi.title', descKey: 'energyHome.flow.wifi.desc', bg: 'slide-wifi.webp' },
  { titleKey: 'energyHome.flow.lights.title', descKey: 'energyHome.flow.lights.desc', bg: 'slide-lights.webp' },
  { titleKey: 'energyHome.flow.fridge.title', descKey: 'energyHome.flow.fridge.desc', bg: 'slide-fridge.webp' },
  { titleKey: 'energyHome.flow.ac.title', descKey: 'energyHome.flow.ac.desc', bg: 'slide-ac.webp' },
];

export default function SolarSlide({ lang }: { lang: string }) {
  const [active, setActive] = useState(0);
  return (
    <section className="eh-slide">
      {slides.map((slide, i) => (
        <img
          key={slide.bg}
          src={`${IMG}/${slide.bg}`}
          alt=""
          className={`eh-slide-bg ${i === active ? 'eh-slide-bg-active' : ''}`}
        />
      ))}
      <div className="eh-slide-overlay" />
      <div className="eh-slide-content">
        <h2 className="eh-slide-heading">{t(lang, 'energyHome.install.title')}</h2>
        <p className="eh-slide-sub">{t(lang, 'energyHome.install.desc')}</p>
        <div className="eh-slide-panel">
          <h3 className="eh-slide-title">{t(lang, slides[active].titleKey)}</h3>
          <p className="eh-slide-desc">{t(lang, slides[active].descKey)}</p>
          <button type="button" className="eh-cta-glass" style={{marginTop:12}}>{t(lang, 'energyHome.flow.cta')}</button>
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
