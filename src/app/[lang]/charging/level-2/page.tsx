import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChargingL2Page from '@/components/charging-l2/ChargingL2Page';

export const dynamic = 'force-static';

interface PageProps { params: Promise<{ lang: string }> }

export default async function ChargingLevel2({ params }: PageProps) {
  const { lang } = await params;
  return (
    <div className="page-wrapper">
      <Navbar lang={lang} />
      <main id="main-content" style={{ paddingTop: 0, minHeight: '100vh', background: '#000' }}>
        <ChargingL2Page lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  );
}
