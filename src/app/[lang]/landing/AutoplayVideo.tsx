"use client";

import { useEffect, useRef } from "react";

interface Props {
  src: string;
  poster?: string;
}

export default function AutoplayVideo({ src, poster }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");
    v.setAttribute("x5-playsinline", "");
    v.setAttribute("x5-video-player-type", "h5");
    v.setAttribute("x5-video-player-fullscreen", "false");

    let cancelled = false;
    let attempts = 0;

    const tryPlay = (): Promise<void> => {
      const node = videoRef.current;
      if (cancelled || !node) return Promise.resolve();
      node.muted = true;
      const result = node.play();
      return result instanceof Promise
        ? result.catch((err) => {
            if (cancelled) return;
            if (attempts++ < 8) {
              setTimeout(tryPlay, 250 * Math.min(attempts, 4));
            }
            return Promise.reject(err);
          })
        : Promise.resolve();
    };

    tryPlay().catch(() => {});

    const wake = () => {
      tryPlay().catch(() => {});
    };

    const onMeta = () => wake();
    const onCanPlay = () => wake();
    const onVisibility = () => {
      if (document.visibilityState === "visible") wake();
    };

    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("canplay", onCanPlay);
    document.addEventListener("visibilitychange", onVisibility);

    const userEvents: Array<keyof WindowEventMap> = [
      "touchstart",
      "touchend",
      "touchmove",
      "click",
      "pointerdown",
      "scroll",
      "keydown",
      "mousemove",
    ];
    const onUserEvent = () => {
      wake();
    };
    userEvents.forEach((evt) =>
      window.addEventListener(evt, onUserEvent, { passive: true } as AddEventListenerOptions),
    );

    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const e of entries) if (e.isIntersecting) wake();
        },
        { threshold: 0.05 },
      );
      observer.observe(v);
    }

    return () => {
      cancelled = true;
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("canplay", onCanPlay);
      document.removeEventListener("visibilitychange", onVisibility);
      userEvents.forEach((evt) =>
        window.removeEventListener(evt, onUserEvent as EventListener),
      );
      observer?.disconnect();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className="landing-video"
      autoPlay
      loop
      muted
      playsInline
      controls={false}
      disablePictureInPicture
      disableRemotePlayback
      preload="auto"
      poster={poster}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        minWidth: "100%",
        minHeight: "100%",
        width: "auto",
        height: "auto",
        objectFit: "cover",
        pointerEvents: "none",
        zIndex: 0,
        backgroundColor: "#0A0A0A",
      }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
