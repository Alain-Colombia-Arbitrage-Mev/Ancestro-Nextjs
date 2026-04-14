import { IMG_L3 } from '../constants';

const features = [
  { title: 'Speed', desc: 'High-power DC charging up to approximately 180 kW, supporting modern EVs and rapid vehicle turnover.', icon: `${IMG_L3}/icon-speed.png` },
  { title: 'Public-Grade Design', desc: 'Commercial-grade hardware engineered for continuous operation, outdoor environments, and high utilization.', icon: `${IMG_L3}/icon-design.png` },
  { title: 'Smart Operations', desc: 'Remote monitoring, load management, and real-time status through the Ancestro platform.', icon: `${IMG_L3}/icon-smart.png` },
];

const sectionStyle: React.CSSProperties = {
  background: '#0a0a0a',
  position: 'relative',
  zIndex: 1,
  isolation: 'isolate',
  padding: '80px 32px',
  textAlign: 'center',
};

const cardStyle: React.CSSProperties = {
  flex: 1,
  padding: '50px 30px',
  borderRadius: 10,
  background: 'linear-gradient(180deg, rgba(255,255,255,.1) 0%, rgba(255,255,255,0) 100%)',
  border: '1px solid rgba(255,255,255,.1)',
  backdropFilter: 'blur(26px)',
  WebkitBackdropFilter: 'blur(26px)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 30,
};

export default function PerformanceL3({ lang }: { lang: string }) {
  return (
    <section style={sectionStyle}>
      <h2 style={{ fontSize: 36, fontWeight: 700, color: '#fff', margin: '0 0 40px', letterSpacing: '-.5px' }}>
        Performance & reliability (Trust)
      </h2>
      <div className="cl3-perf-grid" style={{ display: 'flex', flexDirection: 'row', gap: 50, justifyContent: 'center', maxWidth: 1128, margin: '0 auto 30px' }}>
        {features.map((f) => (
          <div key={f.title} style={cardStyle}>
            <img src={f.icon} alt={f.title} style={{ width: 75, height: 75, objectFit: 'contain' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <h3 style={{ fontSize: 24, fontWeight: 500, color: '#fff', margin: 0 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', margin: 0, lineHeight: 1.5, fontWeight: 500, maxWidth: 220, textAlign: 'center' }}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 15, color: '#b0b0b0', margin: 0, letterSpacing: '-.17px' }}>
        No brand names. No hardware sales language.
      </p>
    </section>
  );
}
