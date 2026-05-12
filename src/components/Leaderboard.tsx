'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { CDN_URL } from '@/lib/cdn';

const Ic = ({ d, s = 24, c = 'currentColor' }: { d: string; s?: number; c?: string }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ color: c, flexShrink: 0 }}>
    <path d={d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function LeaderboardPage({ lang }: { lang: string }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) return <div style={{ minHeight:'100vh',background:'#000',display:'flex',alignItems:'center',justifyContent:'center',color:'#848E9C' }}>Loading...</div>;
  if (!user) return <div style={{ minHeight:'100vh',background:'#000',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:20 }}><Ic d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" s={64} c="#F59E0B" /><h2 style={{color:'#EAECEF',fontSize:24,fontWeight:800,margin:0}}>Login Required</h2><button onClick={()=>router.push(`/${lang}/login`)} style={btnP}>Sign In</button></div>;

  const top3 = [
    { rank: 2, name: 'Sara Chen', revenue: '$24,500', refs: 48, color: '#C0C0C0' },
    { rank: 1, name: 'Marcus Rivera', revenue: '$38,200', refs: 72, color: '#F59E0B', isYou: true },
    { rank: 3, name: 'James Wilson', revenue: '$18,900', refs: 35, color: '#CD7F32' },
  ];
  const list = [
    { rank: 4, name: 'Priya Patel', revenue: '$15,200', refs: 28 },
    { rank: 5, name: 'Alex Thompson', revenue: '$12,800', refs: 22 },
    { rank: 6, name: 'Maria Garcia', revenue: '$9,400', refs: 18 },
    { rank: 7, name: 'David Kim', revenue: '$7,200', refs: 14 },
    { rank: 8, name: 'Emma Davis', revenue: '$5,100', refs: 10 },
  ];

  return (
    <div style={{ minHeight:'100vh',background:'#000' }}>
      <div style={{ position:'fixed',top:0,left:0,right:0,zIndex:100,background:'#0A0A0ACC',backdropFilter:'blur(20px)',borderBottom:'1px solid #1A1A1A',display:'flex',alignItems:'center',padding:'12px 40px',gap:24 }}>
        <button onClick={()=>router.push(`/${lang}/dashboard`)} style={{ display:'flex',alignItems:'center',gap:8,background:'none',border:'none',color:'#848E9C',cursor:'pointer',fontFamily:'inherit',fontSize:14 }}><Ic d="M19 12H5M12 19l-7-7 7-7" s={18} /> Dashboard</button>
        <img src={`${CDN_URL}/logo.svg`} alt="Ancestro" style={{ height:30 }} />
        <span style={{ color:'#EAECEF',fontSize:16,fontWeight:700 }}>Leaderboard</span>
      </div>

      <div style={{ maxWidth:1200,margin:'0 auto',padding:'100px 40px 80px' }}>
        <div style={{ textAlign:'center',marginBottom:48 }}>
          <span style={{ color:'#F59E0B',fontSize:13,fontWeight:800,letterSpacing:2,textTransform:'uppercase' }}>Top Affiliates · Q2 2025</span>
          <h1 style={{ color:'#EAECEF',fontSize:'clamp(32px,5vw,48px)',fontWeight:800,letterSpacing:-1,margin:'12px 0 8px' }}>Leaderboard</h1>
          <p style={{ color:'#848E9C',fontSize:15 }}>Ranked by total revenue generated</p>
        </div>

        {/* Podium */}
        <div style={{ display:'flex',alignItems:'flex-end',justifyContent:'center',gap:20,marginBottom:48,minHeight:280 }}>
          {[top3[0], top3[1], top3[2]].map((p, i) => {
            const heights = p.rank === 1 ? 240 : p.rank === 2 ? 180 : 140;
            const order = p.rank === 2 ? 0 : p.rank === 1 ? 1 : 2;
            return (
              <div key={p.rank} style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:10,order }}>
                <div style={{ width:48,height:48,borderRadius:24,background: p.isYou ? '#F59E0B' : p.color, display:'flex',alignItems:'center',justifyContent:'center',color:p.isYou?'#0A0617':'#fff',fontSize:14,fontWeight:800,border:p.isYou?'3px solid #F59E0B':'none' }}>
                  {p.isYou ? 'YOU' : p.name.split(' ')[0][0]+p.name.split(' ')[1]?.[0]}
                </div>
                <span style={{ color: p.isYou ? '#F59E0B' : '#EAECEF',fontSize:15,fontWeight:700 }}>{p.name}{p.isYou ? ' (You)' : ''}</span>
                <div style={{ width:140,height:heights,background:`linear-gradient(180deg,${p.color}40,#000)`,borderRadius:'12px 12px 0 0',border:`2px solid ${p.color}60`,borderBottom:'none',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-end',paddingBottom:16 }}>
                  <span style={{ color: p.isYou ? '#F59E0B' : '#EAECEF',fontSize:24,fontWeight:800,letterSpacing:-0.5 }}>{p.revenue}</span>
                  <span style={{ color:'#848E9C',fontSize:12 }}>{p.refs} referrals</span>
                </div>
                <div style={{ width:36,height:36,borderRadius:18,background:p.color,display:'flex',alignItems:'center',justifyContent:'center',color:p.color==='#F59E0B'?'#0A0617':'#fff',fontSize:16,fontWeight:800,marginTop:-8 }}>#{p.rank}</div>
              </div>
            );
          })}
        </div>

        {/* List */}
        <div style={{ background:'#0E0E10',borderRadius:18,border:'1px solid #1A1A1A',overflow:'hidden' }}>
          {list.map((p, i) => (
            <div key={p.rank} style={{ display:'flex',alignItems:'center',gap:16,padding:'16px 24px',borderBottom:i<list.length-1?'1px solid #0A0A0A':'none' }}>
              <span style={{ color:'#848E9C',fontSize:14,fontWeight:700,width:32 }}>#{p.rank}</span>
              <div style={{ width:36,height:36,borderRadius:18,background:'#FBBF2420',display:'flex',alignItems:'center',justifyContent:'center',color:'#F59E0B',fontSize:13,fontWeight:800 }}>{p.name[0]}</div>
              <span style={{ color:'#EAECEF',fontSize:14,fontWeight:600,flex:1 }}>{p.name}</span>
              <span style={{ color:'#848E9C',fontSize:12,width:80,textAlign:'center' }}>{p.refs} refs</span>
              <span style={{ color:'#EAECEF',fontSize:14,fontWeight:800,width:100,textAlign:'right' }}>{p.revenue}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const btnP: React.CSSProperties = { display:'flex',alignItems:'center',gap:6,padding:'0 18px',height:40,background:'#F59E0B',borderRadius:10,border:'none',cursor:'pointer',color:'#0A0617',fontSize:14,fontWeight:700,fontFamily:'inherit' };