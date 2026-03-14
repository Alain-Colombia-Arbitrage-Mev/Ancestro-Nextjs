import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RegisterForm from '@/components/auth/RegisterForm';

interface PageProps { params: Promise<{ lang: string }> }

export default async function RegisterPage({ params }: PageProps) {
  const { lang } = await params;
  return (
    <div className="page-wrapper">
      <Navbar lang={lang} />
      <RegisterForm lang={lang} />
      <Footer lang={lang} />
    </div>
  );
}
