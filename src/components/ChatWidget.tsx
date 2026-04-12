import Script from 'next/script';

export default function ChatWidget({ lang }: { lang: string }) {
  return (
    <Script
      id="ancestro-chat-widget"
      src="https://chat.ancestro.ai/widget.js"
      strategy="lazyOnload"
      data-server="https://chat.ancestro.ai"
      data-agent="default"
      data-color="#2d92dc"
      data-accent="#1a1a2e"
      data-title="Chat with us"
      data-position="right"
      data-placeholder="hello"
      data-button="What can I help you with?"
      data-lang={lang}
    />
  );
}
