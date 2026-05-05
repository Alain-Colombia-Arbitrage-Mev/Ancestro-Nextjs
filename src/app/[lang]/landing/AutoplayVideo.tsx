"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  poster?: string;
}

export default function AutoplayVideo({ src, poster }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [needsTap, setNeedsTap] = useState(false);

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

    const tryPlay = async () => {
      if (cancelled || !videoRef.current) return;
      try {
        await videoRef.current.play();
        setNeedsTap(false);
      } catch {
        if (!cancelled) setNeedsTap(true);
      }
    };

    tryPlay();

    const onVisibility = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    const onFirstInteraction = () => {
      tryPlay();
      window.removeEventListener("touchstart", onFirstInteraction);
      window.removeEventListener("click", onFirstInteraction);
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("touchstart", onFirstInteraction, { passive: true });
    window.addEventListener("click", onFirstInteraction);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("touchstart", onFirstInteraction);
      window.removeEventListener("click", onFirstInteraction);
    };
  }, []);

  return (
    <>
      <video
        ref={videoRef}
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

      {needsTap && (
        <button
          type="button"
          aria-label="Tocar para reproduzir vídeo"
          onClick={() => {
            videoRef.current?.play().then(() => setNeedsTap(false)).catch(() => {});
          }}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 5,
            background: "transparent",
            border: 0,
            cursor: "pointer",
            color: "transparent",
          }}
        >
          tocar para reproduzir
        </button>
      )}
    </>
  );
}
