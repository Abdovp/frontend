import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { productList, WARRANTY_DAYS, CURRENCY } from '../lib/products';
import ImagePlaceholder from '../components/ui/ImagePlaceholder';
import Icon, { Stars } from '../components/ui/Icon';

export default function Collections() {
  return (
    <>
      <Head>
        <title>منتجات السيارات | بويا شوب</title>
        <meta
          name="description"
          content="كتالوج بويا شوب لإكسسوارات السيارات: باك الحماية من السخونة وحامل الهاتف المغناطيسي. أسعار واضحة، ضمان 30 يوم، دفع عند الاستلام."
        />
      </Head>
      <Header />
      <main>
        <section className="bg-brand text-white relative overflow-hidden">
          <div className="absolute inset-0 hero-grid-bg opacity-60" />
          <div className="relative container-wide py-16 md:py-20 text-center">
            <span className="pill-soft bg-white/10 text-white border-white/15 mb-5">
              <Icon name="badge" size={16} className="text-accent" /> الكتالوج
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold mb-4">منتجات بويا شوب</h1>
            <p className="text-white/75 max-w-xl mx-auto text-lg">
              إكسسوارات سيارات مختارة بعناية — متوفرة دابا، ومزيد من المجموعات ف الطريق.
            </p>
          </div>
        </section>

        <section className="section-padding bg-cream">
          <div className="container-wide">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {productList.map((p) => (
                <Link key={p.id} href={p.href} className="card-elevated overflow-hidden group flex flex-col sm:flex-row">
                  <div className="sm:w-2/5 relative">
                    <ImagePlaceholder
                      label={p.galleryLabels[0]}
                      sublabel=""
                      aspect="square"
                      className="!rounded-none !border-0 h-full"
                    />
                    {p.offers.some((o) => o.badge === 'الأكثر مبيعاً') && (
                      <span className="absolute top-3 end-3 badge-pill bg-accent text-ink shadow-gold">الأكثر مبيعاً</span>
                    )}
                  </div>
                  <div className="p-6 sm:w-3/5 flex flex-col">
                    <p className="text-xs font-bold text-accent-dark mb-1">{p.category}</p>
                    <h2 className="font-heading text-xl font-extrabold text-ink mb-2 group-hover:text-brand transition">
                      {p.nameAr}
                    </h2>
                    <p className="text-ink/60 text-sm mb-3 leading-relaxed line-clamp-2">{p.tagline}</p>
                    <div className="flex items-center gap-1.5 mb-4 text-sm">
                      <Stars value={p.rating} size={14} />
                      <span className="text-ink/45">({p.reviewCount})</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div>
                        <p className="font-heading font-extrabold text-xl text-brand">
                          من {p.offers[0].price} <span className="text-sm">{CURRENCY}</span>
                        </p>
                        <p className="text-xs text-ink/45 mt-0.5">ضمان {WARRANTY_DAYS} يوم · دفع عند الاستلام</p>
                      </div>
                      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-brand text-white group-hover:bg-brand-dark transition shrink-0">
                        <Icon name="arrow-left" size={18} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
