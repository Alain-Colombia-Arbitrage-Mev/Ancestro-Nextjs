import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InvestPage from '@/components/invest/InvestPage';
import { CDN_URL } from '@/lib/cdn';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function InvestRoute({ params }: PageProps) {
  const { lang } = await params;

  return (
    <>
      <div className="invest-page">
        <Navbar lang={lang} />
        <main id="main-content">
          <InvestPage lang={lang} />
        </main>
        <Footer lang={lang} backgroundImage={`${CDN_URL}/images/footer-bg.webp`} />
      </div>

      <style>{`
        .invest-page {
          background-color: var(--color-black);
          min-height: 100vh;
        }
        .invest-page main {
          padding-top: 79px;
        }
      `}</style>
    </>
  );
}
