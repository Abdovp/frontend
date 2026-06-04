import { useEffect, useMemo, useRef, useState } from 'react';
import { trackAddToCart } from '../../lib/analytics/track';
import { useCartStore } from '../../lib/cart-store';
import type { Product } from '../../lib/products';
import { CURRENCY, getFirstOffer } from '../../lib/products';
import ProductImage from '../ui/ProductImage';
import Icon, { Stars } from '../ui/Icon';

interface ProductOffersProps {
  product: Product;
}

type OfferQuantity = 1 | 2 | 3;

function getDefaultOffer(product: Product): OfferQuantity {
  return getFirstOffer(product).quantity;
}

export default function ProductOffers({ product }: ProductOffersProps) {
  const { addItem, openCart, setSelectedOffer, isInCart } = useCartStore();
  const productCardRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);

  const defaultOffer = useMemo(() => getDefaultOffer(product), [product]);
  const selected = useCartStore(
    (state) => state.selectedOffers[product.id] ?? defaultOffer
  );

  useEffect(() => {
    if (useCartStore.getState().selectedOffers[product.id] == null) {
      setSelectedOffer(product.id, defaultOffer);
    }
  }, [product.id, defaultOffer, setSelectedOffer]);

  useEffect(() => {
    const el = productCardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-8px 0px 0px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const selectedOffer = useMemo(
    () => product.offers.find((o) => o.quantity === selected),
    [product.offers, selected]
  );

  const firstOffer = useMemo(() => getFirstOffer(product), [product]);

  const selectOffer = (quantity: OfferQuantity) => {
    setSelectedOffer(product.id, quantity);
  };

  const handleCheckout = (quantity: OfferQuantity = selected) => {
    const offer = product.offers.find((o) => o.quantity === quantity);
    if (!offer) return;

    if (isInCart(product.id, offer.quantity)) {
      openCart();
      return;
    }

    trackAddToCart({
      productId: product.id,
      name: product.nameAr,
      price: offer.price,
      quantity: 1,
    });
    addItem({
      id: product.id,
      name: product.nameAr,
      price: offer.price,
      offer: offer.quantity,
      quantity: 1,
    });
    setTimeout(() => openCart(), 350);
  };

  const handleStickyClick = () => {
    if (isInCart(product.id, firstOffer.quantity)) {
      openCart();
      return;
    }

    setSelectedOffer(product.id, firstOffer.quantity);
    document.getElementById('product-pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="checkout-hero section-padding pt-8 md:pt-12">
      <div className="container-wide">
        <div
          ref={productCardRef}
          className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start"
        >
          {/* Gallery + trust — on top on mobile */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-28">
            <ProductImage
              src={product.heroImage ?? product.image}
              alt={product.nameAr}
              fallbackLabel={product.galleryLabels[0]}
              fallbackSublabel="صورة المنتج"
              aspect="square"
              fit="cover"
              className="rounded-2xl shadow-card"
              priority
            />
            <div className="grid grid-cols-4 gap-2 sm:gap-3 mt-5">
              {product.valueProps.map((v) => (
                <div key={v.title} className="product-benefit-chip">
                  <span className="product-benefit-chip__icon">
                    <Icon name={v.icon} size={18} />
                  </span>
                  <p className="product-benefit-chip__title">{v.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Copy + offers */}
          <div className="order-2 lg:order-1">
            <p className="text-accent-dark font-bold text-sm mb-2">{product.category}</p>
            <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-ink leading-[1.15] mb-3 text-balance">
              {product.checkoutHeadline}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-sm">
              <span className="inline-flex items-center gap-1.5">
                <Stars value={product.rating} size={16} />
                <span className="font-bold text-ink">{product.rating}</span>
                <span className="text-ink/45">({product.reviewCount} تقييم)</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-brand font-semibold">
                <Icon name="flame" size={15} className="text-accent-dark" />
                {product.soldText}
              </span>
            </div>

            <p className="text-ink/80 text-base md:text-lg leading-relaxed mb-5 font-medium">
              {product.checkoutDescription}
            </p>

            <ul className="space-y-2.5 mb-6">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-center gap-3 text-ink/85 font-medium">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand/[0.08] text-brand shrink-0">
                    <Icon name="check" size={14} />
                  </span>
                  {h}
                </li>
              ))}
            </ul>

            <div className="scarcity-banner mb-6">
              <Icon name="flame" size={18} className="text-red-500 shrink-0" />
              <p>{product.scarcityText}</p>
            </div>

            <p className="font-heading font-bold text-ink mb-3">اختار العرض</p>
            <div id="product-pricing" className="flex flex-col gap-3 mb-6 scroll-mt-28">
              {product.offers.map((offer) => {
                const isSelected = selected === offer.quantity;
                const savings = offer.compareAt != null ? offer.compareAt - offer.price : null;
                return (
                  <div key={offer.quantity} className="relative">
                    {offer.badge && (
                      <span className={`offer-badge ${offer.badge === 'أقصى توفير' ? 'offer-badge--save' : ''}`}>
                        {offer.badge}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => selectOffer(offer.quantity)}
                      aria-pressed={isSelected}
                      className={`offer-card ${isSelected ? 'offer-card--selected' : ''}`}
                    >
                      <span className={`offer-radio ${isSelected ? 'offer-radio--checked' : ''}`} />
                      <span className="flex-1 min-w-0">
                        <span className="block font-heading font-bold text-ink">{offer.label}</span>
                        {offer.sublabel && (
                          <span className="block text-sm text-ink/55 mt-0.5">{offer.sublabel}</span>
                        )}
                      </span>
                      <span className="text-start shrink-0">
                        <span className="flex items-baseline gap-1">
                          <span className="font-heading text-2xl font-extrabold text-brand leading-none">
                            {offer.price}
                          </span>
                          <span className="text-sm font-semibold text-ink/60">{CURRENCY}</span>
                        </span>
                        {offer.compareAt && (
                          <span className="block text-xs text-ink/40 line-through mt-0.5">
                            {offer.compareAt} {CURRENCY}
                          </span>
                        )}
                        {savings != null && savings > 0 && (
                          <span className="mt-1 inline-block text-[0.7rem] font-extrabold text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5">
                            وفّر {savings} {CURRENCY}
                          </span>
                        )}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => handleCheckout()}
              disabled={!selectedOffer}
              className="checkout-cta checkout-cta--pulse w-full disabled:opacity-50"
            >
              <Icon name="cart" size={20} />
              {selectedOffer
                ? isInCart(product.id, selectedOffer.quantity)
                  ? 'شوف السلة — المنتج مضاف'
                  : `اطلب دابا — ${selectedOffer.price} ${CURRENCY}`
                : 'اطلب دابا'}
            </button>
            <p className="flex items-center justify-center gap-2 text-sm text-ink/55 mt-3">
              <Icon name="lock" size={15} className="text-brand" />
              الدفع عند الاستلام — بدون دفع أونلاين
            </p>
          </div>
        </div>
      </div>

      {/* Sticky CTA — visible on all screens once scrolled past product card */}
      <div
        className={`sticky-cta ${showSticky ? 'sticky-cta--visible' : ''}`}
        aria-hidden={!showSticky}
      >
        <div className="container-wide">
          <div className="mx-auto max-w-3xl flex items-center gap-3 md:gap-4">
            <div className="leading-tight shrink-0">
              <p className="text-xs text-ink/50">{firstOffer.label}</p>
              <p className="font-heading font-extrabold text-brand text-lg">
                {firstOffer.price} <span className="text-sm">{CURRENCY}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={handleStickyClick}
              className="checkout-cta checkout-cta--pulse flex-1 py-3.5 text-base md:py-4"
            >
              <Icon name="cart" size={18} />
              {isInCart(product.id, firstOffer.quantity)
                ? 'شوف السلة'
                : `اطلب دابا — ${firstOffer.price} ${CURRENCY}`}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
