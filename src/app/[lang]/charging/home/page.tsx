import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChargingHomePage from '@/components/charging-home/ChargingHomePage';

export const dynamic = 'force-static';

interface PageProps { params: Promise<{ lang: string }> }

export default async function ChargingHome({ params }: PageProps) {
  const { lang } = await params;
  return (
    <div className="page-wrapper">
      <Navbar lang={lang} />
      <main id="main-content" style={{ paddingTop: 0, minHeight: '100vh', background: '#000' }}>
        <ChargingHomePage lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  );
}
