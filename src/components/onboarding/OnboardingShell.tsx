'use client';
import { useRouter } from 'next/navigation';
import { t } from '@/i18n/translations';
import { CDN_URL } from '@/lib/cdn';
import { Ic } from '@/components/dashboard/shared';
import './onboarding.css';

export interface StepDef {
  id: string;
  labelKey: string;
}

interface OnboardingShellProps {
  lang: string;
  steps: StepDef[];
  activeIndex: number;
  onSelect: (idx: number) => void;
  children: React.ReactNode;
  /** Right-hand-side panel content for the active step. */
  rightPanel: React.ReactNode;
  /** Optional CTA row (Back / Continue). */
  footer?: React.ReactNode;
  /** Optional headline + description block above the left panel content. */
  headline?: React.ReactNode;
}

export function OnboardingShell({
  lang, steps, activeIndex, onSelect, children, rightPanel, footer, headline,
}: OnboardingShellProps) {
  const router = useRouter();

  return (
    <div className="onb-shell">
      <aside className="onb-sidebar">
        <div style={{ display: 'flex', alignItems: 'center', padding: '4px 12px', height: 40, marginBottom: 28 }}>
          <img src={`${CDN_URL}/logo.svg`} alt="Ancestro" style={{ height: 30, width: 'auto', objectFit: 'contain' }} />
        </div>

        <nav className="onb-step-nav">
          {steps.map((s, i) => {
            const status: 'completed' | 'active' | 'pending' =
              i < activeIndex ? 'completed' : i === activeIndex ? 'active' : 'pending';
            return (
              <button
                key={s.id}
                type="button"
                className={`onb-step-item ${status === 'pending' ? '' : status}`}
                onClick={() => onSelect(i)}
                disabled={i > activeIndex}
              >
                <span className="onb-step-num">
                  {status === 'completed' ? <Ic n="check" s={12} c="#0A0617" /> : i + 1}
                </span>
                <span style={{ flex: 1 }}>{t(lang, s.labelKey)}</span>
              </button>
            );
          })}
        </nav>

        <div style={{
          marginTop: 12, padding: 16,
          background: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: 14,
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          <Ic n="headset" s={20} c="#02C076" />
          <span style={{ color: '#EAECEF', fontSize: 13, fontWeight: 700 }}>
            {t(lang, 'onb.help.title')}
          </span>
          <span style={{ color: '#848E9C', fontSize: 11 }}>
            {t(lang, 'onb.help.sub')}
          </span>
          <button
            type="button"
            className="onb-btn-ghost"
            style={{ height: 32, marginTop: 4, background: '#02C07614', border: '1px solid #02C07640', color: '#02C076', fontSize: 11, fontWeight: 700 }}
          >
            {t(lang, 'onb.help.cta')}
          </button>
        </div>
      </aside>

      <main className="onb-content">
        <button
          type="button"
          onClick={() => router.push(`/${lang}/dashboard`)}
          className="onb-btn-ghost"
          style={{ alignSelf: 'flex-start', height: 32, padding: '0 12px', fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}
        >
          ← {t(lang, 'onb.exit')}
        </button>

        <div className="onb-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <span className="onb-step-badge">
              <Ic n="check" s={12} c="#F59E0B" />
              {t(lang, 'onb.stepBadge.prefix')} {activeIndex + 1} {t(lang, 'onb.stepBadge.of')} {steps.length}
            </span>
            {headline}
            {children}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
              {[0, 1, 2, 3].map(i => (
                <span key={i} style={{
                  width: 24, height: 24, borderRadius: 12,
                  background: ['#F59E0B', '#A78BFA', '#02C076', '#6C5CE7'][i],
                  border: '2px solid #0A0A0A',
                  marginLeft: i > 0 ? -10 : 0,
                }} />
              ))}
              <span style={{ color: '#848E9C', fontSize: 12 }}>
                {t(lang, 'onb.socialProof')}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignSelf: 'stretch' }}>
            {rightPanel}
          </div>
        </div>

        {footer && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, flexWrap: 'wrap', gap: 12 }}>
            {footer}
          </div>
        )}
      </main>
    </div>
  );
}
