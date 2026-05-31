import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import Icon from '../components/ui/Icon';
import { STORE_PROOF } from '../lib/products';

export default function ThankYou() {
  return (
    <>
      <Head>
        <title>شكراً لك | بويا شوب</title>
        <meta name="description" content="تم استقبال طلبك بنجاح. شكراً لاختيارك بويا شوب." />
      </Head>
      <Header />
      <main className="flex items-center justify-center bg-cream py-20 px-4 min-h-[70vh]">
        <div className="max-w-md w-full card-elevated p-8 text-center">
          <span className="mx-auto mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 text-emerald-600">
            <Icon name="check-circle" size={42} />
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-ink mb-3">تم استلام طلبك!</h1>
          <p className="text-ink/60 mb-6 text-lg">
            شكراً على ثقتك. الفريق ديالنا غادي يتصل بيك قريباً لتأكيد الطلب والتوصيل.
          </p>

          <div className="bg-cream rounded-2xl p-5 mb-6 text-start space-y-3 text-sm">
            {[
              { icon: 'whatsapp', text: 'غادي نأكدو الطلب عبر واتساب أو الهاتف' },
              { icon: 'truck', text: `التوصيل المتوقع خلال ${STORE_PROOF.delivery}` },
              { icon: 'wallet', text: 'الدفع عند الاستلام — بلا دفع مسبق' },
            ].map((r) => (
              <p key={r.text} className="flex items-center gap-3 text-ink/70">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand text-white shrink-0">
                  <Icon name={r.icon as 'truck'} size={16} className="text-accent" />
                </span>
                {r.text}
              </p>
            ))}
          </div>

          <Link href="/" className="btn-primary w-full mb-3">العودة للرئيسية</Link>
          <Link href="/collections" className="btn-outline w-full">تصفّح منتجات أخرى</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
