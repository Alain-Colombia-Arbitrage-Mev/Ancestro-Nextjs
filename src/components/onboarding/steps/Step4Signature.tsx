'use client';
import { useRef, useState } from 'react';
import { t } from '@/i18n/translations';
import { Ic } from '@/components/dashboard/shared';
import type { OnboardingState } from '../CustomerOnboardingWizard';

interface Props {
  lang: string;
  data: OnboardingState;
  update: (patch: Partial<OnboardingState>) => void;
}

export function Step4Signature({ lang, data, update }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [empty, setEmpty] = useState(!data.signedAt);

  function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = canvasRef.current!; const r = c.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * c.width, y: ((e.clientY - r.top) / r.height) * c.height };
  }
  function start(e: React.PointerEvent<HTMLCanvasElement>) {
    setDrawing(true); setEmpty(false);
    const { x, y } = getPos(e);
    const ctx = canvasRef.current!.getContext('2d')!;
    ctx.beginPath(); ctx.moveTo(x, y);
  }
  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing) return;
    const { x, y } = getPos(e);
    const ctx = canvasRef.current!.getContext('2d')!;
    ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.lineTo(x, y); ctx.stroke();
  }
  function end() {
    if (drawing) {
      setDrawing(false);
      update({ signedAt: new Date().toISOString() });
    }
  }
  function clear() {
    const c = canvasRef.current; if (!c) return;
    c.getContext('2d')!.clearRect(0, 0, c.width, c.height);
    setEmpty(true);
    update({ signedAt: undefined });
  }

  return (
    <>
      <div className="onb-callout">
        <Ic n="shield-check" s={14} c="#02C076" />
        {t(lang, 'onb.cust.signature.callout')}
      </div>

      {/* Customer identity */}
      <div className="onb-card">
        <div className="onb-card-icon" style={{ background: '#02C07618', borderColor: '#02C07640' }}>
          <Ic n="user" s={18} c="#02C076" />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 700 }}>
            {t(lang, 'onb.cust.signature.identity')}
          </span>
          <span style={{ color: '#5E6673', fontSize: 11 }}>
            {data.address || t(lang, 'onb.cust.signature.identitySub')}
          </span>
        </div>
        <Ic n="check" s={16} c="#02C076" />
      </div>

      {/* Signature pad */}
      <div className={`onb-card ${!empty ? 'is-active' : ''}`} style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="onb-card-icon" style={{ background: '#F59E0B18', borderColor: '#F59E0B40' }}>
            <Ic n="edit" s={18} c="#F59E0B" />
          </div>
          <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 700, flex: 1 }}>
            {t(lang, 'onb.cust.signature.signHere')}
          </span>
          <button className="onb-btn-ghost" style={{ height: 30, padding: '0 10px', fontSize: 11 }} onClick={clear}>
            {t(lang, 'onb.cust.signature.clear')}
          </button>
        </div>
        <canvas
          ref={canvasRef}
          width={600}
          height={180}
          style={{
            width: '100%', height: 180,
            background: '#0A0A0A', border: '1px dashed #2A2A2A', borderRadius: 10,
            touchAction: 'none',
          }}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
        />
        <span style={{ color: '#5E6673', fontSize: 11 }}>
          {t(lang, 'onb.cust.signature.tip')}
        </span>
      </div>

      {/* Agreement scope */}
      <div className="onb-card">
        <div className="onb-card-icon" style={{ background: '#A78BFA18', borderColor: '#A78BFA40' }}>
          <Ic n="file-text" s={18} c="#A78BFA" />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 700 }}>
            {t(lang, 'onb.cust.signature.scope')}
          </span>
          <span style={{ color: '#5E6673', fontSize: 11 }}>
            {t(lang, 'onb.cust.signature.scopeSub')}
          </span>
        </div>
        <button className="onb-btn-ghost" style={{ height: 30, padding: '0 12px', fontSize: 11 }}>
          {t(lang, 'onb.cust.signature.view')}
        </button>
      </div>
    </>
  );
}
