'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { CDN_URL } from '@/lib/cdn';

const Ic = ({ d, s = 24, c = 'currentColor' }: { d: string; s?: number; c?: string }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ color: c, flexShrink: 0 }}>
    <path d={d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const btnP: React.CSSProperties = { display:'flex',alignItems:'center',gap:8,padding:'0 32px',height:54,background:'linear-gradient(135deg,#FBBF24,#F59E0B)',borderRadius:14,border:'none',cursor:'pointer',color:'#0A0617',fontSize:16,fontWeight:800,fontFamily:'inherit' };
const btnS: React.CSSProperties = { ...btnP, background:'#FFFFFF08', border:'1px solid #FFFFFF18', color:'#fff' };

type Step = 'welcome' | 'channels' | 'link' | 'location' | 'done';
const TOTAL = 4;

export default function OnboardingWizard({ lang }: { lang: string }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<Step>('welcome');
  const [channel, setChannel] = useState('');
  const [refLink, setRefLink] = useState('');
  const [pin, setPin] = useState('');

  if (isLoading) return <div style={{minHeight:'100vh',background:'#000',display:'flex',alignItems:'center',justifyContent:'center',color:'#848E9C'}}>Loading...</div>;
  if (!user) return <div style={{minHeight:'100vh',background:'#000',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:20}}><Ic d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" s={64} c="#F59E0B" /><h2 style={{color:'#EAECEF',fontSize:24,fontWeight:800,margin:0}}>Login Required</h2><button onClick={()=>router.push(`/${lang}/login`)} style={btnP}>Sign In</button></div>;

  const stepNum = step === 'welcome' ? 1 : step === 'channels' ? 2 : step === 'link' ? 3 : step === 'location' ? 4 : 4;
  const progress = step === 'done' ? 100 : ((stepNum - 1) / TOTAL) * 100;

  const channels = [
    { id: 'whatsapp', label: 'WhatsApp', icon: 'M17 9V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2l3 3V9h4l-3-3', color: '#25D366' },
    { id: 'facebook', label: 'Facebook', icon: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z', color: '#1877F2' },
    { id: 'instagram', label: 'Instagram', icon: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01', color: '#E4405F' },
    { id: 'x', label: 'X / Twitter', icon: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z', color: '#fff' },
    { id: 'tiktok', label: 'TikTok', icon: 'M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5', color: '#ff0050' },
    { id: 'email', label: 'Email', icon: 'M22 6c0-1.1-.9-2-2-2H4a2 2 0 0 0-2 2m20 0v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6m20 0l-10 7L2 6', color: '#A78BFA' },
  ];

  return (
    <div style={{ minHeight:'100vh',background:'#000',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:20 }}>
      <img src={`${CDN_URL}/logo.svg`} alt="Ancestro" style={{ height:32,marginBottom:32 }} />

      {/* Progress */}
      <div style={{ width:560,height:4,background:'#FFFFFF14',borderRadius:2,marginBottom:32,overflow:'hidden' }}>
        <div style={{ width:`${progress}%`,height:'100%',background:'#F59E0B',borderRadius:2,transition:'width 0.4s ease' }} />
      </div>

      {/* ═══ WELCOME ═══ */}
      {step === 'welcome' && (
        <div style={{ maxWidth:680,textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:20 }}>
          <div style={{ width:100,height:100,borderRadius:50,background:'#FBBF2420',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:8 }}>
            <Ic d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" s={48} c="#F59E0B" />
          </div>
          <h1 style={{color:'#EAECEF',fontSize:'clamp(28px,4vw,48px)',fontWeight:800,letterSpacing:-1.4,margin:0}}>Welcome to Ancestro, {user.name?.split(' ')[0] || 'Partner'}!</h1>
          <p style={{ color:'#A1A1AA',fontSize:16,lineHeight:1.55,maxWidth:520,margin:0 }}>Let's get you set up to start earning. We'll walk you through 4 quick steps to activate your affiliate account.</p>
          <div style={{ display:'flex',gap:8,marginTop:8 }}>
            {['Link sharing','Commission tracking','Fast payouts','Dashboard access'].map((f,i)=>(<span key={i} style={{padding:'4px 12px',borderRadius:8,background:'#FBBF2410',border:'1px solid #FBBF2420',color:'#F59E0B',fontSize:12,fontWeight:600}}>{f}</span>))}
          </div>
          <button onClick={()=>setStep('channels')} style={btnP}>Get Started <Ic d="M5 12h14M12 5l7 7-7 7" s={18} /></button>
        </div>
      )}

      {/* ═══ CHANNELS ═══ */}
      {step === 'channels' && (
        <div style={{ maxWidth:800,textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:20 }}>
          <h2 style={{color:'#EAECEF',fontSize:32,fontWeight:800,letterSpacing:-1,margin:0}}>Where will you share?</h2>
          <p style={{ color:'#A1A1AA',fontSize:14,margin:0 }}>Pick your main channel. You can connect more later.</p>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,width:'100%',maxWidth:600,marginTop:8 }}>
            {channels.map(ch => (
              <button key={ch.id} onClick={()=>{setChannel(ch.id);setStep('link')}} style={{
                display:'flex',flexDirection:'column',alignItems:'center',gap:10,padding:'20px 16px',
                background:channel===ch.id?'#FBBF2418':'#FFFFFF06',borderRadius:16,
                border:`1.5px solid ${channel===ch.id?'#F59E0B40':'#FFFFFF14'}`,
                cursor:'pointer',fontFamily:'inherit',color:'#fff',transition:'all 0.2s ease',
              }}>
                <Ic d={ch.icon} s={28} c={channel===ch.id?'#F59E0B':ch.color} />
                <span style={{color:channel===ch.id?'#F59E0B':'#EAECEF',fontSize:14,fontWeight:600}}>{ch.label}</span>
              </button>
            ))}
          </div>
          <button onClick={()=>setStep('welcome')} style={btnS}>Back</button>
        </div>
      )}

      {/* ═══ LINK ═══ */}
      {step === 'link' && (
        <div style={{ maxWidth:600,textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:20 }}>
          <h2 style={{color:'#EAECEF',fontSize:32,fontWeight:800,letterSpacing:-1,margin:0}}>Your referral link</h2>
          <p style={{ color:'#A1A1AA',fontSize:14,margin:0 }}>This is your unique link. Share it everywhere.</p>
          <div style={{ display:'flex',alignItems:'center',gap:10,padding:'14px 20px',background:'#0A0A0A',borderRadius:14,border:'1px solid #F59E0B40',width:'100%' }}>
            <Ic d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" s={18} c="#F59E0B" />
            <span style={{color:'#F59E0B',fontSize:14,fontWeight:600,flex:1}}>{refLink || `ancestro.ai/r/${(user.email||'user').split('@')[0].substring(0,8)}-${Math.floor(Math.random()*9000)+1000}`}</span>
            <button onClick={()=>{navigator.clipboard.writeText(refLink||`ancestro.ai/r/example`)}} style={{...btnP,height:32,fontSize:12,padding:'0 14px'}}>Copy</button>
          </div>
          <button onClick={()=>setStep('location')} style={btnP}>Continue</button>
          <button onClick={()=>setStep('channels')} style={btnS}>Back</button>
        </div>
      )}

      {/* ═══ LOCATION ═══ */}
      {step === 'location' && (
        <div style={{ maxWidth:600,textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:20 }}>
          <h2 style={{color:'#EAECEF',fontSize:32,fontWeight:800,letterSpacing:-1,margin:0}}>Set your location</h2>
          <p style={{ color:'#A1A1AA',fontSize:14,margin:0 }}>This helps us show region-specific offers.</p>
          <input value={pin} onChange={e=>setPin(e.target.value)} placeholder="Enter your ZIP / Postal code" style={{
            width:'100%',maxWidth:400,padding:'16px 20px',background:'#FFFFFF06',border:'1.5px solid #FBBF2440',borderRadius:14,
            color:'#EAECEF',fontSize:16,fontFamily:'inherit',textAlign:'center',outline:'none',
          }} />
          <button onClick={()=>setStep('done')} style={btnP}>Complete Setup</button>
          <button onClick={()=>setStep('link')} style={btnS}>Back</button>
        </div>
      )}

      {/* ═══ DONE ═══ */}
      {step === 'done' && (
        <div style={{ maxWidth:560,textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:20 }}>
          <div style={{ width:120,height:120,borderRadius:60,background:'linear-gradient(135deg,#34D399,#10B981)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 20px 80px #10B98140' }}>
            <Ic d="M20 6L9 17l-5-5" s={60} c="#fff" />
          </div>
          <h1 style={{color:'#EAECEF',fontSize:36,fontWeight:800,letterSpacing:-1,margin:0}}>You're all set!</h1>
          <p style={{ color:'#A1A1AA',fontSize:16,lineHeight:1.55,maxWidth:480,margin:0 }}>Your affiliate account is ready. Start sharing your link and earning commissions.</p>
          <button onClick={()=>router.push(`/${lang}/dashboard`)} style={btnP}>Go to Dashboard <Ic d="M5 12h14M12 5l7 7-7 7" s={18} /></button>
        </div>
      )}
    </div>
  );
}