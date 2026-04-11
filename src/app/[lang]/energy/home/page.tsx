import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EnergyHomePage from '@/components/energy/EnergyHomePage';

interface PageProps { params: Promise<{ lang: string }> }

export default async function EnergyHome({ params }: PageProps) {
  const { lang } = await params;
  return (
    <div className="page-wrapper">
      <Navbar lang={lang} />
      <main id="main-content" style={{ paddingTop: 0, minHeight: '100vh', background: 'var(--color-black)' }}>
        <EnergyHomePage lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  );
}
