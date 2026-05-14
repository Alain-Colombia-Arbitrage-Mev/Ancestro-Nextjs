'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { handleOAuthCallback } from '@/lib/auth';

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = params.get('code');
    const errParam = params.get('error');
    if (errParam) {
      setError(errParam);
      return;
    }
    if (!code) {
      setError('Missing authorization code');
      return;
    }
    const redirectUri = `${window.location.origin}/auth/callback`;
    handleOAuthCallback(code, redirectUri)
      .then((r) => {
        if (r?.signedIn) {
          // store user/internalToken via auth-context's setUser/setToken on next mount via checkSession
          if (typeof window !== 'undefined') {
            localStorage.setItem('ancestro:user', JSON.stringify({
              id: r.user.id,
              cognitoId: r.user.cognito_id,
              email: r.user.email,
              name: r.user.full_name || r.user.email.split('@')[0],
              phone: r.user.phone || undefined,
              role: r.user.role,
              isVerified: true,
              createdAt: r.user.created_at || new Date().toISOString(),
            }));
            localStorage.setItem('ancestro:token', r.internalToken);
          }
          router.replace('/es/dashboard');
        } else {
          setError('Login failed');
        }
      })
      .catch((e) => setError(e.message || 'Login failed'));
  }, [params, router]);

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5F3FF' }}>
      {error ? `Error: ${error}` : 'Signing you in…'}
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={null}>
      <CallbackInner />
    </Suspense>
  );
}
