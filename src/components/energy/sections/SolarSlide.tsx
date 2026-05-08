'use client';
import { useState, useEffect, useCallback } from 'react';
import { t } from '@/i18n/translations';
import { imgUrl } from '../cdn';

const slides = [
  { titleKey: 'energyHome.flow.wifi.title', descKey: 'energyHome.flow.wifi.desc', bg: 'slide-wifi.webp' },
  { titleKey: 'energyHome.flow.lights.title', descKey: 'energyHome.flow.lights.desc', bg: 'slide-lights.webp' },
  { titleKey: 'energyHome.flow.fridge.title', descKey: 'energyHome.flow.fridge.desc', bg: 'slide-fridge.webp' },
  { titleKey: 'energyHome.flow.ac.title', descKey: 'energyHome.flow.ac.desc', bg: 'slide-ac.webp' },
];

const AUTOPLAY_MS = 5000;

export default function SolarSlide({ lang }: { lang: string }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, next]);

  function handleDot(i: number) {
    setActive(i);
    setPaused(true);
    setTimeout(() => setPaused(false), 10000);
  }

  return (
    <section className="eh-slide" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {slides.map((slide, i) => (
        <img
          key={slide.bg}
          src={imgUrl(slide.bg)}
          alt=""
          className={`eh-slide-bg ${i === active ? 'eh-slide-bg-active' : ''}`}
        />
      ))}
      <div className="eh-slide-overlay" />
      <div className="eh-slide-content">
        <div className="eh-slide-top">
          <h2 className="eh-slide-heading">{t(lang, 'energyHome.install.title')}</h2>
          <p className="eh-slide-sub">{t(lang, 'energyHome.install.desc')}</p>
        </div>
        <div className="eh-slide-panel">
          <h3 className="eh-slide-title">{t(lang, slides[active].titleKey)}</h3>
          <p className="eh-slide-desc">{t(lang, slides[active].descKey)}</p>
          <a href={`/${lang}/join`} className="eh-cta-glass" style={{marginTop:12,display:'inline-block',textDecoration:'none'}}>{t(lang, 'energyHome.flow.cta')}</a>
        </div>
        <div className="eh-slide-dots">
          {slides.map((_, i) => (
            <button key={i} type="button" className={`eh-dot ${i === active ? 'active' : ''}`} onClick={() => handleDot(i)} />
          ))}
        </div>
      </div>
    </section>
  );
}
