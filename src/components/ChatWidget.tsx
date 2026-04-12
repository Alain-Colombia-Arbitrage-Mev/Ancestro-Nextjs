'use client';

export default function ChatWidget({ lang }: { lang: string }) {
  return (
    <iframe
      src={`https://chatbot-control-center-production-de32.up.railway.app/widget?agent=default&lang=${lang}`}
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
