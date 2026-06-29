import Icon from '../ui/Icon';
import ProductImage from '../ui/ProductImage';
import type { Product } from '../../lib/products';

export default function ProductPainSection({ product }: { product: Product }) {
  const { pain } = product;
  return (
    <section className="bg-[#1a0f0a] text-white py-20 md:py-28" aria-labelledby="pain-heading">
      <div className="container-wide">
        <div className="layout-ltr grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Copy — desktop left */}
          <div dir="rtl" className="text-right order-2 lg:order-1">
            {pain.eyebrow && (
              <p className="inline-flex items-center gap-2 text-[0.68rem] font-extrabold uppercase tracking-widest2 text-red-400 bg-red-500/10 border border-red-500/25 px-3.5 py-1.5 rounded-full mb-5">
                <Icon name="flame" size={13} className="text-red-400" />
                {pain.eyebrow}
              </p>
            )}
            <h2
              id="pain-heading"
              className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold leading-snug mb-5 text-balance"
            >
              {pain.title}
            </h2>
            <p className="text-white/65 text-base md:text-lg leading-relaxed mb-8">
              {pain.body}
            </p>
            {pain.bullets && (
              <ul className="space-y-4">
                {pain.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-600 text-white shrink-0 mt-0.5 shadow-[0_4px_12px_rgba(220,38,38,0.35)]">
                      <Icon name="close" size={14} />
                    </span>
                    <span className="text-white font-extrabold text-base leading-snug">{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Image — desktop right */}
          <div className="order-1 lg:order-2">
            <ProductImage
              src={pain.image}
              alt={pain.imageLabel}
              fallbackLabel={pain.imageLabel}
              fallbackSublabel="الصورة قريباً"
              aspect="square"
              fit="cover"
              className="rounded-2xl overflow-hidden opacity-90 group"
              imageClassName="group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
