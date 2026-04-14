import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChargingL3Page from '@/components/charging-l3/ChargingL3Page';

// Force static rendering - no streaming
export const dynamic = 'force-static';

interface PageProps { params: Promise<{ lang: string }> }

export default async function ChargingLevel3({ params }: PageProps) {
  const { lang } = await params;
  return (
    <div className="page-wrapper">
      <Navbar lang={lang} />
      <main id="main-content" style={{ paddingTop: 0, minHeight: '100vh', background: '#000' }}>
        <ChargingL3Page lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  );
}
