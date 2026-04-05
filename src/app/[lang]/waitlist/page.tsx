import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WaitlistForm from '@/components/WaitlistForm';
import { CDN_URL } from '@/lib/cdn';

interface PageProps { params: Promise<{ lang: string }> }

export default async function WaitlistPage({ params }: PageProps) {
  const { lang } = await params;
  return (
    <div className="page-wrapper">
      <Navbar lang={lang} />
      <main id="main-content" role="main">
        <WaitlistForm lang={lang} />
      </main>
      <Footer lang={lang} backgroundImage={`${CDN_URL}/images/footer-bg.webp`} />
    </div>
  );
}
