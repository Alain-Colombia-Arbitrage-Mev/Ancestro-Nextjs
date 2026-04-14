import { IMG_L3 } from '../constants';

export default function SoftwareNetwork({ lang }: { lang: string }) {
  return (
    <section className="cl3-software" style={{
      position: 'relative',
      zIndex: 1,
      isolation: 'isolate',
      display: 'flex',
      alignItems: 'center',
      gap: 58,
      padding: 0,
      minHeight: 487,
      background: '#000',
    }}>
      <div className="cl3-software-text" style={{
        flex: '0 0 468px',
        padding: '0 0 0 80px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-.5px' }}>
          Powered by Software. Protected by the Network.
        </h2>
        <p style={{ fontSize: 16, color: '#a3a3a3', margin: 0, lineHeight: 1.35 }}>
          Every Level 3 charger hosted through Ancestro is fully managed by the platform. Ancestro handles monitoring, maintenance coordination, software updates, billing, customer access, and network operations. Property owners do not manage hardware, drivers, or payments.
        </p>
        <p style={{ fontSize: 16, color: '#a3a3a3', margin: 0, lineHeight: 1.35 }}>
          What differentiates Ancestro is not the charger—it&apos;s the software layer and trusted network behind it.
        </p>
      </div>
      <div className="cl3-software-img" style={{
        flex: 1,
        minHeight: 487,
        borderRadius: '20px 0 0 20px',
        backgroundImage: `url(${IMG_L3}/software-bg.webp)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: '1px solid rgba(255,255,255,.1)',
        borderRight: 'none',
      }} />
    </section>
  );
}
