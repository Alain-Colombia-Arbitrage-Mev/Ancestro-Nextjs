import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

interface PageProps { params: Promise<{ lang: string }> }

export default async function ForgotPasswordPage({ params }: PageProps) {
  const { lang } = await params;
  return (
    <div className="page-wrapper">
      <Navbar lang={lang} />
      <ForgotPasswordForm lang={lang} />
      <Footer lang={lang} />
    </div>
  );
}
