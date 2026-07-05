import Link from 'next/link';
import { isProductAvailable, productList } from '../lib/products';
import ProductImage from './ui/ProductImage';
import Icon, { Stars } from './ui/Icon';

const comingSoon = [
  { name: 'مجموعة العناية والتنظيف', category: 'عناية بالسيارة' },
  { name: 'إضاءة LED داخلية', category: 'إكسسوارات' },
];

export default function FeaturedProducts() {
  return (
    <section className="section-padding bg-cream section-texture">
      <div className="container-wide">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="eyebrow mb-5 justify-center">
            الأكثر طلباً
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.85rem] font-extrabold text-ink leading-[1.12]">
            منتجات كيختاروها السائقين كل يوم
          </h2>
          <p className="text-ink/75 mt-4 text-lg">
            مجموعة مختارة بعناية — مفحوصة، مضمونة، وجاهزة للتوصيل بالدفع عند الاستلام.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productList.map((p) => (
            <Link key={p.id} href={p.href} className="card-elevated overflow-hidden group flex flex-col">
              <div className="relative">
                <ProductImage
                  src={p.image}
                  alt={p.nameAr}
                  fallbackLabel={p.galleryLabels[0]}
                  fallbackSublabel={p.category}
                  aspect="square"
                  fit="cover"
                  objectPosition="center"
                  className="!rounded-none !border-0 border-b border-ink/[0.06] bg-white"
                  imageClassName="group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {p.offers.some((o) => o.badge === 'الأكثر مبيعاً') && (
                  <span className="absolute top-3 end-3 badge-pill bg-accent text-ink shadow-gold">
                    الأكثر مبيعاً
                  </span>
                )}
                {!isProductAvailable(p) && (
                  <span className="absolute top-3 start-3 badge-pill bg-red-600 text-white">
                    نفد المخزون
                  </span>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <p className="text-xs text-accent-dark font-bold mb-1">{p.category}</p>
                <h3 className="font-heading font-bold text-ink mb-2 group-hover:text-brand transition line-clamp-2">
                  {p.nameAr}
                </h3>
                <div className="flex items-center gap-1.5 mb-4 text-sm">
                  <Stars value={p.rating} size={14} />
                  <span className="text-ink/45">({p.reviewCount})</span>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <p className="font-heading font-extrabold text-lg text-brand">
                    {isProductAvailable(p) ? (
                      <>
                        من {p.offers[0].price} <span className="text-sm">درهم</span>
                      </>
                    ) : (
                      'غير متوفر حالياً'
                    )}
                  </p>
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-brand text-white shadow-brand group-hover:bg-brand-dark transition-colors">
                    <Icon name="arrow-left" size={18} />
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {comingSoon.map((item) => (
            <div key={item.name} className="card-flat overflow-hidden flex flex-col opacity-70">
              <div className="aspect-square bg-ink/[0.03] flex items-center justify-center border-b border-ink/[0.06] text-ink/25">
                <Icon name="spark" size={40} />
              </div>
              <div className="p-5">
                <p className="text-xs text-ink/45 font-bold mb-1">{item.category}</p>
                <h3 className="font-heading font-bold text-ink/60 mb-3">{item.name}</h3>
                <span className="badge-pill bg-ink/[0.06] text-ink/50">قريباً</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <Link href="/collections" className="btn-outline">
            شوف كل المنتجات
            <Icon name="arrow-left" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
