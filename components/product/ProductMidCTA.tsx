import Icon from '../ui/Icon';
import { CURRENCY } from '../../lib/products';
import type { Product } from '../../lib/products';

interface Props {
  product: Product;
  onCTA: () => void;
}

export default function ProductMidCTA({ product, onCTA }: Props) {
  const firstOffer = product.offers[0];
  const bestOffer = product.offers.find((o) => o.badge === 'الأكثر مبيعاً') ?? product.offers[1] ?? firstOffer;

  return (
    <section className="bg-brand py-12 md:py-16" dir="rtl" aria-label="طلب المنتج">
      <div className="container-wide max-w-3xl text-center text-white">
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent mb-4">
          <Icon name="flame" size={14} />
          {product.scarcityText}
        </p>
        <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 text-balance">
          {product.checkoutHeadline}
        </h2>
        <p className="text-white/70 mb-8 max-w-xl mx-auto">
          {product.checkoutDescription}
        </p>

        <div className="inline-flex flex-col sm:flex-row items-center gap-4 mb-6">
          <div className="text-center">
            <p className="text-white/55 text-sm mb-1">{bestOffer.label}</p>
            <p className="font-heading text-4xl font-extrabold leading-none">
              {bestOffer.price}{' '}
              <span className="text-xl font-semibold">{CURRENCY}</span>
            </p>
            {bestOffer.compareAt && (
              <p className="text-white/40 text-sm line-through mt-1">
                {bestOffer.compareAt} {CURRENCY}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onCTA}
            className="btn-gold text-lg px-10 py-4"
          >
            <Icon name="cart" size={20} />
            اطلب دابا
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/60">
          <span className="flex items-center gap-1.5">
            <Icon name="wallet" size={16} className="text-accent" />
            دفع عند الاستلام
          </span>
          <span className="flex items-center gap-1.5">
            <Icon name="truck" size={16} className="text-accent" />
            توصيل {product.deliveryDays}
          </span>
          <span className="flex items-center gap-1.5">
            <Icon name="refresh" size={16} className="text-accent" />
            ضمان 30 يوم
          </span>
        </div>
      </div>
    </section>
  );
}
