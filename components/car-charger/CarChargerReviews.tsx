import Icon from '../ui/Icon';
import type { Product } from '../../lib/products';

export default function CarChargerReviews({ product }: { product: Product }) {
  const { proof } = product;

  return (
    <section className="relative overflow-hidden bg-[#FFFFFF] py-14 md:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1A73E8]/8 blur-[130px]" />
      </div>

      <div className="container-wide relative">
        <div dir="rtl" className="mb-10 text-center">
          {proof.eyebrow && (
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#F9A825] bg-[#FFF7D6] px-3.5 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-widest2 text-[#B45309]">
              <Icon name="star" size={13} />
              {proof.eyebrow}
            </p>
          )}
          <h2 className="mb-4 font-heading text-2xl font-extrabold leading-snug text-balance text-[#111827] sm:text-3xl md:text-4xl">
            {proof.title}
          </h2>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-[#4B5563] md:text-lg">{proof.body}</p>
        </div>

        {proof.bullets && (
          <div dir="rtl" className="mb-12 flex flex-wrap justify-center gap-3">
            {proof.bullets.map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-[#F7F7F5] px-4 py-2 text-sm font-bold text-[#111827]"
              >
                <Icon name="check-circle" size={15} className="text-[#16A34A]" />
                {b}
              </span>
            ))}
          </div>
        )}

        <div dir="rtl" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {product.reviews.slice(0, 3).map((review) => (
            <div
              key={review.name}
              className="rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF] p-5 transition-colors hover:border-[#1A73E8]/35"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} name="star" size={14} className={i < review.rating ? 'text-[#F9A825]' : 'text-[#D1D5DB]'} />
                  ))}
                </div>
                <span className="text-xs text-[#6B7280]">{review.date}</span>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-[#4B5563]">&ldquo;{review.text}&rdquo;</p>
              <div className="flex items-center gap-2 border-t border-[#E5E7EB] pt-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAF2FF] text-xs font-extrabold text-[#1A73E8]">
                  {review.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-bold text-[#111827]">{review.name}</p>
                  <p className="text-xs text-[#6B7280]">{review.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
