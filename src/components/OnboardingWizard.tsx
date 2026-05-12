'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

const Ic = ({ d, s = 24, c = 'currentColor' }: { d: string; s?: number; c?: string }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ color: c, flexShrink: 0 }}>
    <path d={d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const goldGrad = 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)';

type Step = 'welcome' | 'channels' | 'link' | 'location' | 'done';
const STEP_ORDER: Step[] = ['welcome', 'channels', 'link', 'location', 'done'];
const TOTAL = 4;

const btnPrimary: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
  height: 54, padding: '0 32px', background: goldGrad, border: 'none', borderRadius: 12,
  color: '#0A0617', fontSize: 15, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer',
  boxShadow: '0 10px 32px rgba(245,158,11,0.3)',
};
const btnGhost: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  height: 54, padding: '0 28px', background: '#0E0E10', border: '1px solid #1F1F22', borderRadius: 12,
  color: '#F5F3FF', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
};

function StepLayout({
  step, lang, title, subtitle, eyebrow, eyebrowColor = '#F59E0B', right, left, onSkip,
  onBack, onContinue, continueLabel, continueDisabled, saving,
}: {
  step: number; lang: string;
  title: string; subtitle?: string;
  eyebrow?: string; eyebrowColor?: string;
  right: ReactNode; left?: ReactNode; onSkip: () => void;
  onBack?: () => void; onContinue?: () => void;
  continueLabel?: string; continueDisabled?: boolean; saving?: boolean;
}) {
  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column' }}>
      {/* Top nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 80, padding: '0 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Ic d="M4 16s.5 -1 2 -1 2.5 1.5 2 4c-.5 1.5-2 2-2 2 M8 12s.5 -1 2 -1 2.5 1.5 2 4c-.5 1.5-2 2-2 2 M12 8s.5 -1 2 -1 2.5 1.5 2 4c-.5 1.5-2 2-2 2 M16 4s.5 -1 2 -1 2.5 1.5 2 4c-.5 1.5-2 2-2 2" s={24} c="#F59E0B" />
          <span style={{ color: '#F5F3FF', fontSize: 18, fontWeight: 800, letterSpacing: 1.5 }}>ANCESTRO</span>
        </div>
        <span style={{ color: '#5E6673', fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>STEP {step} OF {TOTAL}</span>
        <button onClick={onSkip} style={{ background: 'none', border: 'none', color: '#848E9C', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          {lang === 'es' ? 'Saltar onboarding' : 'Skip onboarding'}
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ display: 'flex', gap: 8, height: 6, padding: '0 80px', marginBottom: 56 }}>
        {Array.from({ length: TOTAL }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: i < step ? '#F59E0B' : '#1A1A1A' }} />
        ))}
      </div>

      {/* Content grid */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: left ? '520px 1fr' : '1fr', gap: 48, padding: '0 80px 80px', alignItems: 'start' }}>
        {left ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {eyebrow && (
              <div style={{ display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 6, padding: '0 12px', height: 30, background: `${eyebrowColor}15`, border: `1px solid ${eyebrowColor}60`, borderRadius: 15 }}>
                <span style={{ color: eyebrowColor, fontSize: 11, fontWeight: 800, letterSpacing: 1.5 }}>{eyebrow}</span>
              </div>
            )}
            <h1 style={{ color: '#F5F3FF', fontSize: 52, fontWeight: 800, letterSpacing: -1.6, lineHeight: 1.05, margin: 0, whiteSpace: 'pre-line' }}>{title}</h1>
            {subtitle && <p style={{ color: '#848E9C', fontSize: 16, fontWeight: 400, lineHeight: 1.5, margin: 0 }}>{subtitle}</p>}
            {left}
          </div>
        ) : (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            {eyebrow && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0 12px', height: 30, background: `${eyebrowColor}15`, border: `1px solid ${eyebrowColor}60`, borderRadius: 15 }}>
                <span style={{ color: eyebrowColor, fontSize: 11, fontWeight: 800, letterSpacing: 1.5 }}>{eyebrow}</span>
              </div>
            )}
            <h1 style={{ color: '#F5F3FF', fontSize: 48, fontWeight: 800, letterSpacing: -1.4, lineHeight: 1.05, margin: 0, whiteSpace: 'pre-line' }}>{title}</h1>
            {subtitle && <p style={{ color: '#848E9C', fontSize: 15, fontWeight: 400, lineHeight: 1.5, margin: 0, maxWidth: 640 }}>{subtitle}</p>}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>{right}</div>
      </div>

      {/* Footer actions */}
      {(onBack || onContinue) && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, padding: '0 80px 56px' }}>
          {onBack && <button onClick={onBack} style={btnGhost}>{lang === 'es' ? 'Atrás' : 'Back'}</button>}
          {onContinue && (
            <button onClick={onContinue} disabled={continueDisabled || saving} style={{ ...btnPrimary, opacity: continueDisabled || saving ? 0.5 : 1 }}>
              {saving ? (lang === 'es' ? 'Guardando…' : 'Saving…') : (continueLabel || (lang === 'es' ? 'Continuar' : 'Continue'))}
              {!saving && <Ic d="M5 12h14M12 5l7 7-7 7" s={16} />}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function OnboardingWizard({ lang }: { lang: string }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<Step>('welcome');
  const [goal, setGoal] = useState<string>('2k');
  const [channel, setChannel] = useState('');
  const [refCode, setRefCode] = useState('');
  const [pin, setPin] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    const userId = user.id || user.email;
    fetch(`/api/onboarding?user_id=${encodeURIComponent(userId)}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.code) setRefCode(d.code); });
  }, [user]);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const refUrl = refCode ? `${origin}/${lang}/r/${refCode}` : '';
  const firstName = (user?.name || user?.email || '').split(/\s+|@/)[0];

  async function persistStep(extra: Record<string, unknown> = {}) {
    if (!user) return;
    setSaving(true); setError('');
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id || user.email, user_email: user.email, user_name: user.name,
          channel: channel || undefined, zip: pin || undefined, ...extra,
        }),
      });
      if (!res.ok) throw new Error('save_failed');
      const d = await res.json();
      if (d.code) setRefCode(d.code);
    } catch {
      setError(lang === 'es' ? 'No pudimos guardar. Intentá de nuevo.' : 'Could not save. Try again.');
      throw new Error('save_failed');
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) return <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#848E9C' }}>Loading...</div>;
  if (!user) return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <Ic d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" s={64} c="#F59E0B" />
      <h2 style={{ color: '#F5F3FF', fontSize: 24, fontWeight: 800, margin: 0 }}>Login Required</h2>
      <button onClick={() => router.push(`/${lang}/login`)} style={btnPrimary}>Sign In</button>
    </div>
  );

  const stepNum = STEP_ORDER.indexOf(step) + 1;
  const skip = () => router.push(`/${lang}/dashboard`);

  // ═══ Step 1: Welcome / Goal ═══
  if (step === 'welcome') {
    const goals = [
      { id: '1k', amount: '$1k', desc: lang === 'es' ? 'Empezando · 10 referidos/mes' : 'Starting out · 10 refs/mo', tier: lang === 'es' ? 'Bronze' : 'Bronze' },
      { id: '2k', amount: '$2k', desc: lang === 'es' ? 'Constante · 22 referidos/mes' : 'Consistent · 22 refs/mo', tier: 'Silver', highlight: true },
      { id: '5k', amount: '$5k+', desc: lang === 'es' ? 'A todo · 50+ referidos/mes' : 'Going hard · 50+ refs/mo', tier: 'Platinum' },
    ];
    return (
      <StepLayout
        step={stepNum} lang={lang} onSkip={skip}
        eyebrow={lang === 'es' ? '👋 BIENVENIDO' : '👋 WELCOME'}
        title={lang === 'es' ? `¿Cuál es tu\nmeta mensual?` : `What's your\nmonthly goal?`}
        subtitle={lang === 'es' ? 'Elegí un objetivo — vamos a calcular exactamente cuántos referidos necesitás y a personalizar tu dashboard.' : "Pick a target — we'll show you exactly how many referrals you need and customize your dashboard accordingly."}
        left={<div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', background: '#0E0E10', border: '1px solid #1F1F22', borderRadius: 14 }}>
          <div style={{ width: 32, height: 32, borderRadius: 16, background: goldGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A0617', fontSize: 12, fontWeight: 800 }}>{firstName[0]?.toUpperCase() || 'A'}</div>
          <span style={{ color: '#848E9C', fontSize: 13 }}>{firstName} · {lang === 'es' ? 'Tu camino, tu velocidad.' : 'Your pace, your way.'}</span>
        </div>}
        right={
          <>
            {goals.map(g => {
              const sel = goal === g.id;
              return (
                <button key={g.id} onClick={() => setGoal(g.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 18, padding: '22px 24px',
                  background: sel ? '#12100B' : '#0A0A0A',
                  border: sel ? '1.5px solid #3F3216' : '1px solid #1A1A1A',
                  borderRadius: 18, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', width: '100%',
                }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: sel ? goldGrad : '#0E0E10', display: 'flex', alignItems: 'center', justifyContent: 'center', color: sel ? '#0A0617' : '#F59E0B', fontSize: 18, fontWeight: 800, border: sel ? 'none' : '1px solid #1A1A1A' }}>
                    {g.amount}
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ color: '#F5F3FF', fontSize: 16, fontWeight: 800 }}>{g.amount}/{lang === 'es' ? 'mes' : 'mo'} · {g.tier}</span>
                    <span style={{ color: '#848E9C', fontSize: 13 }}>{g.desc}</span>
                  </div>
                  <div style={{ width: 20, height: 20, borderRadius: 10, border: `2px solid ${sel ? '#F59E0B' : '#3F3F46'}`, background: sel ? '#F59E0B' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {sel && <Ic d="M20 6L9 17l-5-5" s={10} c="#0A0617" />}
                  </div>
                </button>
              );
            })}
          </>
        }
        onContinue={() => setStep('channels')}
        continueLabel={lang === 'es' ? 'Continuar' : 'Continue'}
      />
    );
  }

  // ═══ Step 2: Channels ═══
  if (step === 'channels') {
    const channels = [
      { id: 'instagram', name: 'Instagram', desc: lang === 'es' ? 'Mejor para stories, reels y bio links.' : 'Best for stories, reels, and bio links.', bg: '#0F0A14', border: '#2A1F2A', icon: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z', color: '#E4405F' },
      { id: 'youtube', name: 'YouTube', desc: lang === 'es' ? 'Compradores high-intent de reviews y tutoriales.' : 'High-intent buyers from reviews and tutorials.', bg: '#140A0A', border: '#2A1A1A', icon: 'M2 17V7a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z M10 9l5 3-5 3V9z', color: '#FF0000' },
      { id: 'x', name: 'Twitter / X', desc: lang === 'es' ? 'Audiencia tech-savvy y early adopters.' : 'Tech-savvy audience and early adopters.', bg: '#0A1018', border: '#1A2233', icon: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z', color: '#fff' },
    ];
    return (
      <StepLayout
        step={stepNum} lang={lang} onSkip={skip}
        right={
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
              {channels.map(c => {
                const sel = channel === c.id;
                return (
                  <button key={c.id} onClick={() => setChannel(c.id)} style={{
                    display: 'flex', flexDirection: 'column', gap: 14, padding: 24, minHeight: 280,
                    background: c.bg, border: `1.5px solid ${sel ? '#F59E0B' : c.border}`, borderRadius: 20,
                    cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Ic d={c.icon} s={28} c={c.color} />
                      <div style={{ width: 22, height: 22, borderRadius: 11, border: `2px solid ${sel ? '#F59E0B' : '#3F3F46'}`, background: sel ? '#F59E0B' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {sel && <Ic d="M20 6L9 17l-5-5" s={12} c="#0A0617" />}
                      </div>
                    </div>
                    <span style={{ color: '#F5F3FF', fontSize: 22, fontWeight: 800, marginTop: 12 }}>{c.name}</span>
                    <span style={{ color: '#848E9C', fontSize: 13, lineHeight: 1.5 }}>{c.desc}</span>
                    <div style={{ flex: 1 }} />
                    <div style={{ display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', padding: '0 10px', height: 24, background: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: 6 }}>
                      <span style={{ color: '#848E9C', fontSize: 11, fontWeight: 700 }}>~{lang === 'es' ? 'Hasta' : 'Up to'} $8k/mo</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        }
        title={lang === 'es' ? 'Conectá tus canales.' : 'Connect your channels.'}
        subtitle={lang === 'es' ? 'Elegí dónde vas a compartir tu link. Generamos assets por plataforma y trackeamos cuál convierte mejor.' : "Pick where you'll share your link. We'll generate platform-specific assets and track which channels convert best."}
        eyebrow={lang === 'es' ? '✨ DÓNDE COMPARTÍS?' : '✨ WHERE WILL YOU SHARE?'}
        eyebrowColor="#A78BFA"
        onBack={() => setStep('welcome')}
        onContinue={async () => { try { await persistStep({ channel }); setStep('link'); } catch {} }}
        continueDisabled={!channel}
        saving={saving}
      />
    );
  }

  // ═══ Step 3: First Link ═══
  if (step === 'link') {
    return (
      <StepLayout
        step={stepNum} lang={lang} onSkip={skip}
        right={null}
        eyebrow={lang === 'es' ? '✓ LISTO · LINK ACTIVO' : '✓ READY · LINK ACTIVE'}
        eyebrowColor="#02C076"
        title={lang === 'es' ? `Tu link está listo,\n${firstName}.` : `Your link is ready,\n${firstName}.`}
        subtitle={lang === 'es' ? 'Compartilo en tus canales. Auto-detectamos de qué plataforma vino cada click.' : "Share it on your channels. We'll auto-detect which channel each click came from."}
      />
    );
  }

  // ═══ Step 4: Location / ZIP ═══
  if (step === 'location') {
    return (
      <StepLayout
        step={stepNum} lang={lang} onSkip={skip}
        eyebrow={lang === 'es' ? '📍 UBICACIÓN' : '📍 LOCATION'}
        title={lang === 'es' ? `Marcá tu zona\nde foco.` : `Pin your\nservice area.`}
        subtitle={lang === 'es' ? 'Lo usamos para mostrarte ofertas y materiales de marketing específicos para tu región.' : 'We use this to show you region-specific offers and marketing materials.'}
        right={
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ color: '#5E6673', fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>{lang === 'es' ? 'CÓDIGO POSTAL' : 'ZIP / POSTAL CODE'}</label>
              <input
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder={lang === 'es' ? 'Ej. 11540 / CABA' : 'e.g. 90210'}
                style={{
                  width: '100%', height: 60, padding: '0 20px',
                  background: '#0A0A0A', border: '1.5px solid #1F1F22', borderRadius: 14,
                  color: '#F5F3FF', fontSize: 18, fontFamily: 'inherit', fontWeight: 600, outline: 'none',
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 20, background: '#0E0E10', border: '1px solid #1F1F22', borderRadius: 18 }}>
              <span style={{ color: '#5E6673', fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>{lang === 'es' ? '¿POR QUÉ LO NECESITAMOS?' : 'WHY WE NEED THIS'}</span>
              {[
                lang === 'es' ? 'Mostramos ofertas locales y comisiones por región.' : 'Show local offers and per-region commissions.',
                lang === 'es' ? 'Conectamos con instaladores cerca tuyo.' : 'Connect you with installers near you.',
                lang === 'es' ? 'Calculamos ahorros estimados con tu ZIP.' : 'Calculate estimated savings with your ZIP.',
              ].map((line, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ width: 16, height: 16, borderRadius: 8, background: '#02C07620', border: '1px solid #02C07640', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <Ic d="M20 6L9 17l-5-5" s={10} c="#02C076" />
                  </div>
                  <span style={{ color: '#848E9C', fontSize: 13 }}>{line}</span>
                </div>
              ))}
            </div>
            {error && <span style={{ color: '#EF4444', fontSize: 13 }}>{error}</span>}
          </>
        }
        onBack={() => setStep('link')}
        onContinue={async () => { try { await persistStep({ zip: pin }); setStep('done'); } catch {} }}
        continueLabel={lang === 'es' ? 'Completar setup' : 'Complete Setup'}
        saving={saving}
      />
    );
  }

  // ═══ Done ═══
  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column' }}>
      {/* Top nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 80, padding: '0 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Ic d="M4 16s.5 -1 2 -1 2.5 1.5 2 4c-.5 1.5-2 2-2 2 M8 12s.5 -1 2 -1 2.5 1.5 2 4c-.5 1.5-2 2-2 2 M12 8s.5 -1 2 -1 2.5 1.5 2 4c-.5 1.5-2 2-2 2 M16 4s.5 -1 2 -1 2.5 1.5 2 4c-.5 1.5-2 2-2 2" s={24} c="#F59E0B" />
          <span style={{ color: '#F5F3FF', fontSize: 18, fontWeight: 800, letterSpacing: 1.5 }}>ANCESTRO</span>
        </div>
        <span style={{ color: '#02C076', fontSize: 11, fontWeight: 800, letterSpacing: 1.5 }}>
          {lang === 'es' ? 'YA ESTÁS DENTRO!' : "YOU'RE IN!"}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 8, height: 6, padding: '0 80px' }}>
        {Array.from({ length: TOTAL }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: '#F59E0B' }} />
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28, padding: '60px 80px', maxWidth: 880, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ fontSize: 28 }}>🎉</span>
          <span style={{ fontSize: 28 }}>✨</span>
          <span style={{ fontSize: 28 }}>🚀</span>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0 16px', height: 32, background: '#0B1A12', border: '1px solid #143A23', borderRadius: 16 }}>
          <Ic d="M20 6L9 17l-5-5" s={14} c="#02C076" />
          <span style={{ color: '#02C076', fontSize: 11, fontWeight: 800, letterSpacing: 1.2 }}>{lang === 'es' ? 'YA ESTÁS LISTO · LINK ACTIVO' : "YOU'RE READY · LINK ACTIVE"}</span>
        </div>
        <h1 style={{ color: '#F5F3FF', fontSize: 56, fontWeight: 800, letterSpacing: -1.4, lineHeight: 1.05, margin: 0, textAlign: 'center', whiteSpace: 'pre-line' }}>
          {lang === 'es' ? `Tu link está listo,\n${firstName}.` : `Your link is ready,\n${firstName}.`}
        </h1>
        <p style={{ color: '#848E9C', fontSize: 17, lineHeight: 1.55, margin: 0, textAlign: 'center', maxWidth: 640 }}>
          {lang === 'es' ? 'Compartilo donde quieras. Auto-detectamos de qué canal vino cada click.' : "Share it anywhere. We'll auto-detect which channel each click came from."}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 24, background: '#0E0E10', border: '1px solid #1F1F22', borderRadius: 20, width: '100%', maxWidth: 680 }}>
          <span style={{ color: '#F59E0B', fontSize: 11, fontWeight: 800, letterSpacing: 1.5 }}>{lang === 'es' ? 'TU LINK DE REFERIDO' : 'YOUR REFERRAL LINK'}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '0 20px', height: 60, background: '#040406CC', border: '1px solid #1F1F22', borderRadius: 14 }}>
            <Ic d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" s={18} c="#F59E0B" />
            <span style={{ flex: 1, color: '#F5F3FF', fontSize: 15, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{refUrl || '...'}</span>
            <button onClick={() => { if (!refUrl) return; navigator.clipboard.writeText(refUrl); setCopied(true); setTimeout(() => setCopied(false), 1800); }} disabled={!refUrl} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 14px', height: 36, background: goldGrad, border: 'none', borderRadius: 9, color: '#0A0617', fontSize: 12, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer', opacity: refUrl ? 1 : 0.5 }}>
              <Ic d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" s={14} />
              {copied ? (lang === 'es' ? 'Copiado!' : 'Copied!') : (lang === 'es' ? 'Copiar' : 'Copy')}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
          <button onClick={() => setStep('welcome')} style={btnGhost}>{lang === 'es' ? '↩ Re-hacer' : '↩ Redo'}</button>
          <button onClick={() => router.push(`/${lang}/dashboard`)} style={btnPrimary}>
            {lang === 'es' ? 'Ir al Dashboard' : 'Go to Dashboard'}
            <Ic d="M5 12h14M12 5l7 7-7 7" s={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
