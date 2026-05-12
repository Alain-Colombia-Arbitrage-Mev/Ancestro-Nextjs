'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { CDN_URL } from '@/lib/cdn';

interface Commission {
  id: number; role: string; percentage: number; updated_by: string; updated_at: string;
}

const Icons = {
  save: 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8',
  percent: 'M19 5L5 19 M6.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M17.5 20a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  'arrow-left': 'M19 12H5M12 19l-7-7 7-7',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
};

const Ic = ({ n, s = 24, c = 'currentColor' }: { n: keyof typeof Icons; s?: number; c?: string }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ color: c, flexShrink: 0 }}><path d={Icons[n]} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

const roleLabels: Record<string, { label: string; color: string; desc: string }> = {
  affiliate: { label: 'Affiliate', color: '#F59E0B', desc: 'Comisión por cada referido que instala paneles' },
  customer: { label: 'Customer', color: '#A78BFA', desc: 'Crédito por referir a otros clientes' },
  epc: { label: 'EPC Installer', color: '#02C076', desc: 'Porcentaje del pago por instalación completada' },
};

export default function AdminCommissionsPage({ params: _params }: { params: Promise<{ lang: string }> }) {
  const [lang, setLang] = useState('es');
  useEffect(() => { _params.then(p => setLang(p.lang)); }, [_params]);

  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState('');

  useEffect(() => { fetch('/api/admin/commissions').then(r => r.json()).then(d => { setCommissions(d); const v: Record<string,string>={}; d.forEach((c:Commission)=>{v[c.role]=String(c.percentage)}); setValues(v); }); }, []);

  if (isLoading) return <div style={{ minHeight:'100vh',background:'#000',display:'flex',alignItems:'center',justifyContent:'center',color:'#848E9C' }}>Loading...</div>;
  if (!user) return (
    <div style={{ minHeight:'100vh',background:'#000',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:20 }}>
      <Ic n="shield" s={64} c="#F59E0B" /><h2 style={{color:'#EAECEF',fontSize:24,fontWeight:800,margin:0}}>Login Required</h2>
      <button onClick={()=>router.push(`/${lang}/login`)} style={{...btnP}}>Sign In</button>
    </div>
  );

  async function save(role: string) {
    const pct = parseFloat(values[role]);
    if (isNaN(pct) || pct < 0 || pct > 100) { setMessage('Invalid percentage (0-100)'); return; }
    setSaving(s => ({ ...s, [role]: true }));
    try {
      const r = await fetch('/api/admin/commissions', { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ role, percentage:pct, updated_by:user!.email }) });
      const d = await r.json();
      setCommissions(prev => prev.map(c => c.role === role ? d : c));
      setMessage(`✓ ${roleLabels[role]?.label || role} updated to ${pct}%`);
      setTimeout(() => setMessage(''), 3000);
    } catch { setMessage('Error saving'); }
    setSaving(s => ({ ...s, [role]: false }));
  }

  return (
    <div style={{ minHeight:'100vh',background:'#000' }}>
      {/* Top bar */}
      <div style={{ position:'fixed',top:0,left:0,right:0,zIndex:100,background:'#0A0A0ACC',backdropFilter:'blur(20px)',borderBottom:'1px solid #1A1A1A',display:'flex',alignItems:'center',padding:'12px 40px',gap:24 }}>
        <button onClick={() => router.push(`/${lang}/dashboard`)} style={{ display:'flex',alignItems:'center',gap:8,background:'none',border:'none',color:'#848E9C',cursor:'pointer',fontFamily:'inherit',fontSize:14 }}>
          <Ic n="arrow-left" s={18} /> Back to Dashboard
        </button>
        <img src={`${CDN_URL}/logo.svg`} alt="Ancestro" style={{ height:30 }} />
        <span style={{ color:'#EAECEF',fontSize:16,fontWeight:700 }}>Referral Commissions</span>
      </div>

      <div style={{ maxWidth:800,margin:'0 auto',padding:'100px 40px 80px' }}>
        <h1 style={{ color:'#EAECEF',fontSize:36,fontWeight:800,letterSpacing:-0.5,marginBottom:8 }}>Commission Settings</h1>
        <p style={{ color:'#848E9C',fontSize:14,marginBottom:32,lineHeight:1.5 }}>Set the commission percentage for each role. Changes apply immediately.</p>
        {message && <div style={{ padding:12,background:message.startsWith('✓')?'#02C07620':'#EF444420',border:`1px solid ${message.startsWith('✓')?'#02C07640':'#EF444440'}`,borderRadius:10,color:message.startsWith('✓')?'#02C076':'#EF4444',fontSize:13,fontWeight:600,marginBottom:24 }}>{message}</div>}

        <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
          {commissions.map(c => {
            const meta = roleLabels[c.role] || { label: c.role, color: '#848E9C', desc: '' };
            return (
              <div key={c.role} style={{ display:'flex',alignItems:'center',gap:20,padding:24,background:'#0E0E10',borderRadius:18,border:`1px solid ${meta.color}40` }}>
                <div style={{ width:48,height:48,borderRadius:14,background:`${meta.color}20`,border:`1px solid ${meta.color}40`,display:'flex',alignItems:'center',justifyContent:'center' }}>
                  <Ic n="percent" s={24} c={meta.color} />
                </div>
                <div style={{ flex:1 }}>
                  <span style={{ color:'#EAECEF',fontSize:16,fontWeight:800 }}>{meta.label}</span>
                  <p style={{ color:'#848E9C',fontSize:12,margin:'4px 0 0' }}>{meta.desc}</p>
                </div>
                <div style={{ display:'flex',alignItems:'center',gap:8 }}>
                  <input
                    type="number" min="0" max="100" step="0.5"
                    value={values[c.role] || ''}
                    onChange={e => setValues(v => ({ ...v, [c.role]: e.target.value }))}
                    style={{ width:80,padding:'10px 14px',background:'#0A0A0A',border:`1px solid ${meta.color}40`,borderRadius:10,color:'#EAECEF',fontSize:18,fontWeight:800,fontFamily:'inherit',textAlign:'center',outline:'none' }}
                  />
                  <span style={{ color:'#848E9C',fontSize:14,fontWeight:600 }}>%</span>
                  <button onClick={() => save(c.role)} disabled={saving[c.role]} style={{
                    display:'flex',alignItems:'center',gap:6,padding:'0 20px',height:44,
                    background:meta.color,borderRadius:10,border:'none',cursor:'pointer',
                    color:'#0A0617',fontSize:14,fontWeight:800,fontFamily:'inherit',
                    opacity:saving[c.role]?0.6:1,
                  }}>
                    <Ic n="save" s={16} />{saving[c.role] ? '...' : 'Save'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const btnP: React.CSSProperties = { display:'flex',alignItems:'center',gap:6,padding:'0 18px',height:40,background:'#F59E0B',borderRadius:10,border:'none',cursor:'pointer',color:'#0A0617',fontSize:14,fontWeight:700,fontFamily:'inherit' };