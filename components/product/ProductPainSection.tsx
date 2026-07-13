import Icon from '../ui/Icon';
import type { Product } from '../../lib/products';

export default function ProductPainSection({ product }: { product: Product }) {
  const { pain } = product;
  return (
    <section className="bg-[#1a0f0a] text-white py-14 md:py-20" aria-labelledby="pain-heading">
      <div className="container-wide">
        {/* Header — centered */}
        <div dir="rtl" className="text-center mb-8">
          {pain.eyebrow && (
            <p className="inline-flex items-center gap-2 text-[0.68rem] font-extrabold uppercase tracking-widest2 text-red-400 bg-red-500/10 border border-red-500/25 px-3.5 py-1.5 rounded-full mb-4">
              <Icon name="flame" size={13} className="text-red-400" />
              {pain.eyebrow}
            </p>
          )}
          <h2
            id="pain-heading"
            className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold leading-snug text-balance"
          >
            {pain.title}
          </h2>
        </div>

        {/* Full-width landing page hero image */}
        <div className="rounded-2xl overflow-hidden shadow-2xl mb-8">
          {pain.image ? (
            <img src={pain.image} alt={pain.imageLabel} className="w-full h-auto block" />
          ) : (
            <div className="bg-white/5 text-white/30 text-center py-20 text-sm">{pain.imageLabel}</div>
          )}
        </div>

        {/* Pain bullets — 2-col on mobile, 4-col on desktop */}
        {pain.bullets && (
          <ul dir="rtl" className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {pain.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-red-600 text-white shrink-0 mt-0.5 shadow-[0_4px_12px_rgba(220,38,38,0.35)]">
                  <Icon name="close" size={13} />
                </span>
                <span className="text-white font-extrabold text-sm leading-snug">{b}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
