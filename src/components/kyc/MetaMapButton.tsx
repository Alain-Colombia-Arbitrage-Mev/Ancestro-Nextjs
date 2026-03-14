'use client';

import { useEffect, useRef } from 'react';

const METAMAP_CLIENT_ID = process.env.NEXT_PUBLIC_METAMAP_CLIENT_ID || '69aae9199ba166886f37fad6';
const METAMAP_FLOW_ID = process.env.NEXT_PUBLIC_METAMAP_FLOW_ID || '69aae9199ba166886f37fad4';
const SCRIPT_SRC = 'https://web-button.metamap.com/button.js';

interface MetaMapButtonProps {
  userId: string;
  userEmail: string;
  onStarted?: () => void;
  onFinished?: () => void;
  onExited?: () => void;
}

declare global {
  interface WindowEventMap {
    'mati:userFinishedSdk': CustomEvent;
    'mati:exitedSdk': CustomEvent;
  }
}

export default function MetaMapButton({ userId, userEmail, onStarted, onFinished, onExited }: MetaMapButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;
    if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      scriptLoaded.current = true;
      return;
    }
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    document.head.appendChild(script);
    scriptLoaded.current = true;
  }, []);

  useEffect(() => {
    function handleFinished() { onFinished?.(); }
    function handleExited() { onExited?.(); }
    window.addEventListener('mati:userFinishedSdk', handleFinished);
    window.addEventListener('mati:exitedSdk', handleExited);
    return () => {
      window.removeEventListener('mati:userFinishedSdk', handleFinished);
      window.removeEventListener('mati:exitedSdk', handleExited);
    };
  }, [onFinished, onExited]);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = document.createElement('metamap-button');
    el.setAttribute('clientid', METAMAP_CLIENT_ID);
    el.setAttribute('flowId', METAMAP_FLOW_ID);
    el.setAttribute('metadata', JSON.stringify({ userId, email: userEmail }));
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(el);
    onStarted?.();
  }, [userId, userEmail]);

  return <div ref={containerRef} className="metamap-btn-container" />;
}
