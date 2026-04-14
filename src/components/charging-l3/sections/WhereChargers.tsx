'use client';

import { useState, useEffect, useCallback } from 'react';
import { t } from '@/i18n/translations';
import { IMG_L3 } from '../constants';

const slideKeys = [
  { titleKey: 'chargingL3.where.slide1Title', descKey: 'chargingL3.where.slide1Desc' },
  { titleKey: 'chargingL3.where.slide2Title', descKey: 'chargingL3.where.slide2Desc' },
  { titleKey: 'chargingL3.where.slide3Title', descKey: 'chargingL3.where.slide3Desc' },
  { titleKey: 'chargingL3.where.slide4Title', descKey: 'chargingL3.where.slide4Desc' },
];

const sectionStyle: React.CSSProperties = {
  position: 'relative',
  zIndex: 1,
  isolation: 'isolate',
  width: '100%',
  height: '100vh',
  minHeight: 700,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  overflow: 'hidden',
};

export default function WhereChargers({ lang }: { lang: string }) {
  const [active, setActive] = useState(0);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % slideKeys.length);
  }, []);

  useEffect(() => {
    const iv = setInterval(next, 5000);
    return () => clearInterval(iv);
  }, [next]);

  const current = slideKeys[active];
  const bgUrl = `${IMG_L3}/where-bg.webp`;

  return (
    <section
      className="cl3-where"
      style={{
        ...sectionStyle,
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.6) 0%, rgba(0,0,0,.2) 40%, rgba(0,0,0,.85) 100%), url(${bgUrl})`,
      }}
    >
      <h2 style={{ fontSize: 30, fontWeight: 600, color: '#fff', textAlign: 'center', padding: '100px 32px 0', margin: 0, textShadow: '0 2px 16px rgba(0,0,0,.7)' }}>
        {t(lang, 'chargingL3.where.heading')}
      </h2>

      <div style={{ textAlign: 'center', padding: '0 32px 60px', maxWidth: 800, margin: '0 auto' }}>
        <h3 style={{ fontSize: 30, fontWeight: 500, color: '#fff', margin: '0 0 16px', textShadow: '0 2px 12px rgba(0,0,0,.6)' }}>
          {t(lang, current.titleKey)}
        </h3>
        <p style={{ fontSize: 15, color: '#fff', margin: '0 0 8px', lineHeight: 1.4, textShadow: '0 2px 10px rgba(0,0,0,.6)' }}>
          {t(lang, current.descKey)}
        </p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', fontStyle: 'italic', margin: '0 0 20px', lineHeight: 1.5 }}>
          {t(lang, 'chargingL3.where.note')}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          {slideKeys.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: 10, height: 10, borderRadius: '50%', border: 'none',
                background: i === active ? '#f8b03b' : 'rgba(255,255,255,.3)',
                cursor: 'pointer', padding: 0,
                boxShadow: i === active ? '0 0 8px rgba(248,176,59,.5)' : 'none',
                transition: 'all .3s ease',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
