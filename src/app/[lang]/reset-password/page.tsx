import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

interface PageProps { params: Promise<{ lang: string }> }

export default async function ResetPasswordPage({ params }: PageProps) {
  const { lang } = await params;
  return (
    <div className="page-wrapper">
      <Navbar lang={lang} />
      <ResetPasswordForm lang={lang} />
      <Footer lang={lang} />
    </div>
  );
}
