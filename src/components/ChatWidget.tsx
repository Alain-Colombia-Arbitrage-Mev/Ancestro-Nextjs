import Script from 'next/script';

export default function ChatWidget() {
  return (
    <Script
      id="ancestro-chat-widget"
      src="https://chat.ancestro.ai/widget.js"
      strategy="lazyOnload"
      data-server="https://chat.ancestro.ai"
    />
  );
}
