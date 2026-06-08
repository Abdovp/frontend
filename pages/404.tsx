import Link from 'next/link';
import Head from 'next/head';

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>الصفحة غير موجودة | بويا شوب</title>
      </Head>
      <div className="min-h-screen bg-cream flex items-center justify-center px-4" dir="rtl">
        <div className="text-center max-w-md">
          <p className="font-heading text-6xl font-extrabold text-brand mb-3">404</p>
          <h1 className="font-heading text-2xl font-bold text-ink mb-2">الصفحة ما لقيناهاش</h1>
          <p className="text-ink mb-8">الرابط اللي دخلتي ليه ما كاينش. رجع للرئيسية أو شوف المنتجات.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary">
              الرئيسية
            </Link>
            <Link href="/collections" className="btn-outline">
              المنتجات
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
