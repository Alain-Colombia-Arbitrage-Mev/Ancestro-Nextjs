import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PresalePage from '@/components/presale/PresalePage';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function PresaleRoute({ params }: PageProps) {
  const { lang } = await params;

  return (
    <>
      <div className="presale-page">
        <Navbar lang={lang} />
        <main id="main-content">
          <PresalePage lang={lang} />
        </main>
        <Footer lang={lang} backgroundImage={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/images/footer-bg.webp`} />
      </div>

      <style>{`
        .presale-page {
          background-color: var(--color-black);
          min-height: 100vh;
        }
        .presale-page main {
          padding-top: 79px;
        }
      `}</style>
    </>
  );
}
