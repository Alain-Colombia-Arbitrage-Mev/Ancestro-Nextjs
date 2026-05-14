'use client';
import { useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const COOKIE_NAME = 'ancestro_ref';
const COOKIE_DAYS = 90;

function setRefCookie(code: string) {
  if (typeof document === 'undefined') return;
  const exp = new Date(Date.now() + COOKIE_DAYS * 86400 * 1000).toUTCString();
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(code)}; expires=${exp}; path=/; SameSite=Lax`;
}

export default function ReferralTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (!ref) return;

    setRefCookie(ref);

    // /r/CODE already incremented the click count before redirect, skip dedupe here.
    const viaR = params.get('via') === 'r';
    if (viaR) return;

    const key = `ancestro:ref:${ref}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');

    if (!API_URL) return;
    fetch(`${API_URL}/api/referrals/click`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: ref }),
    }).catch(() => {});
  }, []);

  return null;
}
