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
import { CURRENCY, getFirstOffer, isProductAvailable, STORE } from '../../lib/products';
import ProductImage from '../ui/ProductImage';
import UpsellPopup from '../UpsellPopup';
import Icon from '../ui/Icon';

type OfferQuantity = 1 | 2 | 3;

function getDefaultOffer(product: Product): OfferQuantity {
  return getFirstOffer(product).quantity;
}

export default function CarChargerHero({ product }: { product: Product }) {
  const { setSelectedOffer } = useCartStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [showSticky, setShowSticky] = useState(false);
  const isAvailable = isProductAvailable(product);
  const router = useRouter();

  const defaultOffer = useMemo(() => getDefaultOffer(product), [product]);
  const selected = useCartStore((state) => state.selectedOffers[product.id] ?? defaultOffer);

  const [formData, setFormData] = useState<CheckoutFormData>({ name: '', phone: '' });
  const [errors, setErrors] = useState<Partial<Record<CheckoutField, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<CheckoutField, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [upsellProduct, setUpsellProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (useCartStore.getState().selectedOffers[product.id] == null) {
      setSelectedOffer(product.id, defaultOffer);
    }
  }, [product.id, defaultOffer, setSelectedOffer]);

  useEffect(() => {
    const el = cardRef.current;
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
  const whatsappNumber = useMemo(() => STORE.whatsapp.replace(/\D/g, ''), []);
  const whatsappHref = useMemo(
    () => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('مرحبا! بويا شوب سترد على جميع أسئلتك. كيف يمكنني أساعدك؟')}`,
    [whatsappNumber]
  );

  const galleryImages = useMemo(
    () => (product.galleryImages?.length ? product.galleryImages : product.image ? [product.image] : []),
    [product.galleryImages, product.image]
  );
  const [activeImage, setActiveImage] = useState(0);

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
        document.getElementById(`cc-checkout-${firstInvalid}`)?.focus();
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
    document.getElementById('cc-checkout-name')?.focus();
    document.getElementById('cc-pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative overflow-hidden bg-[#FFFFFF] pt-8 pb-14 md:pt-14 md:pb-20">
      {/* Ambient glow background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 right-1/4 h-[420px] w-[420px] rounded-full bg-[#E39A1C]/18 blur-[120px]" />
        <div className="absolute top-1/3 -left-20 h-[380px] w-[380px] rounded-full bg-[#1663D6]/12 blur-[110px]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(#111827 1px, transparent 1px), linear-gradient(90deg, #111827 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="container-wide relative">
        <div className="layout-ltr grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Gallery */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-28">
            <div className="relative rounded-[2rem] border border-[#E5E7EB] bg-[#FFFFFF] p-2 shadow-[0_30px_80px_-20px_rgba(17,24,39,0.2)]">
              <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-tr from-[#E39A1C]/25 via-transparent to-[#1663D6]/20 opacity-70" />
              <div className="relative overflow-hidden rounded-[1.6rem] bg-[#EAF2FF]">
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
                  priority
                />
              </div>
              {/* Corner badge */}
              <div className="absolute top-4 right-4 rounded-xl bg-[#E39A1C] px-3 py-1.5 text-xs font-extrabold text-[#111827] shadow-lg shadow-[#E39A1C]/35">
                120W
              </div>
            </div>

            {galleryImages.length > 1 && (
              <div className="mt-3 hidden">
                {galleryImages.map((src, index) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={product.galleryLabels[index] ?? `صورة ${index + 1}`}
                    aria-pressed={activeImage === index}
                    className="sr-only"
                  >
                    <ProductImage
                      src={src}
                      alt={product.galleryLabels[index] ?? product.nameAr}
                      fallbackLabel={product.galleryLabels[index] ?? product.galleryLabels[0]}
                      aspect="square"
                      fit="cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Copy + offers */}
          <div dir="rtl" className="order-2 text-right lg:order-1">
            <p className="mb-2 text-sm font-extrabold tracking-wide text-[#E39A1C]">{product.category}</p>
            <h1 className="mb-3 font-heading text-3xl font-extrabold leading-[1.15] text-[#111827] text-balance md:text-4xl lg:text-[2.6rem]">
              {product.checkoutHeadline}
            </h1>

            <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <span className="inline-flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon
                    key={i}
                    name="star"
                    size={16}
                    className={i < Math.round(product.rating) ? 'text-[#E39A1C]' : 'text-[#D1D5DB]'}
                  />
                ))}
                <span className="font-bold text-[#111827]">{product.rating}</span>
                <span className="text-[#6B7280]">({product.reviewCount} تقييم)</span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#B45309]">
                <Icon name="flame" size={15} className="text-[#E39A1C]" />
                {product.soldText}
              </span>
            </div>

            <p className="mb-5 text-base font-medium leading-relaxed text-[#4B5563] md:text-lg">
              {product.checkoutDescription}
            </p>

            <ul className="mb-6 space-y-2.5">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 font-bold text-[#111827]">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EAF2FF] text-[#1663D6]">
                    <Icon name="check" size={14} />
                  </span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            {/* Scarcity */}
            <div
              className={`mb-6 flex items-center gap-3 rounded-2xl border border-[#E39A1C] bg-[#FFF7D6] px-4 py-3 font-bold text-[#111827] ${
                isAvailable ? 'animate-pulse' : ''
              }`}
              style={{ animationDuration: '3s' }}
            >
              <Icon name="flame" size={18} className="shrink-0 text-[#E39A1C]" />
              <p>{product.scarcityText}</p>
            </div>

            <div ref={cardRef} className="mb-3 flex items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1663D6] text-sm font-bold text-white">
                1
              </span>
              <p className="font-heading font-extrabold text-[#111827]">اختار العرض</p>
            </div>

            <div id="cc-pricing" className="mb-5 flex scroll-mt-28 flex-col gap-3">
              {product.offers.map((offer) => {
                const isSelected = selected === offer.quantity;
                const savings = offer.compareAt != null ? offer.compareAt - offer.price : null;
                return (
                  <div key={offer.quantity} className="relative">
                    {offer.badge && (
                      <span
                        className={`absolute -top-2.5 right-4 z-10 rounded-full px-3 py-1 text-[0.65rem] font-extrabold text-white shadow-lg ${
                          offer.badge === 'أقصى توفير'
                            ? 'bg-[#16A34A]'
                            : 'bg-[#E39A1C] text-[#111827]'
                        }`}
                      >
                        {offer.badge}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => selectOffer(offer.quantity)}
                      aria-pressed={isSelected}
                      disabled={!isAvailable}
                      className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-right transition-all ${
                        isSelected && isAvailable
                          ? 'border-[#1663D6] bg-[#EAF2FF] shadow-[0_0_0_1px_rgba(22,99,214,0.2)]'
                          : 'border-[#E5E7EB] bg-[#FFFFFF] hover:border-[#1663D6]/40'
                      } ${!isAvailable ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                          isSelected && isAvailable ? 'border-[#1663D6] bg-[#1663D6]' : 'border-[#D1D5DB]'
                        }`}
                      >
                        {isSelected && isAvailable && <span className="h-2 w-2 rounded-full bg-white" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-heading font-bold text-[#111827]">{offer.label}</span>
                        {offer.sublabel && (
                          <span className="mt-0.5 block text-sm text-[#6B7280]">{offer.sublabel}</span>
                        )}
                      </span>
                      <span className="shrink-0 text-start">
                        <span className="flex items-baseline gap-1">
                          <span className="font-heading text-2xl font-extrabold leading-none text-[#1663D6]">
                            {offer.price}
                          </span>
                          <span className="text-sm font-semibold text-[#6B7280]">{CURRENCY}</span>
                        </span>
                        {offer.compareAt && (
                          <span className="mt-0.5 block text-xs text-[#6B7280] line-through">
                            {offer.compareAt} {CURRENCY}
                          </span>
                        )}
                        {savings != null && savings > 0 && (
                          <span className="mt-1 inline-block rounded-full bg-[#FFF7D6] px-2 py-0.5 text-[0.7rem] font-extrabold text-[#B45309]">
                            وفّر {savings} {CURRENCY}
                          </span>
                        )}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Checkout form */}
            <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF]">
              <div className="flex items-center gap-3 bg-[#EAF2FF] px-5 py-3.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1663D6] text-sm font-bold text-white">
                  2
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-sm font-extrabold leading-none text-[#111827]">
                    أكمل بياناتك — التوصيل مجاناً
                  </p>
                  <p className="mt-0.5 text-xs text-[#4B5563]">دفع عند الاستلام • لا حاجة لبطاقة بنكية</p>
                </div>
                <span className="shrink-0 rounded-full bg-[#E39A1C] px-2.5 py-1 text-[0.6rem] font-extrabold leading-none text-[#111827]">
                  الخطوة الأخيرة
                </span>
              </div>

              <div className="px-5 pb-5 pt-4">
                <form onSubmit={(e) => { void handleSubmit(e); }} noValidate className="space-y-3">
                  <div>
                    <label htmlFor="cc-checkout-name" className="mb-1.5 block text-sm font-bold text-[#111827]">
                      الاسم الكامل
                    </label>
                    <input
                      ref={nameRef}
                      id="cc-checkout-name"
                      type="text"
                      name="name"
                      autoComplete="name"
                      placeholder="مثلاً: محمد العلوي"
                      value={formData.name}
                      onChange={(e) => setField('name', e.target.value)}
                      onBlur={(e) => handleBlur('name', e.target.value)}
                      disabled={submitting}
                      aria-invalid={Boolean(showError('name'))}
                      className={`w-full rounded-xl border bg-[#FFFFFF] px-4 py-3 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1663D6]/35 ${
                        showError('name') ? 'border-[#DC2626]' : 'border-[#E5E7EB]'
                      }`}
                    />
                    {showError('name') && (
                      <p className="mt-1 text-xs font-semibold text-[#DC2626]" role="alert">
                        {showError('name')}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="cc-checkout-phone" className="mb-1.5 block text-sm font-bold text-[#111827]">
                      رقم الهاتف
                    </label>
                    <input
                      id="cc-checkout-phone"
                      type="tel"
                      dir="ltr"
                      name="phone"
                      autoComplete="tel"
                      placeholder="06XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setField('phone', e.target.value)}
                      onBlur={(e) => handleBlur('phone', e.target.value)}
                      disabled={submitting}
                      aria-invalid={Boolean(showError('phone'))}
                      className={`w-full rounded-xl border bg-[#FFFFFF] px-4 py-3 text-left text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1663D6]/35 ${
                        showError('phone') ? 'border-[#DC2626]' : 'border-[#E5E7EB]'
                      }`}
                    />
                    {showError('phone') ? (
                      <p className="mt-1 text-xs font-semibold text-[#DC2626]" role="alert">
                        {showError('phone')}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-[#6B7280]">سيتصل بك المندوب على هذا الرقم للتأكيد</p>
                    )}
                  </div>

                  {submitError && (
                    <p className="rounded-xl border border-[#DC2626] bg-[#FEE2E2] px-4 py-2.5 text-sm font-semibold text-[#DC2626]" role="alert">
                      {submitError}
                    </p>
                  )}

                  <div className="flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-[#F7F7F5] px-4 py-3">
                    <div className="text-sm">
                      <p className="font-bold leading-none text-[#111827]">{selectedOffer?.label ?? firstOffer.label}</p>
                      {(selectedOffer?.sublabel ?? firstOffer.sublabel) && (
                        <p className="mt-0.5 text-xs text-[#6B7280]">
                          {selectedOffer?.sublabel ?? firstOffer.sublabel}
                        </p>
                      )}
                    </div>
                    <div className="text-end">
                      <p className="text-lg font-extrabold leading-none text-[#1663D6]">
                        {selectedOffer?.price ?? firstOffer.price}{' '}
                        <span className="text-sm font-semibold text-[#6B7280]">{CURRENCY}</span>
                      </p>
                      {(selectedOffer?.compareAt ?? firstOffer.compareAt) && (
                        <p className="mt-0.5 text-[0.65rem] text-[#6B7280] line-through">
                          {selectedOffer?.compareAt ?? firstOffer.compareAt} {CURRENCY}
                        </p>
                      )}
                    </div>
                  </div>

                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#16A34A]/35 bg-[#16A34A]/10 px-4 py-2.5 text-sm font-extrabold text-[#166534] transition-colors hover:bg-[#16A34A]/15"
                  >
                    <Icon name="whatsapp" size={18} />
                    <span>تواصل واتساب</span>
                  </a>

                  <button
                    type="submit"
                    disabled={!isAvailable || submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1663D6] py-4 text-lg font-black text-white shadow-[0_10px_35px_-8px_rgba(22,99,214,0.5)] transition-all hover:scale-[1.01] hover:bg-[#124FA8] disabled:opacity-50 disabled:hover:scale-100 animate-cta-pulse"
                  >
                    {submitting ? (
                      <>
                        <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        جاري تأكيد طلبك...
                      </>
                    ) : (
                      <>
                        <Icon name="lock" size={20} />
                        {isAvailable ? 'اطلب لآن 🚀' : 'غير متوفر حالياً'}
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="flex flex-col items-center gap-1 rounded-xl border border-[#16A34A]/20 bg-[#16A34A]/10 px-1 py-2.5 text-center">
                      <Icon name="wallet" size={16} className="text-[#16A34A]" />
                      <p className="text-[0.6rem] font-bold leading-tight text-[#166534]">دفع عند الاستلام</p>
                    </div>
                    <div className="flex flex-col items-center gap-1 rounded-xl border border-[#16A34A]/20 bg-[#16A34A]/10 px-1 py-2.5 text-center">
                      <Icon name="truck" size={16} className="text-[#16A34A]" />
                      <p className="text-[0.6rem] font-bold leading-tight text-[#166534]">توصيل مجاني</p>
                    </div>
                    <div className="flex flex-col items-center gap-1 rounded-xl border border-[#16A34A]/20 bg-[#16A34A]/10 px-1 py-2.5 text-center">
                      <Icon name="refresh" size={16} className="text-[#16A34A]" />
                      <p className="text-[0.6rem] font-bold leading-tight text-[#166534]">استرجاع مضمون</p>
                    </div>
                  </div>

                  <p className="flex items-center justify-center gap-1 pt-0.5 text-center text-xs text-[#6B7280]">
                    <Icon name="lock" size={12} className="shrink-0" />
                    بياناتك آمنة — لن نشاركها مع أي طرف
                  </p>
                </form>
              </div>
            </div>

            {upsellProduct && (
              <UpsellPopup product={upsellProduct} onAdded={handleUpsellAdded} onClose={handleUpsellClose} />
            )}
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-[#E5E7EB] bg-[#FFFFFF]/95 backdrop-blur transition-transform duration-300 ${
          showSticky ? 'translate-y-0' : 'translate-y-full'
        }`}
        aria-hidden={!showSticky}
      >
        <div className="container-wide py-3">
          <button
            type="button"
            onClick={handleStickyClick}
            disabled={!isAvailable}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1663D6] py-3.5 text-sm font-extrabold text-white shadow-lg transition-colors hover:bg-[#124FA8] disabled:opacity-50 md:hidden animate-cta-pulse"
          >
            <Icon name="arrow-up" size={18} />
            {isAvailable ? `اطلب دابا — ${firstOffer.price} ${CURRENCY}` : 'غير متوفر حالياً'}
          </button>

          <div dir="rtl" className="mx-auto hidden w-full max-w-3xl items-center gap-3 md:flex">
            <div className="flex min-w-0 max-w-[11rem] shrink-0 items-center gap-2.5">
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-[#E5E7EB] bg-[#EAF2FF]">
                <ProductImage
                  src={galleryImages[0] ?? product.image}
                  alt={product.nameAr}
                  fallbackLabel={product.nameAr}
                  aspect="square"
                  fit="cover"
                />
              </div>
              <p className="truncate text-sm font-bold text-[#111827]">{product.nameAr}</p>
            </div>
            <p className="shrink-0 text-lg font-extrabold text-[#1663D6]">
              {firstOffer.price} {CURRENCY}
            </p>
            <button
              type="button"
              onClick={handleStickyClick}
              disabled={!isAvailable}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1663D6] py-3 font-extrabold text-white shadow-lg transition-colors hover:bg-[#124FA8] disabled:opacity-50 animate-cta-pulse"
            >
              <Icon name="lock" size={18} />
              {isAvailable ? 'اطلب الآن' : 'غير متوفر حالياً'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
