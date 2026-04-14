'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { CDN_URL } from '@/lib/cdn';
import { t } from '@/i18n/translations';
import './coming-soon.css';

// Fixed target: July 13, 2026
const TARGET_DATE = new Date('2026-07-13T00:00:00').getTime();

function getTimeLeft() {
  const diff = Math.max(0, TARGET_DATE - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function ComingSoon({ lang }: { lang: string }) {
  const [ready, setReady] = useState(false);
  const [entered, setEntered] = useState(false);
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setReady(true);
    setTime(getTimeLeft());
    const iv = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(iv);
  }, []);

  const handleEnter = useCallback(() => {
    setEntered(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => setAudioPlaying(true)).catch(() => {});
    }
  }, []);

  const toggleAudio = useCallback(() => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().then(() => setAudioPlaying(true));
    } else {
      audioRef.current.pause();
      setAudioPlaying(false);
    }
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  const bgUrl = `${CDN_URL}/coming-soon/bg.png`;

  return (
    <section
      className="cs-section"
      style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.65), rgba(0,0,0,.75)), url(${bgUrl})` }}
    >
      {/* Splash gate - client only */}
      {!entered && (
        <div
          className="cs-splash"
          onClick={handleEnter}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleEnter()}
        >
          <div className="cs-splash-inner">
            <img src={`${CDN_URL}/logo.svg`} alt="Ancestro" className="cs-splash-logo" />
            <div className="cs-splash-ring">
              <svg viewBox="0 0 24 24" fill="none" className="cs-splash-play-icon">
                <polygon points="6,3 20,12 6,21" fill="currentColor" />
              </svg>
            </div>
            <p className="cs-splash-text">{t(lang, 'comingSoon.splash')}</p>
          </div>
        </div>
      )}

      {/* Particles */}
      <div className="cs-particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} className="cs-particle" style={{
            left: `${(i * 5.26) % 100}%`,
            animationDelay: `${(i * 0.7) % 6}s`,
            animationDuration: `${4 + (i % 4) * 2}s`,
          }} />
        ))}
      </div>

      {/* Main content */}
      <div className={entered ? 'cs-content cs-content-visible' : 'cs-content'}>
        <div className="cs-logo-wrap">
          <img src={`${CDN_URL}/logo.svg`} alt="Ancestro" className="cs-logo" />
        </div>

        <h1 className="cs-title">{t(lang, 'comingSoon.title')}</h1>
        <p className="cs-subtitle">{t(lang, 'comingSoon.subtitle')}</p>

        <div className="cs-countdown">
          <div className="cs-time-block">
            <span className="cs-time-number">{ready ? pad(time.days) : '--'}</span>
            <span className="cs-time-label">{t(lang, 'comingSoon.days')}</span>
          </div>
          <span className="cs-time-sep">:</span>
          <div className="cs-time-block">
            <span className="cs-time-number">{ready ? pad(time.hours) : '--'}</span>
            <span className="cs-time-label">{t(lang, 'comingSoon.hours')}</span>
          </div>
          <span className="cs-time-sep">:</span>
          <div className="cs-time-block">
            <span className="cs-time-number">{ready ? pad(time.minutes) : '--'}</span>
            <span className="cs-time-label">{t(lang, 'comingSoon.minutes')}</span>
          </div>
          <span className="cs-time-sep">:</span>
          <div className="cs-time-block">
            <span className="cs-time-number">{ready ? pad(time.seconds) : '--'}</span>
            <span className="cs-time-label">{t(lang, 'comingSoon.seconds')}</span>
          </div>
        </div>

        <button type="button" className="cs-audio-btn" onClick={toggleAudio} aria-label="Play">
          <svg className="cs-audio-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {audioPlaying ? (
              <>
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </>
            ) : (
              <polygon points="5,3 19,12 5,21" fill="currentColor" />
            )}
          </svg>
        </button>

        <a href={`/${lang}/join`} className="cs-cta">{t(lang, 'comingSoon.cta')}</a>
      </div>

      <audio ref={audioRef} src={`${CDN_URL}/coming-soon/announcement.mpeg`} preload="auto" playsInline />
    </section>
  );
}
