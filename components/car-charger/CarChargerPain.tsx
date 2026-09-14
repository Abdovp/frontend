import Icon from '../ui/Icon';
import type { Product } from '../../lib/products';

export default function CarChargerPain({ product }: { product: Product }) {
  const { pain } = product;
  return (
    <section className="relative overflow-hidden bg-[#F1F3F5] py-14 md:py-20" aria-labelledby="cc-pain-heading">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/3 h-72 w-72 rounded-full bg-[#E39A1C]/20 blur-[100px]" />
      </div>
      <div className="container-wide relative">
        <div dir="rtl" className="mb-8 text-center">
          {pain.eyebrow && (
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E39A1C] bg-[#FFF7D6] px-3.5 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-widest2 text-[#B45309]">
              <Icon name="flame" size={13} className="text-[#E39A1C]" />
              {pain.eyebrow}
            </p>
          )}
          <h2
            id="cc-pain-heading"
            className="font-heading text-2xl font-extrabold leading-snug text-balance text-[#111827] sm:text-3xl md:text-4xl"
          >
            {pain.title}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-[#4B5563] md:text-lg">{pain.body}</p>
        </div>

        <div className="relative mb-8 overflow-hidden rounded-[2rem] border border-[#E5E7EB] shadow-2xl">
          {pain.image ? (
            <img src={pain.image} alt={pain.imageLabel} className="block h-auto w-full" />
          ) : (
            <div className="bg-white py-20 text-center text-sm text-[#6B7280]">{pain.imageLabel}</div>
          )}
        </div>

        {pain.bullets && (
          <div dir="rtl" className="mt-8 grid gap-3 md:grid-cols-3">
            {pain.bullets.map((b) => (
              <div
                key={b}
                className="rounded-2xl border border-[#E39A1C]/30 bg-[#FFF7D6] p-4 text-right shadow-[0_10px_24px_rgba(227,154,28,0.12)]"
              >
                <p className="text-sm font-extrabold leading-relaxed text-[#111827]">{b}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
