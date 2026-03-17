import { redirect } from 'next/navigation';
interface PageProps { params: Promise<{ lang: string }> }
export default async function ContactPage({ params }: PageProps) {
  const { lang } = await params;
  redirect(`/${lang}/invest`);
}
