import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TeamSection from '@/components/TeamSection';
import { t } from '@/i18n/translations';

interface PageProps { params: Promise<{ lang: string }> }

export default async function TeamPage({ params }: PageProps) {
  const { lang } = await params;
  return (
    <div className="page-wrapper">
      <Navbar lang={lang} />
      <main id="main-content" style={{ paddingTop: 79, minHeight: '100vh', background: 'var(--color-black)' }}>
        <TeamSection lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  );
}
