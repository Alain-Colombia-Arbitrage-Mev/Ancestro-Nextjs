'use client';
import { useEffect, useRef } from 'react';

const WIDGET_URL = 'https://chatbot-control-center-production-de32.up.railway.app/widget?agent=default';

export default function ChatWidget({ lang }: { lang: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function handleOpenChat(e: Event) {
      const question = (e as CustomEvent).detail?.question;
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          { type: 'open-chat', question, lang },
          '*'
        );
      }
    }
    window.addEventListener('open-chat', handleOpenChat);
    return () => window.removeEventListener('open-chat', handleOpenChat);
  }, [lang]);

  return (
    <iframe
      ref={iframeRef}
      src={`${WIDGET_URL}&lang=${lang}`}
      style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        width: '100%',
        height: '100%',
        border: 'none',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
      allow="clipboard-write"
      title="Chat Widget"
    />
  );
}
