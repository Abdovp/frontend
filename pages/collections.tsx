import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { productList, WARRANTY_DAYS, CURRENCY, isProductAvailable } from '../lib/products';
import ProductImage from '../components/ui/ProductImage';
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
                <Link
                  key={p.id}
                  href={p.href}
                  className="card-elevated overflow-hidden group grid md:grid-cols-[11.5rem_1fr] lg:grid-cols-[13rem_1fr] md:items-stretch"
                >
                  <div className="relative w-full self-stretch flex flex-col bg-white border-b border-ink/[0.06] md:border-b-0 md:border-e md:border-ink/[0.06]">
                    <div className="relative w-full aspect-square overflow-hidden shrink-0">
                      <ProductImage
                        src={p.image}
                        alt={p.nameAr}
                        fallbackLabel={p.galleryLabels[0]}
                        aspect="square"
                        fit="cover"
                        objectPosition="center"
                        className="!rounded-none !border-0 bg-white h-full w-full"
                        imageClassName="group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      {p.offers.some((o) => o.badge === 'الأكثر مبيعاً') && (
                        <span className="absolute top-3 end-3 z-10 badge-pill bg-accent text-ink shadow-gold">
                          الأكثر مبيعاً
                        </span>
                      )}
                      {!isProductAvailable(p) && (
                        <span className="absolute top-3 start-3 z-10 badge-pill bg-red-600 text-white shadow-soft">
                          نفد المخزون
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col min-w-0">
                    <p className="text-xs font-bold text-accent-dark mb-1">{p.category}</p>
                    <h2 className="font-heading text-xl font-extrabold text-ink mb-2 group-hover:text-brand transition">
                      {p.nameAr}
                    </h2>
                    <p className="text-ink text-sm mb-3 leading-relaxed line-clamp-2">{p.tagline}</p>
                    <div className="flex items-center gap-1.5 mb-4 text-sm">
                      <Stars value={p.rating} size={14} />
                      <span className="text-ink/45">({p.reviewCount})</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div>
                        <p className="font-heading font-extrabold text-xl text-brand">
                          {isProductAvailable(p) ? (
                            <>
                              من {p.offers[0].price} <span className="text-sm">{CURRENCY}</span>
                            </>
                          ) : (
                            'غير متوفر حالياً'
                          )}
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
