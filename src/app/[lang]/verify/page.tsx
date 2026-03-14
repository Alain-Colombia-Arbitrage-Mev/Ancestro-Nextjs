import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VerifyForm from '@/components/auth/VerifyForm';

interface PageProps { params: Promise<{ lang: string }> }

export default async function VerifyPage({ params }: PageProps) {
  const { lang } = await params;
  return (
    <div className="page-wrapper">
      <Navbar lang={lang} />
      <VerifyForm lang={lang} />
      <Footer lang={lang} />
    </div>
  );
}
