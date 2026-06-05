import Icon from '../ui/Icon';
import ProductImage from '../ui/ProductImage';
import type { Product } from '../../lib/products';

export default function ProductPainSection({ product }: { product: Product }) {
  const { pain } = product;
  return (
    <section className="bg-[#1a0f0a] text-white py-16 md:py-24" dir="rtl" aria-labelledby="pain-heading">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Copy */}
          <div>
            {pain.eyebrow && (
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-400 mb-4">
                <Icon name="flame" size={14} className="text-red-400" />
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
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-red-500/20 text-red-400 shrink-0 mt-0.5">
                      <Icon name="close" size={14} />
                    </span>
                    <span className="text-white font-bold text-base leading-snug">{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Image */}
          <div className="order-first lg:order-last">
            <ProductImage
              src={pain.image}
              alt={pain.imageLabel}
              fallbackLabel={pain.imageLabel}
              fallbackSublabel="الصورة قريباً"
              aspect="square"
              fit="cover"
              className="rounded-2xl overflow-hidden opacity-90"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
