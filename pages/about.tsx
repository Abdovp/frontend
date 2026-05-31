import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Icon, { type IconName } from '../components/ui/Icon';
import { STORE_PROOF, WARRANTY_DAYS } from '../lib/products';

const values: { icon: IconName; title: string; text: string }[] = [
  { icon: 'shield', title: 'الثقة', text: 'علاقات طويلة مبنية على الصدق والشفافية — ماشي على وعود فارغة.' },
  { icon: 'badge', title: 'الجودة', text: 'كنفحصو كل منتج بأنفسنا قبل ما نعرضوه عليك.' },
  { icon: 'spark', title: 'الاختيار', text: 'كنختارو غير المنتجات اللي خدامة فعلاً للسائق المغربي.' },
  { icon: 'whatsapp', title: 'القرب', text: 'دعم مغربي بالدارجة، قبل وبعد الطلب.' },
];

const stats = [
  { value: STORE_PROOF.customers, label: 'زبون راضي' },
  { value: STORE_PROOF.rating, label: 'متوسط التقييم' },
  { value: STORE_PROOF.delivery, label: 'سرعة التوصيل' },
];

export default function About() {
  return (
    <>
      <Head>
        <title>من نحن | بويا شوب</title>
        <meta name="description" content="تعرّف على قصة بويا شوب، رسالتنا وقيمنا ف عالم إكسسوارات السيارات بالمغرب." />
      </Head>
      <Header />
      <main>
        <section className="bg-brand text-white relative overflow-hidden">
          <div className="absolute inset-0 hero-grid-bg opacity-60" />
          <div className="relative container-wide py-16 md:py-24 max-w-3xl">
            <span className="pill-soft bg-white/10 text-white border-white/15 mb-5">قصتنا</span>
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold mb-5 leading-tight">
              متجر مغربي بنّيناه على الثقة، ماشي على الحظ
            </h1>
            <p className="text-white/75 text-lg leading-relaxed">
              بدينا بفكرة بسيطة: نوفرو لكل سائق مغربي إكسسوارات سيارات بجودة عالية وثمن عادل، بلا
              تقليد وبلا مخاطرة. كنبحثو على أحسن الموردين، كنجربو كل منتج بأنفسنا، وكنعرضوه عليك
              بالدفع عند الاستلام.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-10 max-w-lg">
              {stats.map((s) => (
                <div key={s.label} className="bg-white/[0.06] rounded-2xl p-4 text-center border border-white/10">
                  <p className="font-heading text-2xl font-extrabold text-accent">{s.value}</p>
                  <p className="text-xs text-white/65 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container-wide max-w-3xl">
            <h2 className="font-heading text-3xl font-extrabold text-ink mb-4">رسالتنا</h2>
            <p className="text-ink/65 text-lg leading-relaxed mb-5">
              كنّا نشوفو السائقين كيعانيو من نفس المشاكل، والحلول إما غالية بزاف ولا مقلدة. قررنا
              نغيّرو هاد الواقع: كل سائق مغربي يستاهل منتجات أصلية، أسعار شفافة، وخدمة كتحترمو.
            </p>
            <ul className="space-y-3">
              {['منتجات أصلية وموثوقة', 'أسعار عادلة وواضحة', 'دعم مغربي بالدارجة', `ضمان ${WARRANTY_DAYS} يوم براحة البال`].map((t) => (
                <li key={t} className="flex items-center gap-3 text-ink/80">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand/[0.08] text-brand shrink-0">
                    <Icon name="check" size={14} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section-padding bg-cream">
          <div className="container-wide">
            <h2 className="font-heading text-3xl font-extrabold text-ink mb-10 text-center">قيمنا</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v) => (
                <div key={v.title} className="card-elevated p-7">
                  <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-brand text-white shadow-brand mb-5">
                    <Icon name={v.icon} size={24} className="text-accent" />
                  </span>
                  <h3 className="font-heading font-bold text-lg text-ink mb-2">{v.title}</h3>
                  <p className="text-ink/60 leading-relaxed text-sm">{v.text}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/collections" className="btn-primary">
                اكتشف الكتالوج
                <Icon name="arrow-left" size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
