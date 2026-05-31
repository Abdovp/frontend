import Link from 'next/link';
import { productList } from '../lib/products';
import ImagePlaceholder from './ui/ImagePlaceholder';
import Icon, { Stars } from './ui/Icon';

const comingSoon = [
  { name: 'مجموعة العناية والتنظيف', category: 'عناية بالسيارة' },
  { name: 'إضاءة LED داخلية', category: 'إكسسوارات' },
];

export default function FeaturedProducts() {
  return (
    <section className="section-padding bg-cream">
      <div className="container-wide">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="eyebrow mb-4 justify-center">
            <span className="w-6 h-px bg-current opacity-60" />
            الأكثر طلباً
          </span>
          <h2 className="font-heading text-3xl md:text-[2.6rem] font-extrabold text-ink leading-tight">
            منتجات كيختاروها السائقين كل يوم
          </h2>
          <p className="text-ink/60 mt-4 text-lg">
            مجموعة مختارة بعناية — مفحوصة، مضمونة، وجاهزة للتوصيل بالدفع عند الاستلام.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productList.map((p) => (
            <Link key={p.id} href={p.href} className="card-elevated overflow-hidden group flex flex-col">
              <div className="relative">
                <ImagePlaceholder
                  label={p.galleryLabels[0]}
                  sublabel={p.category}
                  aspect="square"
                  className="!rounded-none !border-0 border-b border-ink/[0.06]"
                />
                {p.offers.some((o) => o.badge === 'الأكثر مبيعاً') && (
                  <span className="absolute top-3 end-3 badge-pill bg-accent text-ink shadow-gold">
                    الأكثر مبيعاً
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
                    من {p.offers[0].price} <span className="text-sm">درهم</span>
                  </p>
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-brand/[0.06] text-brand group-hover:bg-brand group-hover:text-white transition">
                    <Icon name="arrow-left" size={18} />
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {comingSoon.map((item) => (
            <div key={item.name} className="card-flat overflow-hidden flex flex-col opacity-80">
              <div className="aspect-square bg-ink/[0.03] flex items-center justify-center border-b border-ink/[0.06] text-ink/25">
                <Icon name="spark" size={40} />
              </div>
              <div className="p-5">
                <p className="text-xs text-ink/45 font-bold mb-1">{item.category}</p>
                <h3 className="font-heading font-bold text-ink/70 mb-3">{item.name}</h3>
                <span className="badge-pill bg-ink/[0.06] text-ink/50">قريباً</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/collections" className="btn-outline">
            شوف كل المنتجات
            <Icon name="arrow-left" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
