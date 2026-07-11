import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { createPurchaseEventId, submitOrder } from '../../lib/api/orders';
import { getCheckoutErrorMessage } from '../../lib/api/order-errors';
import { trackInitiateCheckout, trackPurchase } from '../../lib/analytics/track';
import {
  validateCheckoutField,
  validateCheckoutForm,
  type CheckoutField,
  type CheckoutFormData,
} from '../../lib/checkout-validation';
import { saveOrderConfirmation } from '../../lib/order-confirmation';
import { pickUpsellProduct } from '../../lib/upsell';
import type { CartItem } from '../../lib/cart-store';
import { useCartStore } from '../../lib/cart-store';
import type { Product } from '../../lib/products';
import { CURRENCY, getFirstOffer, isProductAvailable } from '../../lib/products';
import ProductImage from '../ui/ProductImage';
import StoreTrustBand from '../StoreTrustBand';
import FormField from '../ui/FormField';
import UpsellPopup from '../UpsellPopup';
import Icon, { Stars } from '../ui/Icon';

interface ProductOffersProps {
  product: Product;
}

type OfferQuantity = 1 | 2 | 3;

function getDefaultOffer(product: Product): OfferQuantity {
  return getFirstOffer(product).quantity;
}

export default function ProductOffers({ product }: ProductOffersProps) {
  const { setSelectedOffer } = useCartStore();
  const productCardRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [showSticky, setShowSticky] = useState(false);
  const isAvailable = isProductAvailable(product);
  const router = useRouter();

  const defaultOffer = useMemo(() => getDefaultOffer(product), [product]);
  const selected = useCartStore(
    (state) => state.selectedOffers[product.id] ?? defaultOffer
  );

  const [formData, setFormData] = useState<CheckoutFormData>({ name: '', phone: '' });
  const [errors, setErrors] = useState<Partial<Record<CheckoutField, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<CheckoutField, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [upsellProduct, setUpsellProduct] = useState<Product | null>(null);
  const submittedOrderRef = useRef<{ orderId: number; eventId: string } | null>(null);

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

  useEffect(() => {
    void router.prefetch('/thank-you');
  }, [router]);

  const selectOffer = (quantity: OfferQuantity) => {
    if (!isAvailable) return;
    setSelectedOffer(product.id, quantity);
  };

  const setField = useCallback((field: CheckoutField, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleBlur = (field: CheckoutField, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateCheckoutField(field, value);
    setErrors((prev) => {
      const next = { ...prev };
      if (error) next[field] = error;
      else delete next[field];
      return next;
    });
  };

  const showError = (field: CheckoutField) =>
    errors[field] && (touched[field] || submitting) ? errors[field] : undefined;

  const finishCheckout = () => {
    void router.push('/thank-you');
  };

  const handleUpsellAdded = () => {
    setUpsellProduct(null);
    finishCheckout();
  };

  const handleUpsellClose = () => {
    setUpsellProduct(null);
    finishCheckout();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAvailable) return;

    const nextErrors = validateCheckoutForm(formData);
    setErrors(nextErrors);
    setTouched({ name: true, phone: true });

    if (Object.keys(nextErrors).length > 0) {
      const firstInvalid = (['name', 'phone'] as CheckoutField[]).find((f) => nextErrors[f]);
      if (firstInvalid) {
        document.getElementById(`product-checkout-${firstInvalid}`)?.focus();
      }
      return;
    }

    const offer = product.offers.find((o) => o.quantity === selected);
    if (!offer) return;

    const items: CartItem[] = [
      {
        id: product.id,
        lineKey: `${product.id}-${offer.quantity}`,
        name: product.nameAr,
        price: offer.price,
        offer: offer.quantity,
        quantity: 1,
      },
    ];
    const total = offer.price;

    setSubmitting(true);
    setSubmitError('');

    trackInitiateCheckout(
      items.map((item) => ({ productId: item.id, name: item.name, price: item.price, quantity: item.quantity })),
      total
    );

    const eventId = createPurchaseEventId();

    try {
      const result = await submitOrder({
        eventId,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        items,
        total,
      });

      submittedOrderRef.current = { orderId: result.id, eventId };

      saveOrderConfirmation({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        items,
        total,
        eventId,
        orderId: result.id,
        publicOrderId: result.public_order_id,
      });

      trackPurchase({
        eventId,
        value: total,
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      });

      const upsell = pickUpsellProduct([product.id]);
      if (upsell) {
        setUpsellProduct(upsell);
        setSubmitting(false);
        return;
      }

      finishCheckout();
    } catch (error) {
      setSubmitError(getCheckoutErrorMessage(error));
      setSubmitting(false);
    }
  };

  const handleStickyClick = () => {
    document.getElementById('product-checkout-name')?.focus();
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

            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand text-white font-bold text-sm shrink-0">
                1
              </span>
              <p className="font-heading font-extrabold text-ink">اختار العرض</p>
            </div>
            <div id="product-pricing" className="flex flex-col gap-3 mb-5 scroll-mt-28">
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

            {/* Inline checkout form */}
            <div className="rounded-2xl border-2 border-brand/20 bg-gradient-to-b from-brand/[0.04] to-transparent p-5 mt-2">
              {/* Form header */}
              <div className="flex items-center gap-2.5 mb-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand text-white font-bold text-sm shrink-0">
                  2
                </span>
                <div>
                  <p className="font-heading font-extrabold text-ink leading-none">أكمل بياناتك للتوصيل</p>
                  <p className="text-xs text-ink/50 mt-0.5">بدون دفع — الطلب يوصل لبابك</p>
                </div>
              </div>

              <form onSubmit={(e) => { void handleSubmit(e); }} noValidate className="space-y-3">
                <FormField
                  id="product-checkout-name"
                  label="الاسم الكامل"
                  ref={nameRef}
                  error={showError('name')}
                  inputProps={{
                    type: 'text',
                    name: 'name',
                    autoComplete: 'name',
                    placeholder: 'مثلاً: محمد العلوي',
                    value: formData.name,
                    onChange: (e) => setField('name', e.target.value),
                    onBlur: (e) => handleBlur('name', e.target.value),
                    disabled: submitting,
                  }}
                />
                <FormField
                  id="product-checkout-phone"
                  label="رقم الهاتف"
                  error={showError('phone')}
                  inputProps={{
                    type: 'tel',
                    name: 'phone',
                    dir: 'ltr',
                    autoComplete: 'tel',
                    placeholder: '06XXXXXXXX',
                    value: formData.phone,
                    onChange: (e) => setField('phone', e.target.value),
                    onBlur: (e) => handleBlur('phone', e.target.value),
                    disabled: submitting,
                  }}
                />

                {submitError && (
                  <p className="text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5" role="alert">
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!isAvailable || submitting}
                  className="checkout-cta checkout-cta--pulse w-full disabled:opacity-50 !text-base !py-4"
                >
                  {submitting ? (
                    <>
                      <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      جاري إرسال الطلب...
                    </>
                  ) : (
                    <>
                      <Icon name="lock" size={20} />
                      {isAvailable
                        ? `تأكيد الطلب — ${selectedOffer?.price ?? firstOffer.price} ${CURRENCY} 🚀`
                        : 'غير متوفر حالياً'}
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-ink/40 flex items-center justify-center gap-1">
                  <Icon name="lock" size={12} className="shrink-0" />
                  بياناتك آمنة — لن نشاركها مع أي طرف
                </p>
              </form>
            </div>

            {/* Trust badges row */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="flex flex-col items-center gap-1 rounded-xl bg-ink/[0.03] border border-ink/[0.06] py-3 px-2 text-center">
                <Icon name="wallet" size={18} className="text-brand" />
                <p className="text-[0.65rem] font-bold text-ink/60 leading-tight">دفع عند الاستلام</p>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-xl bg-ink/[0.03] border border-ink/[0.06] py-3 px-2 text-center">
                <Icon name="truck" size={18} className="text-brand" />
                <p className="text-[0.65rem] font-bold text-ink/60 leading-tight">توصيل مجاني</p>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-xl bg-ink/[0.03] border border-ink/[0.06] py-3 px-2 text-center">
                <Icon name="refresh" size={18} className="text-brand" />
                <p className="text-[0.65rem] font-bold text-ink/60 leading-tight">استرجاع مضمون</p>
              </div>
            </div>

            {upsellProduct && (
              <UpsellPopup product={upsellProduct} onAdded={handleUpsellAdded} onClose={handleUpsellClose} />
            )}

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
