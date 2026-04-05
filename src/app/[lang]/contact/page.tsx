import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { t } from '@/i18n/translations';

interface PageProps { params: Promise<{ lang: string }> }

export default async function ContactPage({ params }: PageProps) {
  const { lang } = await params;
  return (
    <div className="page-wrapper">
      <Navbar lang={lang} />
      <main id="main-content" style={{ paddingTop: 79 }}>
        <ContactForm lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  );
}
