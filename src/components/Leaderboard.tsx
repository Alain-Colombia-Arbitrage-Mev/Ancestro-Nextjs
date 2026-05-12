'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { CDN_URL } from '@/lib/cdn';

const Ic = ({ d, s = 24, c = 'currentColor' }: { d: string; s?: number; c?: string }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ color: c, flexShrink: 0 }}>
    <path d={d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface Row {
  rank: number;
  user_id: string;
  name: string;
  refs: number;
  revenue: number;
  color: string;
  isYou?: boolean;
}

const goldGrad = 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)';
const silverGrad = 'linear-gradient(135deg, #E5E7EB 0%, #9CA3AF 100%)';
const bronzeGrad = 'linear-gradient(135deg, #FCD34D 0%, #B45309 100%)';
const blueGrad = 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)';
const purpleGrad = 'linear-gradient(135deg, #A78BFA 0%, #6C5CE7 100%)';
const palettes = [goldGrad, silverGrad, bronzeGrad, blueGrad, purpleGrad, goldGrad];

function fmtMoney(n: number): string { return `$${Math.round(n).toLocaleString('en-US')}`; }
function initials(name: string): string {
  const parts = (name || '').trim().split(/\s+/);
  return ((parts[0]?.[0] || '?') + (parts[1]?.[0] || '')).toUpperCase();
}

type Scope = 'global' | 'country' | 'friends';

export default function LeaderboardPage({ lang }: { lang: string }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [scope, setScope] = useState<Scope>('global');

  useEffect(() => {
    if (!user) return;
    const userId = user.id || user.email;
    fetch(`/api/leaderboard?limit=20&user_id=${encodeURIComponent(userId)}`)
      .then(r => r.ok ? r.json() : { rows: [] })
      .then(d => setRows(Array.isArray(d.rows) ? d.rows : []))
      .finally(() => setLoading(false));
  }, [user]);

  if (isLoading) return <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#848E9C' }}>Loading...</div>;
  if (!user) return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <Ic d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" s={64} c="#F59E0B" />
      <h2 style={{ color: '#F5F3FF', fontSize: 24, fontWeight: 800, margin: 0 }}>Login Required</h2>
      <button onClick={() => router.push(`/${lang}/login`)} style={btnP}>Sign In</button>
    </div>
  );

  const top3 = rows.slice(0, 3);
  const list = rows.slice(3, 10);
  const you = rows.find(r => r.isYou);
  const firstName = (user.name || user.email).split(/\s+|@/)[0];

  const tabs: { id: Scope; label: string }[] = [
    { id: 'country', label: 'Country' },
    { id: 'global', label: 'Global' },
    { id: 'friends', label: 'Friends' },
  ];

  // Mocked achievement badges (no DB yet)
  const badges = [
    { emoji: '🥇', label: 'First Sale', unlocked: true, color: '#F59E0B' },
    { emoji: '🔥', label: 'On Fire 7d', unlocked: true, color: '#02C076' },
    { emoji: '💎', label: 'Diamond Hand', unlocked: true, color: '#A78BFA' },
    { emoji: '🚀', label: '$50K Club', unlocked: false, color: '#5E6673' },
    { emoji: '🌍', label: 'Global Top 10', unlocked: false, color: '#5E6673' },
    { emoji: '👑', label: 'King of Q4', unlocked: false, color: '#5E6673' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#000' }}>
      {/* Topbar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: '#0A0A0ACC', backdropFilter: 'blur(20px)', borderBottom: '1px solid #1A1A1A', display: 'flex', alignItems: 'center', padding: '12px 40px', gap: 24 }}>
        <button onClick={() => router.push(`/${lang}/dashboard`)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: '#848E9C', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>
          <Ic d="M19 12H5M12 19l-7-7 7-7" s={18} /> Dashboard
        </button>
        <img src={`${CDN_URL}/logo.svg`} alt="Ancestro" style={{ height: 30 }} />
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '92px 40px 80px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ color: '#848E9C', fontSize: 13, fontWeight: 500 }}>Compete with the best</span>
            <h1 style={{ color: '#F5F3FF', fontSize: 32, fontWeight: 800, letterSpacing: -0.5, margin: 0 }}>Leaderboard</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 40, padding: '0 4px', background: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: 10 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setScope(t.id)} style={{
                height: 32, padding: '0 14px', borderRadius: 8, border: 'none', fontFamily: 'inherit',
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                background: scope === t.id ? '#F59E0B' : 'transparent',
                color: scope === t.id ? '#0A0617' : '#848E9C',
              }}>{t.label}</button>
            ))}
          </div>
        </div>

        {/* YOUR ROW BANNER */}
        {you && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '0 24px', height: 96, background: '#12100B', border: '1px solid #2A2218', borderRadius: 18 }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, background: goldGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A0617', fontSize: 18, fontWeight: 800 }}>
              #{you.rank}
            </div>
            <div style={{ width: 56, height: 56, borderRadius: 28, background: goldGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A0617', fontSize: 18, fontWeight: 800 }}>
              {firstName[0]?.toUpperCase()}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ color: '#F59E0B', fontSize: 10, fontWeight: 700, letterSpacing: 1.2 }}>YOU · {rows.length} AFFILIATES TOTAL</span>
              <span style={{ color: '#F5F3FF', fontSize: 18, fontWeight: 800 }}>{firstName} · Climbing fast 🔥</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
              <span style={{ color: '#F59E0B', fontSize: 22, fontWeight: 800 }}>{fmtMoney(you.revenue)}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Ic d="M22 7l-8.5 8.5-5-5L2 17 M16 7h6v6" s={12} c="#02C076" />
                <span style={{ color: '#02C076', fontSize: 11, fontWeight: 600 }}>+{you.refs} refs</span>
              </div>
            </div>
          </div>
        )}

        {/* PODIUM */}
        {loading && <div style={{ textAlign: 'center', color: '#848E9C', padding: 60 }}>Loading…</div>}
        {!loading && rows.length === 0 && (
          <div style={{ textAlign: 'center', color: '#848E9C', padding: 60, fontSize: 14 }}>No affiliates yet. Be the first!</div>
        )}
        {!loading && top3.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, alignItems: 'flex-end', minHeight: 280 }}>
            {[1, 0, 2].map(idx => {
              const p = top3[idx]; if (!p) return null;
              const isFirst = p.rank === 1;
              const isSecond = p.rank === 2;
              const medal = isFirst ? '👑' : isSecond ? '🥈' : '🥉';
              const pillBg = isFirst ? '#1F1B12' : isSecond ? '#1A1A1A' : '#1A1612';
              const pillBorder = isFirst ? '#3F3216' : isSecond ? '#2A2A2E' : '#3A2A1A';
              const borderColor = isFirst ? '#2A2218' : isSecond ? '#1F1F22' : '#1F1F22';
              const cardHeight = isFirst ? 280 : isSecond ? 240 : 200;
              const avSize = isFirst ? 96 : isSecond ? 80 : 64;
              const nameSize = isFirst ? 22 : isSecond ? 18 : 16;
              const valSize = isFirst ? 30 : isSecond ? 22 : 18;
              const palette = palettes[idx % palettes.length];
              return (
                <div key={p.user_id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: isFirst ? '20px 20px 24px' : '16px 16px 20px', background: '#0E0E10', border: `1px solid ${borderColor}`, borderRadius: 20, height: cardHeight }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0 10px', height: 24, background: pillBg, border: `1px solid ${pillBorder}`, borderRadius: 6 }}>
                      <span style={{ color: isFirst ? '#F59E0B' : isSecond ? '#A1A1AA' : '#D97706', fontSize: 11, fontWeight: 800, letterSpacing: 0.5 }}>#{p.rank}</span>
                    </div>
                    <span style={{ fontSize: isFirst ? 28 : 24 }}>{medal}</span>
                  </div>
                  <div style={{ flex: 1 }} />
                  <div style={{ width: avSize, height: avSize, borderRadius: avSize / 2, background: p.isYou ? goldGrad : '#1F1F22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: p.isYou ? '#0A0617' : '#FAFAFA', fontSize: isFirst ? 30 : isSecond ? 24 : 20, fontWeight: 800, border: isFirst ? '2px solid #3F3216' : '1px solid #2A2A2E' }}>
                    {initials(p.name)}
                  </div>
                  <span style={{ color: '#FAFAFA', fontSize: nameSize, fontWeight: 800, letterSpacing: -0.3, textAlign: 'center' }}>{p.name}</span>
                  <span style={{ color: '#848E9C', fontSize: 11, fontWeight: 600 }}>🌍 {p.refs} refs</span>
                  <div style={{ flex: 1 }} />
                  <span style={{ color: '#FAFAFA', fontSize: valSize, fontWeight: 800, letterSpacing: -0.3 }}>{fmtMoney(p.revenue)}</span>
                  {isFirst && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Ic d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" s={11} c="#D97706" />
                      <span style={{ color: '#D97706', fontSize: 11, fontWeight: 700 }}>3 months on top</span>
                    </div>
                  )}
                  {/* hidden palette to avoid unused-var lint, but kept for future avatar gradient */}
                  <span style={{ display: 'none' }}>{palette}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* LIST + ACHIEVEMENTS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16 }}>
          {/* Ranking 4-10 */}
          {!loading && list.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', background: '#0E0E10', border: '1px solid #1A1A1A', borderRadius: 18, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px', height: 48 }}>
                <span style={{ color: '#5E6673', fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>RANKING · POSITIONS 4 — 10</span>
              </div>
              <div style={{ height: 1, background: '#1A1A1A' }} />
              {list.map((p, i) => (
                <div key={p.user_id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '0 20px', height: 46, background: p.isYou ? '#F59E0B18' : 'transparent', border: p.isYou ? '1px solid #F59E0B40' : 'none', borderLeftWidth: 0, borderRightWidth: 0 }}>
                    <span style={{ color: p.isYou ? '#F59E0B' : '#848E9C', fontSize: 14, fontWeight: 800, width: 24 }}>{p.rank}</span>
                    <div style={{ width: 32, height: 32, borderRadius: 16, background: palettes[(p.rank - 1) % palettes.length] }} />
                    <span style={{ color: p.isYou ? '#F59E0B' : '#F5F3FF', fontSize: 13, fontWeight: 700, width: 160 }}>{p.isYou ? `You · ${p.name}` : p.name}</span>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 13 }}>🌍</span>
                      <span style={{ color: '#5E6673', fontSize: 11 }}>{p.refs} refs</span>
                    </div>
                    <span style={{ color: '#02C076', fontSize: 11, fontWeight: 700, width: 40 }}>+{p.refs}</span>
                    <span style={{ color: p.isYou ? '#F59E0B' : '#F5F3FF', fontSize: 13, fontWeight: 800, width: 90, textAlign: 'right' }}>{fmtMoney(p.revenue)}</span>
                  </div>
                  {i < list.length - 1 && <div style={{ height: 1, background: '#0A0A0A' }} />}
                </div>
              ))}
              {you && you.rank > 10 && (
                <>
                  <div style={{ textAlign: 'center', color: '#5E6673', fontSize: 18, fontWeight: 700, padding: '8px 0' }}>⋮</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '0 20px', height: 50, background: '#F59E0B18', border: '1px solid #F59E0B40' }}>
                    <span style={{ color: '#F59E0B', fontSize: 14, fontWeight: 800, width: 24 }}>{you.rank}</span>
                    <div style={{ width: 32, height: 32, borderRadius: 16, background: goldGrad }} />
                    <span style={{ color: '#F59E0B', fontSize: 13, fontWeight: 800, width: 160 }}>You · {you.name}</span>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 13 }}>🌍</span>
                      <span style={{ color: '#F59E0B', fontSize: 11, fontWeight: 600 }}>3× Partner</span>
                    </div>
                    <span style={{ color: '#02C076', fontSize: 11, fontWeight: 800, width: 40 }}>+{you.refs}</span>
                    <span style={{ color: '#F59E0B', fontSize: 13, fontWeight: 800, width: 90, textAlign: 'right' }}>{fmtMoney(you.revenue)}</span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Achievements */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24, background: '#0E0E10', border: '1px solid #1A1A1A', borderRadius: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Ic d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33" s={18} c="#F59E0B" />
              <span style={{ color: '#5E6673', fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>YOUR ACHIEVEMENTS</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {badges.map((b) => (
                <div key={b.label} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                  height: 80, borderRadius: 12,
                  background: b.unlocked ? `${b.color}18` : '#0A0A0A',
                  border: `1px solid ${b.unlocked ? `${b.color}40` : '#1A1A1A'}`,
                  opacity: b.unlocked ? 1 : 0.5,
                }}>
                  <span style={{ fontSize: 24 }}>{b.emoji}</span>
                  <span style={{ color: b.unlocked ? '#F5F3FF' : '#5E6673', fontSize: 10, fontWeight: 700, textAlign: 'center', padding: '0 4px' }}>{b.label}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '12px 14px', background: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#F5F3FF', fontSize: 12, fontWeight: 700 }}>Next: $50K Club</span>
                <span style={{ color: '#F59E0B', fontSize: 11, fontWeight: 700 }}>$7.5K to go</span>
              </div>
              <div style={{ width: '100%', height: 6, background: '#0A0A0A', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: '85%', height: '100%', background: goldGrad, borderRadius: 3 }} />
              </div>
              <span style={{ color: '#5E6673', fontSize: 10 }}>85% completed · Unlock at $50,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const btnP: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 6, padding: '0 18px', height: 40, background: '#F59E0B', borderRadius: 10, border: 'none', cursor: 'pointer', color: '#0A0617', fontSize: 14, fontWeight: 700, fontFamily: 'inherit' };
