'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function NotFound() {
  const params = useParams();
  const router = useRouter();
  const lang = (params?.lang as string) || 'es';

  useEffect(() => {
    router.replace(`/${lang}/coming-soon`);
  }, [lang, router]);

  return (
    <div style={{ background: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#a3a3a3', fontSize: 14 }}>Redirecting...</p>
    </div>
  );
}
