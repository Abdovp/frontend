import Icon from '../ui/Icon';
import type { Product } from '../../lib/products';

export default function CarChargerPain({ product }: { product: Product }) {
  const { pain } = product;
  return (
    <section className="relative overflow-hidden bg-[#0a0d14] py-14 md:py-20" aria-labelledby="cc-pain-heading">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/3 h-72 w-72 rounded-full bg-red-600/10 blur-[100px]" />
      </div>
      <div className="container-wide relative">
        <div dir="rtl" className="mb-8 text-center">
          {pain.eyebrow && (
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/25 bg-red-500/10 px-3.5 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-widest2 text-red-400">
              <Icon name="flame" size={13} className="text-red-400" />
              {pain.eyebrow}
            </p>
          )}
          <h2
            id="cc-pain-heading"
            className="font-heading text-2xl font-extrabold leading-snug text-balance text-white sm:text-3xl md:text-4xl"
          >
            {pain.title}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-white/60 md:text-lg">{pain.body}</p>
        </div>

        <div className="relative mb-8 overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
          {pain.image ? (
            <img src={pain.image} alt={pain.imageLabel} className="block h-auto w-full" />
          ) : (
            <div className="bg-white/5 py-20 text-center text-sm text-white/30">{pain.imageLabel}</div>
          )}
        </div>

        {pain.bullets && (
          <div dir="rtl" className="mt-8 grid gap-3 md:grid-cols-3">
            {pain.bullets.map((b) => (
              <div
                key={b}
                className="rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-4 text-right shadow-[0_10px_24px_rgba(239,68,68,0.08)]"
              >
                <p className="text-sm font-extrabold leading-relaxed text-white">{b}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
