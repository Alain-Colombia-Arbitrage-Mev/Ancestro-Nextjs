'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootNotFound() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/es/coming-soon');
  }, [router]);

  return (
    <div style={{ background: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#a3a3a3', fontSize: 14 }}>Redirecting...</p>
    </div>
  );
}
