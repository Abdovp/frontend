import { useEffect, useMemo, useRef, useState } from 'react';
import { trackAddToCart } from '../../lib/analytics/track';
import { useCartStore } from '../../lib/cart-store';
import type { Product } from '../../lib/products';
import { CURRENCY, getFirstOffer, isProductAvailable } from '../../lib/products';
import ProductImage from '../ui/ProductImage';
import StoreTrustBand from '../StoreTrustBand';
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
  const isAvailable = isProductAvailable(product);

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

  const galleryImages = useMemo(
    () =>
      product.galleryImages?.length
        ? product.galleryImages
        : product.image
          ? [product.image]
          : [],
    [product.galleryImages, product.image]
  );
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setActiveImage(0);
  }, [product.id]);

  const selectOffer = (quantity: OfferQuantity) => {
    if (!isAvailable) return;
    setSelectedOffer(product.id, quantity);
  };

  const handleCheckout = (quantity: OfferQuantity = selected) => {
    if (!isAvailable) return;
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
    document.getElementById('product-pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const showStickyBar = showSticky;

  return (
    <section className="checkout-hero section-padding pt-8 md:pt-12">
      <div className="container-wide">
        <div
          ref={productCardRef}
          className="layout-ltr grid lg:grid-cols-2 gap-10 lg:gap-16 items-start"
        >
          {/* Gallery + trust — desktop right, on top on mobile */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-28">
            <ProductImage
              src={galleryImages[activeImage]}
              alt={
                product.galleryLabels[activeImage]
                  ? `${product.nameAr} — ${product.galleryLabels[activeImage]}`
                  : product.nameAr
              }
              fallbackLabel={product.galleryLabels[activeImage] ?? product.galleryLabels[0]}
              fallbackSublabel="صورة المنتج"
              aspect="square"
              fit="cover"
              objectPosition={product.id === 'cooling-pack' ? 'top' : 'center'}
              className="rounded-2xl shadow-card bg-white"
              priority
            />
            {galleryImages.length > 1 ? (
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3">
                {galleryImages.map((src, index) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={product.galleryLabels[index] ?? `صورة ${index + 1}`}
                    aria-pressed={activeImage === index}
                    className={`relative overflow-hidden rounded-xl aspect-square ring-2 transition-all ${
                      activeImage === index
                        ? 'ring-brand shadow-card'
                        : 'ring-transparent opacity-80 hover:opacity-100'
                    }`}
                  >
                    <ProductImage
                      src={src}
                      alt={product.galleryLabels[index] ?? product.nameAr}
                      fallbackLabel={product.galleryLabels[index] ?? product.galleryLabels[0]}
                      aspect="square"
                      fit="cover"
                      className="rounded-xl bg-white"
                    />
                  </button>
                ))}
              </div>
            ) : null}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5">
              {product.valueProps.slice(0, 3).map((v) => (
                <div key={v.title} className="product-benefit-chip">
                  <span className="product-benefit-chip__icon">
                    <Icon name={v.icon} size={18} />
                  </span>
                  <p className="product-benefit-chip__title">{v.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Copy + offers — desktop left */}
          <div dir="rtl" className="text-right order-2 lg:order-1">
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

            <p className="text-ink text-base md:text-lg leading-relaxed mb-5 font-medium">
              {product.checkoutDescription}
            </p>

            <ul className="space-y-2.5 mb-6">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-center gap-3 text-ink font-bold">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand/[0.08] text-brand shrink-0">
                    <Icon name="check" size={14} />
                  </span>
                  {h}
                </li>
              ))}
            </ul>

            {/* Scarcity */}
            <div
              className={`scarcity-banner mb-6 ${isAvailable ? 'animate-pulse' : ''}`}
              style={{ animationDuration: '3s' }}
            >
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
                      disabled={!isAvailable}
                      className={`offer-card ${isSelected && isAvailable ? 'offer-card--selected' : ''} ${!isAvailable ? 'cursor-not-allowed opacity-60' : ''}`}
                    >
                      <span className={`offer-radio ${isSelected && isAvailable ? 'offer-radio--checked' : ''}`} />
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
              disabled={!selectedOffer || !isAvailable}
              className="checkout-cta checkout-cta--pulse w-full disabled:opacity-50"
            >
              <Icon name="cart" size={20} />
              {!isAvailable
                ? 'غير متوفر حالياً'
                : selectedOffer
                ? isInCart(product.id, selectedOffer.quantity)
                  ? 'شوف السلة — المنتج مضاف'
                  : `اطلب دابا — ${selectedOffer.price} ${CURRENCY}`
                : 'اطلب دابا'}
            </button>

            {/* COD trust line */}
            <div className="flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl py-3 px-4 mt-3">
              <Icon name="lock" size={16} className="text-emerald-700 shrink-0" />
              <p className="text-sm font-bold text-emerald-800">
                الدفع عند الاستلام — بدون دفع أونلاين
              </p>
            </div>

            {/* WhatsApp order option */}
            <a
              href={`https://wa.me/212600000000?text=${encodeURIComponent(`مرحبا، بغيت نطلب ${product.nameAr}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={isAvailable ? 'اطلب عبر الواتساب' : 'غير متوفر على الواتساب حالياً'}
              className={`flex items-center justify-center text-sm font-bold border rounded-xl py-3 px-4 mt-3 transition-colors ${
                isAvailable
                  ? 'text-[#25D366] border-[#25D366]/30 hover:bg-[#25D366]/[0.05]'
                  : 'pointer-events-none text-ink/35 border-ink/10 bg-ink/[0.03]'
              }`}
            >
              <Icon name="whatsapp" size={18} />
            </a>
          </div>
        </div>

        <StoreTrustBand className="mt-8 md:mt-10" />
      </div>

      {/* Sticky CTA — always shows first-offer price, once scrolled past product card */}
      <div
        className={`sticky-cta ${showStickyBar ? 'sticky-cta--visible' : ''}`}
        aria-hidden={!showStickyBar}
      >
        <div className="container-wide">
          {/* Mobile — button only */}
          <button
            type="button"
            onClick={handleStickyClick}
            disabled={!isAvailable}
            className="checkout-cta checkout-cta--pulse sticky-cta__button sticky-cta__button--mobile w-full disabled:opacity-50 md:hidden"
          >
            <Icon name="arrow-up" size={18} />
            {isAvailable ? `اطلب دابا — ${firstOffer.price} ${CURRENCY}` : 'غير متوفر حالياً'}
          </button>

          {/* Desktop — product info + wide CTA */}
          <div
            dir="rtl"
            className="mx-auto hidden w-full max-w-3xl items-center gap-3 md:flex"
          >
            <div className="flex min-w-0 max-w-[11rem] shrink-0 items-center gap-2.5">
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-ink/[0.08] bg-white shadow-soft">
                <ProductImage
                  src={galleryImages[0] ?? product.image}
                  alt={product.nameAr}
                  fallbackLabel={product.nameAr}
                  aspect="square"
                  fit="cover"
                  className="rounded-lg"
                />
              </div>
              <div className="min-w-0">
                <p className="line-clamp-1 font-heading text-sm font-bold text-ink">
                  {product.nameAr}
                </p>
                <p className="mt-0.5 text-xs leading-snug text-ink/50">
                  {isAvailable ? `${firstOffer.price} ${CURRENCY} • دفع عند الاستلام` : 'غير متوفر حالياً'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleStickyClick}
              disabled={!isAvailable}
              className="checkout-cta checkout-cta--pulse sticky-cta__button sticky-cta__button--desktop min-w-0 flex-1 disabled:opacity-50"
            >
              <Icon name="arrow-up" size={18} />
              {isAvailable ? `اطلب دابا الآن • ${firstOffer.price} ${CURRENCY}` : 'غير متوفر حالياً'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
