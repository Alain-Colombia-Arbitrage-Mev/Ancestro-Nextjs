import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoginForm from '@/components/auth/LoginForm';

interface PageProps { params: Promise<{ lang: string }> }

export default async function LoginPage({ params }: PageProps) {
  const { lang } = await params;
  return (
    <div className="page-wrapper">
      <Navbar lang={lang} />
      <LoginForm lang={lang} />
      <Footer lang={lang} />
    </div>
  );
}
