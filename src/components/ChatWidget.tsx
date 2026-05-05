'use client';

import { useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Script from 'next/script';

function WidgetLangSync() {
  const params = useParams();
  const locale = params.lang as string;

  useEffect(() => {
    const w = window as unknown as { AncestroWidget?: { setLang: (lang: string) => void } };
    if (w.AncestroWidget) {
      w.AncestroWidget.setLang(locale);
    }
  }, [locale]);

  return null;
}

export default function ChatWidget({ lang }: { lang: string }) {
  const pathname = usePathname() ?? '';
  if (/\/landing(\/|$)/.test(pathname)) return null;
  return (
    <>
      <WidgetLangSync />
      <Script
        id="ancestro-chat-widget"
        src="https://chat.ancestro.ai/widget.js"
        strategy="lazyOnload"
        data-server="https://chat.ancestro.ai"
        data-agent="default"
        data-lang={lang}
      />
    </>
  );
}
