import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PresalePage from '@/components/presale/PresalePage';
import { t } from '@/i18n/translations';
import { CDN_URL } from '@/lib/cdn';
import type { Metadata } from 'next';

interface PageProps { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: t(lang, 'presale.meta.title'),
    description: t(lang, 'presale.meta.description'),
  };
}

export default async function Presale({ params }: PageProps) {
  const { lang } = await params;
  return (
    <div className="presale-page">
      <Navbar lang={lang} />
      <main id="main-content" role="main" style={{ paddingTop: '79px' }}>
        <PresalePage lang={lang} />
      </main>
      <Footer lang={lang} backgroundImage={`${CDN_URL}/images/footer-bg.webp`} />

      <style>{`
        .presale-page{background-color:var(--color-black);min-height:100vh}
      `}</style>
    </div>
  );
}
