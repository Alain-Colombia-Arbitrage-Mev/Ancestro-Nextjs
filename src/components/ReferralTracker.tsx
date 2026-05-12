'use client';
import { useEffect } from 'react';

export default function ReferralTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (!ref) return;

    const key = `ancestro:ref:${ref}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');

    fetch('/api/referrals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: ref, action: 'click' }),
    }).catch(() => {});
  }, []);

  return null;
}
