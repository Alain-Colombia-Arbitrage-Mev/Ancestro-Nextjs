import { IMG_L3 } from '../constants';

export default function DriverExperience({ lang }: { lang: string }) {
  return (
    <section style={{
      background: '#000',
      position: 'relative',
      zIndex: 1,
      isolation: 'isolate',
      padding: '80px 32px 0',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto 40px' }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, color: '#fff', margin: '0 0 16px', letterSpacing: '-.5px' }}>
          DRIVER EXPERIENCE
        </h2>
        <p style={{ fontSize: 16, color: '#b0b0b0', margin: '0 0 8px', lineHeight: 1.5 }}>
          Drivers use a single, familiar app to find, reserve, and charge across the Ancestro network—with transparent pricing and simple pay-as-you-go billing.
        </p>
        <p style={{ fontSize: 16, color: '#b0b0b0', margin: 0, lineHeight: 1.5 }}>
          The familiarity of the network builds repeat usage and trust over time.
        </p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', maxWidth: 900, margin: '0 auto' }}>
        <img
          src={`${IMG_L3}/app-phone.webp`}
          alt="Ancestro Charging App"
          style={{ maxWidth: '100%', height: 'auto', maxHeight: 700, objectFit: 'contain' }}
        />
      </div>
    </section>
  );
}
