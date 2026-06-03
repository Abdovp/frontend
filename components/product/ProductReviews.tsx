import SectionHeading from '../ui/SectionHeading';
import Icon, { Stars } from '../ui/Icon';
import type { Product } from '../../lib/products';

const distribution = [
  { stars: 5, pct: 88 },
  { stars: 4, pct: 9 },
  { stars: 3, pct: 2 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 0 },
];

export default function ProductReviews({ product }: { product: Product }) {
  return (
    <section className="section-padding bg-cream">
      <div className="container-wide">
        <SectionHeading
          eyebrow="آراء موثّقة"
          title="شنو قالو السائقين اللي جربوه"
          subtitle="تقييمات حقيقية بالدارجة من زبناء ف مدن مختلفة."
        />

        <div className="grid lg:grid-cols-[300px,1fr] gap-8 items-start">
          <div className="card-elevated p-7 text-center lg:sticky lg:top-28">
            <p className="font-heading text-5xl font-extrabold text-ink">{product.rating}</p>
            <div className="flex justify-center mt-2">
              <Stars value={product.rating} size={20} />
            </div>
            <p className="text-sm text-ink/55 mt-2">{product.reviewCount}+ تقييم موثّق</p>
            <div className="mt-6 space-y-2">
              {distribution.map((d) => (
                <div key={d.stars} className="flex items-center gap-2 text-xs">
                  <span className="text-ink/55 w-3">{d.stars}</span>
                  <Icon name="star" size={12} className="text-accent" />
                  <span className="flex-1 h-1.5 rounded-full bg-ink/[0.08] overflow-hidden">
                    <span className="block h-full bg-accent rounded-full" style={{ width: `${d.pct}%` }} />
                  </span>
                  <span className="text-ink/45 w-8 text-start">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {product.reviews.map((r) => (
              <div key={r.name} className="card-flat p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-brand text-white font-heading font-bold">
                      {r.name.charAt(0)}
                    </span>
                    <div className="leading-tight">
                      <p className="font-bold text-ink">{r.name}</p>
                      <p className="text-xs text-ink/50">{r.city} · {r.date}</p>
                    </div>
                  </div>
                  <Stars value={r.rating} size={14} />
                </div>
                <p className="text-ink/75 leading-relaxed">{r.text}</p>
                <p className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mt-4">
                  <Icon name="check-circle" size={14} />
                  شراء موثّق
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
