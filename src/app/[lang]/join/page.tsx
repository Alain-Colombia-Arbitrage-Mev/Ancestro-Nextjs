import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JoinPanel from '@/components/JoinPanel';
import { t } from '@/i18n/translations';
import { CDN_URL } from '@/lib/cdn';
import type { Metadata } from 'next';

interface PageProps { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: t(lang, 'join.meta.title'),
    description: t(lang, 'join.meta.description'),
  };
}

export default async function JoinPage({ params }: PageProps) {
  const { lang } = await params;
  return (
    <div className="page-wrapper">
      <Navbar lang={lang} />
      <main id="main-content" role="main">
        <JoinPanel lang={lang} />
      </main>
      <Footer lang={lang} backgroundImage={`${CDN_URL}/images/footer-bg.webp`} />
    </div>
  );
}
