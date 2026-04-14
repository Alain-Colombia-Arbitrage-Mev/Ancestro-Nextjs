'use client';

import dynamic from 'next/dynamic';

const ComingSoon = dynamic(() => import('./ComingSoon'), { ssr: false });

export default function ComingSoonLoader({ lang }: { lang: string }) {
  return <ComingSoon lang={lang} />;
}
