import Icon from '../ui/Icon';
import type { Product } from '../../lib/products';

export default function CarChargerReviews({ product }: { product: Product }) {
  const { proof } = product;

  return (
    <section className="relative overflow-hidden bg-[#05070d] py-14 md:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/5 blur-[130px]" />
      </div>

      <div className="container-wide relative">
        <div dir="rtl" className="mb-10 text-center">
          {proof.eyebrow && (
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-3.5 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-widest2 text-amber-300">
              <Icon name="star" size={13} />
              {proof.eyebrow}
            </p>
          )}
          <h2 className="mb-4 font-heading text-2xl font-extrabold leading-snug text-balance text-white sm:text-3xl md:text-4xl">
            {proof.title}
          </h2>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-white/60 md:text-lg">{proof.body}</p>
        </div>

        {proof.bullets && (
          <div dir="rtl" className="mb-12 flex flex-wrap justify-center gap-3">
            {proof.bullets.map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white/85"
              >
                <Icon name="check-circle" size={15} className="text-emerald-400" />
                {b}
              </span>
            ))}
          </div>
        )}

        <div dir="rtl" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {product.reviews.slice(0, 3).map((review) => (
            <div
              key={review.name}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-amber-400/25"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} name="star" size={14} className={i < review.rating ? 'text-amber-400' : 'text-white/15'} />
                  ))}
                </div>
                <span className="text-xs text-white/35">{review.date}</span>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-white/75">&ldquo;{review.text}&rdquo;</p>
              <div className="flex items-center gap-2 border-t border-white/10 pt-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/20 to-orange-400/20 text-xs font-extrabold text-white">
                  {review.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-bold text-white">{review.name}</p>
                  <p className="text-xs text-white/40">{review.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
