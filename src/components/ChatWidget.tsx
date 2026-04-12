'use client';
import { useEffect } from 'react';

export default function ChatWidget({ lang }: { lang: string }) {
  useEffect(() => {
    if (document.getElementById('ancestro-chat-widget')) return;

    const script = document.createElement('script');
    script.id = 'ancestro-chat-widget';
    script.src = 'https://chat.ancestro.ai/widget.js';
    script.defer = true;
    script.setAttribute('data-server', 'https://chat.ancestro.ai');
    script.setAttribute('data-agent', 'default');
    script.setAttribute('data-color', '#2d92dc');
    script.setAttribute('data-accent', '#1a1a2e');
    script.setAttribute('data-title', 'Chat with us');
    script.setAttribute('data-position', 'right');
    script.setAttribute('data-placeholder', 'hello');
    script.setAttribute('data-button', 'What can I help you with?');
    script.setAttribute('data-lang', lang);
    document.body.appendChild(script);

    return () => {
      const el = document.getElementById('ancestro-chat-widget');
      if (el) el.remove();
    };
  }, [lang]);

  return null;
}
