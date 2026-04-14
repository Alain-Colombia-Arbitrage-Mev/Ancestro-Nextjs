'use client';

import dynamic from 'next/dynamic';

const ChargingL3Page = dynamic(() => import('./ChargingL3Page'), { ssr: false });

export default function ChargingL3Loader({ lang }: { lang: string }) {
  return <ChargingL3Page lang={lang} />;
}
