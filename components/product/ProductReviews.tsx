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
    <section className="section-padding bg-cream" dir="rtl" aria-labelledby="reviews-heading">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="eyebrow mb-3">
            <Icon name="star" size={14} />
            آراء موثّقة
          </p>
          <h2 id="reviews-heading" className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink mb-2">
            شنو قالو اللي جربوه
          </h2>
          <p className="text-ink/55 text-sm">
            تقييمات بالدارجة من زبناء ف المغرب
          </p>
        </div>

        {/* Rating summary */}
        <div className="card-elevated p-6 sm:p-8 mb-10 max-w-lg mx-auto text-center">
          <p className="font-heading text-6xl font-extrabold text-ink leading-none">{product.rating}</p>
          <div className="flex justify-center mt-3 mb-2">
            <Stars value={product.rating} size={22} />
          </div>
          <p className="text-ink/55 text-sm mb-6">{product.reviewCount}+ تقييم موثّق</p>
          <div className="space-y-2">
            {distribution.map((d) => (
              <div key={d.stars} className="flex items-center gap-2 text-xs">
                <span className="text-ink/55 w-3 shrink-0">{d.stars}</span>
                <Icon name="star" size={11} className="text-accent shrink-0" />
                <span className="flex-1 h-2 rounded-full bg-ink/[0.08] overflow-hidden">
                  <span className="block h-full bg-accent rounded-full transition-all" style={{ width: `${d.pct}%` }} />
                </span>
                <span className="text-ink/45 w-8 text-start shrink-0">{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review cards — up to 3 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {product.reviews.slice(0, 3).map((r) => (
            <div key={r.name} className="card-flat p-6 flex flex-col">
              <div className="flex items-start justify-between mb-4 gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-11 h-11 rounded-full bg-brand text-white font-heading font-extrabold text-lg shrink-0">
                    {r.name.charAt(0)}
                  </span>
                  <div className="leading-tight">
                    <p className="font-bold text-ink text-sm">{r.name}</p>
                    <p className="text-xs text-ink/50 mt-0.5">
                      <Icon name="pin" size={11} className="inline-block align-middle ml-0.5" />
                      {r.city} · {r.date}
                    </p>
                  </div>
                </div>
                <Stars value={r.rating} size={13} />
              </div>
              <p className="text-ink/75 leading-relaxed text-sm flex-1">{r.text}</p>
              <p className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold mt-4 pt-4 border-t border-ink/[0.06]">
                <Icon name="check-circle" size={14} />
                شراء موثّق ✓
              </p>
            </div>
          ))}
        </div>

        {/* Social proof footer */}
        <div className="mt-10 text-center text-ink/50 text-sm">
          <Icon name="shield" size={16} className="inline-block align-middle ml-1.5 text-brand" />
          تقييمات من زبناء حقيقيين ف المغرب
        </div>
      </div>
    </section>
  );
}
