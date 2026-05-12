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

function fmtMoney(n: number): string {
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

function initials(name: string): string {
  const parts = (name || '').trim().split(/\s+/);
  return ((parts[0]?.[0] || '?') + (parts[1]?.[0] || '')).toUpperCase();
}

export default function LeaderboardPage({ lang }: { lang: string }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const userId = user.id || user.email;
    fetch(`/api/leaderboard?limit=20&user_id=${encodeURIComponent(userId)}`)
      .then(r => r.ok ? r.json() : { rows: [] })
      .then(d => setRows(Array.isArray(d.rows) ? d.rows : []))
      .finally(() => setLoading(false));
  }, [user]);

  if (isLoading) return <div style={{ minHeight:'100vh',background:'#000',display:'flex',alignItems:'center',justifyContent:'center',color:'#848E9C' }}>Loading...</div>;
  if (!user) return <div style={{ minHeight:'100vh',background:'#000',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:20 }}><Ic d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" s={64} c="#F59E0B" /><h2 style={{color:'#EAECEF',fontSize:24,fontWeight:800,margin:0}}>Login Required</h2><button onClick={()=>router.push(`/${lang}/login`)} style={btnP}>Sign In</button></div>;

  const top3 = rows.slice(0, 3);
  const list = rows.slice(3);

  return (
    <div style={{ minHeight:'100vh',background:'#000' }}>
      <div style={{ position:'fixed',top:0,left:0,right:0,zIndex:100,background:'#0A0A0ACC',backdropFilter:'blur(20px)',borderBottom:'1px solid #1A1A1A',display:'flex',alignItems:'center',padding:'12px 40px',gap:24 }}>
        <button onClick={()=>router.push(`/${lang}/dashboard`)} style={{ display:'flex',alignItems:'center',gap:8,background:'none',border:'none',color:'#848E9C',cursor:'pointer',fontFamily:'inherit',fontSize:14 }}><Ic d="M19 12H5M12 19l-7-7 7-7" s={18} /> Dashboard</button>
        <img src={`${CDN_URL}/logo.svg`} alt="Ancestro" style={{ height:30 }} />
        <span style={{ color:'#EAECEF',fontSize:16,fontWeight:700 }}>Leaderboard</span>
      </div>

      <div style={{ maxWidth:1200,margin:'0 auto',padding:'100px 40px 80px' }}>
        <div style={{ textAlign:'center',marginBottom:48 }}>
          <span style={{ color:'#F59E0B',fontSize:13,fontWeight:800,letterSpacing:2,textTransform:'uppercase' }}>Top Affiliates</span>
          <h1 style={{ color:'#EAECEF',fontSize:'clamp(32px,5vw,48px)',fontWeight:800,letterSpacing:-1,margin:'12px 0 8px' }}>Leaderboard</h1>
          <p style={{ color:'#848E9C',fontSize:15 }}>Ranked by total commission earned</p>
        </div>

        {loading && <div style={{ textAlign:'center',color:'#848E9C',padding:60 }}>Loading…</div>}
        {!loading && rows.length === 0 && (
          <div style={{ textAlign:'center',color:'#848E9C',padding:60,fontSize:14 }}>No affiliates yet. Be the first!</div>
        )}

        {!loading && top3.length > 0 && (
          <div style={{ display:'flex',alignItems:'flex-end',justifyContent:'center',gap:20,marginBottom:48,minHeight:280,flexWrap:'wrap' }}>
            {top3.map((p) => {
              const height = p.rank === 1 ? 240 : p.rank === 2 ? 180 : 140;
              const order = p.rank === 2 ? 0 : p.rank === 1 ? 1 : 2;
              return (
                <div key={p.user_id} style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:10,order }}>
                  <div style={{ width:48,height:48,borderRadius:24,background: p.isYou ? '#F59E0B' : p.color, display:'flex',alignItems:'center',justifyContent:'center',color:p.isYou?'#0A0617':'#fff',fontSize:14,fontWeight:800,border:p.isYou?'3px solid #F59E0B':'none' }}>
                    {p.isYou ? 'YOU' : initials(p.name)}
                  </div>
                  <span style={{ color: p.isYou ? '#F59E0B' : '#EAECEF',fontSize:15,fontWeight:700 }}>{p.name}{p.isYou ? ' (You)' : ''}</span>
                  <div style={{ width:140,height,background:`linear-gradient(180deg,${p.color}40,#000)`,borderRadius:'12px 12px 0 0',border:`2px solid ${p.color}60`,borderBottom:'none',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-end',paddingBottom:16 }}>
                    <span style={{ color: p.isYou ? '#F59E0B' : '#EAECEF',fontSize:24,fontWeight:800,letterSpacing:-0.5 }}>{fmtMoney(p.revenue)}</span>
                    <span style={{ color:'#848E9C',fontSize:12 }}>{p.refs} referrals</span>
                  </div>
                  <div style={{ width:36,height:36,borderRadius:18,background:p.color,display:'flex',alignItems:'center',justifyContent:'center',color:p.color==='#F59E0B'?'#0A0617':'#fff',fontSize:16,fontWeight:800,marginTop:-8 }}>#{p.rank}</div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && list.length > 0 && (
          <div style={{ background:'#0E0E10',borderRadius:18,border:'1px solid #1A1A1A',overflow:'hidden' }}>
            {list.map((p, i) => (
              <div key={p.user_id} style={{ display:'flex',alignItems:'center',gap:16,padding:'16px 24px',borderBottom:i<list.length-1?'1px solid #0A0A0A':'none',background:p.isYou?'#FBBF240C':'transparent' }}>
                <span style={{ color:p.isYou?'#F59E0B':'#848E9C',fontSize:14,fontWeight:700,width:32 }}>#{p.rank}</span>
                <div style={{ width:36,height:36,borderRadius:18,background:'#FBBF2420',display:'flex',alignItems:'center',justifyContent:'center',color:'#F59E0B',fontSize:13,fontWeight:800 }}>{initials(p.name)}</div>
                <span style={{ color:p.isYou?'#F59E0B':'#EAECEF',fontSize:14,fontWeight:600,flex:1 }}>{p.name}{p.isYou?' (You)':''}</span>
                <span style={{ color:'#848E9C',fontSize:12,width:80,textAlign:'center' }}>{p.refs} refs</span>
                <span style={{ color:'#EAECEF',fontSize:14,fontWeight:800,width:100,textAlign:'right' }}>{fmtMoney(p.revenue)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const btnP: React.CSSProperties = { display:'flex',alignItems:'center',gap:6,padding:'0 18px',height:40,background:'#F59E0B',borderRadius:10,border:'none',cursor:'pointer',color:'#0A0617',fontSize:14,fontWeight:700,fontFamily:'inherit' };
