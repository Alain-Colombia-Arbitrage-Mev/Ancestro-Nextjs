'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

import { CDN_URL } from '@/lib/cdn';
const CDN = CDN_URL;

interface Slide {
  type: 'image' | 'video';
  src: string;
  badge: string;
  title: string;
  title2: string;
  ctaLeft: { text: string; href: string };
  ctaRight: { text: string; href: string };
}

interface HeroBannerProps {
  slides: Slide[];
}

function HeroVideo({ src, poster, active }: { src: string; poster: string; active: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!videoRef.current) {
      const video = document.createElement('video');
      video.className = 'hero-bg-media';
      video.style.position = 'absolute';
      video.style.inset = '0';
      video.style.zIndex = '1';
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'none';
      video.poster = poster;
      containerRef.current.appendChild(video);
      videoRef.current = video;
      imgRef.current = containerRef.current.querySelector('img');
    }

    const video = videoRef.current;
    if (active) {
      video.src = src;
      video.play().then(() => {
        if (imgRef.current) imgRef.current.style.display = 'none';
      }).catch(() => {});
    } else {
      video.pause();
      video.removeAttribute('src');
      video.load();
      if (imgRef.current) imgRef.current.style.display = '';
    }
  }, [active, src, poster]);

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0 }}>
      <img className="hero-bg-media" src={poster} alt="" />
    </div>
  );
}

export default function HeroBanner({ slides }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const count = slides.length;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const goTo = useCallback((index: number) => {
    setCurrent(((index % count) + count) % count);
  }, [count]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (count < 2) return;
    timerRef.current = setInterval(next, 7000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [current, count, next]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [next, prev]);

  return (
    <>
      <section className="hero">
        {slides.map((slide, i) => (
          <div key={i} className={`hero-slide${i === current ? ' active' : ''}`}>
            <div className="hero-background">
              {slide.type === 'video' ? (
                <HeroVideo src={slide.src} poster={`${CDN}/1.webp`} active={i === current} />
              ) : (
                <Image src={slide.src} alt="" fill sizes="100vw" priority={i === 0} className="hero-bg-media" />
              )}
              <div className="hero-gradient"></div>
            </div>
            <div className="hero-wrapper">
              <div className="hero-content">
                <div className="hero-text">
                  <p className="hero-subtitle">{slide.badge}</p>
                  <h1 className="hero-title">
                    <span>{slide.title}</span>
                    <span>{slide.title2}</span>
                  </h1>
                </div>
                <div className="hero-actions">
                  <a href={slide.ctaLeft.href} className="cta secondary">{slide.ctaLeft.text}</a>
                  <a href={slide.ctaRight.href} className="cta primary">{slide.ctaRight.text}</a>
                </div>
              </div>
            </div>
          </div>
        ))}

        {count > 1 && (
          <>
            <div className="hero-nav-arrows">
              <button className="nav-arrow" onClick={prev} aria-label="Previous slide">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 6L9 12L15 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button className="nav-arrow" onClick={next} aria-label="Next slide">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 6L15 12L9 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
            <div className="hero-dots">
              {slides.map((_, i) => (
                <span key={i} className={`dot${i === current ? ' active' : ''}`} onClick={() => goTo(i)}></span>
              ))}
            </div>
          </>
        )}
      </section>

      <style>{`
        .hero{position:relative;height:100vh;min-height:600px;max-height:1080px;width:100%;overflow:hidden}
        .hero-slide{position:absolute;inset:0;opacity:0;visibility:hidden;transition:opacity 0.8s ease,visibility 0.8s ease;z-index:0}
        .hero-slide.active{opacity:1;visibility:visible;z-index:1}
        .hero-background{position:absolute;inset:0;pointer-events:none}
        .hero-bg-media{width:100%;height:100%;object-fit:cover;opacity:0.7}
        .hero-gradient{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0) 60.88%,#000 96.11%);z-index:2}
        .hero-wrapper{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:79px 20px 100px;box-sizing:border-box;z-index:3}
        .hero-content{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;width:100%;max-width:600px;text-align:center}
        .hero-slide.active .hero-content{animation:fadeIn 0.8s ease-out forwards}
        .hero-text{display:flex;flex-direction:column;gap:14px;width:100%}
        .hero-subtitle{font-size:clamp(12px,2vw,16px);font-weight:600;letter-spacing:clamp(3px,0.5vw,5px);text-transform:uppercase;color:var(--color-white)}
        .hero-title{font-size:clamp(28px,5vw,50px);font-weight:600;text-transform:capitalize;color:var(--color-white);display:flex;flex-direction:column;line-height:1.2}
        .hero-title span{display:block}
        .hero-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;padding:10px}
        .cta{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:12px 20px;border-radius:15px;border:1px solid var(--color-white-10);font-family:var(--font-family);font-size:16px;font-weight:600;line-height:normal;text-decoration:none;cursor:pointer;transition:all var(--transition-fast)}
        .cta.primary{background-color:var(--color-primary);color:var(--color-black)}
        .cta.primary:hover{background-color:#e9a235;transform:translateY(-2px);box-shadow:0 4px 20px rgba(248,176,59,0.3)}
        .cta.secondary{background-color:var(--color-white-10);backdrop-filter:blur(15px);-webkit-backdrop-filter:blur(15px);color:var(--color-white)}
        .cta.secondary:hover{background-color:var(--color-white-20);transform:translateY(-2px)}
        .hero-nav-arrows{position:absolute;top:50%;left:0;right:0;transform:translateY(-50%);display:flex;justify-content:space-between;padding:0 clamp(15px,3vw,50px);pointer-events:none;z-index:10}
        .nav-arrow{width:clamp(32px,5vw,44px);height:clamp(32px,5vw,44px);display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid var(--color-white-20);border-radius:50%;cursor:pointer;opacity:0.8;transition:all var(--transition-fast);pointer-events:auto}
        .nav-arrow:hover{opacity:1;background:rgba(0,0,0,0.5);transform:scale(1.1)}
        .nav-arrow svg{width:clamp(16px,2.5vw,24px);height:clamp(16px,2.5vw,24px)}
        .hero-dots{position:absolute;bottom:clamp(30px,8vh,93px);left:0;right:0;display:flex;justify-content:center;gap:clamp(8px,1.5vw,12px);z-index:10}
        .dot{width:clamp(8px,1.2vw,12px);height:clamp(8px,1.2vw,12px);border-radius:50%;background-color:rgba(248,176,59,0.4);cursor:pointer;transition:all var(--transition-fast)}
        .dot.active{background-color:var(--color-primary);transform:scale(1.2)}
        .dot:hover{background-color:rgba(248,176,59,0.7)}
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @media(max-width:767px){.hero{min-height:100svh;max-height:none}.hero-wrapper{padding:100px 15px 80px}.hero-title{font-size:clamp(26px,7vw,36px)}.hero-subtitle{font-size:12px;letter-spacing:2px}.hero-actions{flex-direction:column;width:100%;max-width:280px}.hero-actions .cta{width:100%;justify-content:center}.hero-nav-arrows{padding:0 10px}.nav-arrow{width:36px;height:36px}.hero-dots{bottom:25px}.dot{width:10px;height:10px}}
      `}</style>
    </>
  );
}
