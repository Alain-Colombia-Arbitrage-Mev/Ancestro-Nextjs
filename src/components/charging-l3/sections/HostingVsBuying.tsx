const cardBase: React.CSSProperties = {
  flex: 1,
  padding: '100px 50px',
  borderRadius: 10,
  background: 'linear-gradient(180deg, rgba(255,255,255,.1) 0%, rgba(255,255,255,0) 100%)',
  border: '1px solid rgba(255,255,255,.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 50,
};

const glassCta: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '12px 20px',
  background: 'rgba(255,255,255,.1)',
  backdropFilter: 'blur(26px)',
  WebkitBackdropFilter: 'blur(26px)',
  border: '1px solid rgba(255,255,255,.1)',
  borderRadius: 15,
  color: '#fff',
  fontSize: 15,
  fontWeight: 600,
  textDecoration: 'none',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all .3s ease',
};

const primaryCta: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '12px 20px',
  background: '#f8b03b',
  border: '1px solid transparent',
  borderRadius: 15,
  color: '#000',
  fontSize: 15,
  fontWeight: 600,
  textDecoration: 'none',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all .3s ease',
};

export default function HostingVsBuying({ lang }: { lang: string }) {
  return (
    <section style={{ background: '#0a0a0a', position: 'relative', zIndex: 1, isolation: 'isolate', padding: '80px 32px', textAlign: 'center' }}>
      <h2 style={{ fontSize: 36, fontWeight: 700, color: '#fff', margin: '0 0 50px', letterSpacing: '-.5px' }}>
        HOSTING VS BUYING
      </h2>
      <div className="cl3-hosting-grid" style={{ display: 'flex', flexDirection: 'row', gap: 50, justifyContent: 'center', maxWidth: 1128, margin: '0 auto' }}>
        {/* Buy Card */}
        <div style={cardBase}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, flex: 1 }}>
            <h3 style={{ fontSize: 24, fontWeight: 500, color: '#fff', margin: 0, textAlign: 'center' }}>Host with Ancestro</h3>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,.5)', margin: 0, lineHeight: 1.5, textAlign: 'center' }}>
              Purchase and own the equipment directly. Ancestro provides software integration, network access, and operational support. Best suited for operators who prefer direct ownership and capital deployment.
            </p>
          </div>
          <a href={`/${lang}/join?profile=energy`} style={glassCta}>Buy a Charger</a>
        </div>

        {/* Host Card (featured) */}
        <div style={{ ...cardBase, borderColor: 'rgba(248,176,59,.2)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, flex: 1 }}>
            <h3 style={{ fontSize: 26, fontWeight: 500, color: '#fff', margin: 0, textAlign: 'center' }}>Host with Ancestro</h3>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,.5)', margin: 0, lineHeight: 1.5, textAlign: 'center', fontWeight: 500 }}>
              Host a Level 3 charger with zero upfront cost. Ancestro funds the equipment and installation, manages operations and maintenance, and integrates the charger into the Ancestro Charging Network. Property owners earn a passive revenue share while avoiding capital risk.
            </p>
          </div>
          <a href={`/${lang}/join?profile=host`} style={primaryCta}>Apply to Host</a>
        </div>
      </div>
    </section>
  );
}
