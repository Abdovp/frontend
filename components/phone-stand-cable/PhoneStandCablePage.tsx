import Head from 'next/head';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../Header';
import Footer from '../Footer';
import WhatsAppFloat from '../ui/WhatsAppFloat';
import ProductImage from '../ui/ProductImage';
import Icon from '../ui/Icon';
import { trackViewContent, trackInitiateCheckout, trackPurchase } from '../../lib/analytics/track';
import { createPurchaseEventId, submitOrder } from '../../lib/api/orders';
import { getCheckoutErrorMessage } from '../../lib/api/order-errors';
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
import UpsellPopup from '../UpsellPopup';

const CONTENT_CARDS = [
  {
    id: 'charger',
    title: 'شاحن السيارة 4 في 1',
    text: 'تنظيم للشحن داخل السيارة، قوة عملية، وشكل منظم كيخدم فاليوم كامل.',
    bullets: ['شحن سريع ومنظم', '4 منافذ/وظائف فواحد', 'مناسب للسفر والرحلات'],
    image: '/images/car-charger-bundle-detail.svg',
  },
  {
    id: 'cable',
    title: 'Foldable Phone Stand Data Cable',
    text: 'كابل واحد كيشحن وكيتفتح كحامل للهاتف وكينقل البيانات بلا تعقيد.',
    bullets: ['حامل قابل للطي', 'نقل بيانات سريع', 'مفيد فالمكتب والسفر'],
    image: '/images/car-charger-bundle-how.svg',
  },
] as const;

type OfferQuantity = 1 | 2 | 3;

function SectionHeading({ eyebrow, title, body }: { eyebrow?: string; title: string; body: string }) {
  return (
    <div dir="rtl" className="mx-auto max-w-3xl text-center">
      {eyebrow && (
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E39A1C]/25 bg-[#FFF7D6] px-3.5 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-widest2 text-[#B45309]">
          <Icon name="spark" size={13} className="text-[#E39A1C]" />
          {eyebrow}
        </p>
      )}
      <h2 className="font-heading text-2xl font-extrabold leading-snug text-balance text-[#111827] sm:text-3xl md:text-4xl">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-[#4B5563] md:text-lg">{body}</p>
    </div>
  );
}

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF] shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((next) => !next)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-right"
      >
        <span className="font-bold text-[#111827]">{q}</span>
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EAF2FF] text-[#1663D6] transition-transform ${open ? 'rotate-180' : ''}`}>
          <Icon name="chevron-down" size={16} />
        </span>
      </button>
      {open && <p className="px-5 pb-4 text-sm leading-relaxed text-[#4B5563]">{a}</p>}
    </div>
  );
}

function SimpleSection({
  title,
  body,
  bullets,
  image,
  reverse = false,
  eyebrow = 'الحل',
}: {
  title: string;
  body: string;
  bullets: string[];
  image: string;
  reverse?: boolean;
  eyebrow?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-[#FFFFFF] py-14 md:py-20">
      <div className="container-wide relative">
        <div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${reverse ? 'lg:[direction:rtl]' : ''}`}>
          <div className={reverse ? 'order-1 lg:order-2' : 'order-1'}>
            <div className="relative overflow-hidden rounded-[2rem] border border-[#E5E7EB] bg-[#FFFFFF] shadow-2xl shadow-[#111827]/10">
              <ProductImage src={image} alt={title} fallbackLabel={title} fallbackSublabel={eyebrow} aspect="square" fit="cover" />
            </div>
          </div>

          <div dir="rtl" className={reverse ? 'order-2 lg:order-1 text-right' : 'order-2 text-right'}>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E39A1C]/25 bg-[#FFF7D6] px-3.5 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-widest2 text-[#B45309]">
              <Icon name={eyebrow === 'إثبات' ? 'star' : eyebrow === 'كيفاش كيخدم' ? 'truck' : 'spark'} size={13} />
              {eyebrow}
            </p>
            <h3 className="mb-4 font-heading text-2xl font-extrabold leading-snug text-balance text-[#111827] sm:text-3xl md:text-4xl">
              {title}
            </h3>
            <p className="mb-6 text-base leading-relaxed text-[#4B5563] md:text-lg">{body}</p>
            <ul className="space-y-3">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3 text-[#111827]">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EAF2FF] text-[#1663D6]">
                    <Icon name="check" size={14} />
                  </span>
                  <span className="font-semibold leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewsSection({ product }: { product: Product }) {
  return (
    <section className="relative overflow-hidden bg-[#FFFFFF] py-14 md:py-20">
      <div className="container-wide relative">
        <SectionHeading
          eyebrow="إثبات اجتماعي"
          title={product.proof.title}
          body={product.proof.body}
        />

        {product.proof.bullets && (
          <div dir="rtl" className="mt-8 mb-12 flex flex-wrap justify-center gap-3">
            {product.proof.bullets.map((bullet) => (
              <span key={bullet} className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-[#F7F7F5] px-4 py-2 text-sm font-bold text-[#111827]">
                <Icon name="check-circle" size={15} className="text-[#16A34A]" />
                {bullet}
              </span>
            ))}
          </div>
        )}

        <div dir="rtl" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {product.reviews.slice(0, 3).map((review) => (
            <div key={review.name} className="rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF] p-5 shadow-sm transition-colors hover:border-[#1663D6]/35">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} name="star" size={14} className={i < review.rating ? 'text-[#E39A1C]' : 'text-[#D1D5DB]'} />
                  ))}
                </div>
                <span className="text-xs text-[#64748B]">{review.date}</span>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-[#4B5563]">&ldquo;{review.text}&rdquo;</p>
              <div className="flex items-center gap-2 border-t border-[#E5E7EB] pt-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAF2FF] text-xs font-extrabold text-[#1663D6]">{review.name.charAt(0)}</span>
                <div>
                  <p className="text-sm font-bold text-[#111827]">{review.name}</p>
                  <p className="text-xs text-[#64748B]">{review.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection({ product }: { product: Product }) {
  return (
    <section className="relative overflow-hidden bg-[#F1F3F5] py-14 md:py-20">
      <div className="container-wide relative">
        <div dir="rtl" className="mb-10 text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E39A1C]/25 bg-[#FFF7D6] px-3.5 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-widest2 text-[#B45309]">
            <Icon name="chat" size={13} />
            الأسئلة الشائعة
          </p>
          <h2 className="font-heading text-2xl font-extrabold text-[#111827] sm:text-3xl md:text-4xl">عندك شي سؤال؟ جاوبنا عليه هنا</h2>
        </div>

        <div dir="rtl" className="mx-auto max-w-3xl space-y-8">
          {product.faqs.map((group) => (
            <div key={group.title}>
              <h3 className="mb-3 font-heading text-lg font-extrabold text-[#1663D6]">{group.title}</h3>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <FaqRow key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ product }: { product: Product }) {
  const offer = getFirstOffer(product);
  return (
    <section className="relative overflow-hidden bg-[#111827] py-14 md:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute -bottom-24 left-1/2 h-80 w-[520px] -translate-x-1/2 rounded-full bg-[#1663D6]/25 blur-[120px]" />
      </div>

      <div className="container-wide relative">
        <div dir="rtl" className="mb-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
          {product.guarantees.map((g) => (
            <div key={g.title} className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#1663D6]">
                <Icon name={g.icon} size={20} />
              </span>
              <div className="min-w-0">
                <p className="truncate font-heading text-sm font-extrabold text-white">{g.title}</p>
                <p className="truncate text-xs text-white/70">{g.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        <div dir="rtl" className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-[#1663D6]/20 p-8 text-center md:p-14">
          <h2 className="mb-3 font-heading text-2xl font-extrabold text-white sm:text-3xl md:text-4xl">
            بغيتي باك منظم كيجمع بين الشحن والحامل؟
          </h2>
          <p className="mx-auto mb-7 max-w-xl text-base text-white/80 md:text-lg">
            {product.checkoutHeadline} — الباك كامل ب {offer.price} {CURRENCY} فقط، مع دفع عند الاستلام وتوصيل سريع فالمغرب.
          </p>
          <a
            href="#psc-pricing"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#1663D6] px-8 py-4 text-base font-extrabold text-white shadow-[0_15px_45px_-10px_rgba(22,99,214,0.65)] transition-all hover:scale-[1.03] hover:bg-[#124FA8]"
          >
            <Icon name="lock" size={20} />
            اطلب الآن — {offer.price} {CURRENCY}
          </a>
        </div>
      </div>
    </section>
  );
}

function BundleHero({ product }: { product: Product }) {
  const { setSelectedOffer } = useCartStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [showSticky, setShowSticky] = useState(false);
  const isAvailable = isProductAvailable(product);
  const router = useRouter();

  const defaultOffer = useMemo(() => getFirstOffer(product).quantity as OfferQuantity, [product]);
  const selected = useCartStore((state) => state.selectedOffers[product.id] ?? defaultOffer);
  const selectedOffer = useMemo(() => product.offers.find((offer) => offer.quantity === selected), [product.offers, selected]);
  const firstOffer = useMemo(() => getFirstOffer(product), [product]);
  const whatsappNumber = useMemo(() => STORE.whatsapp.replace(/\D/g, ''), []);
  const whatsappHref = useMemo(() => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('مرحبا! بغيـت معلومات على باك الشحن الذكي للسيارة.')}`, [whatsappNumber]);
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
    const observer = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting), {
      threshold: 0,
      rootMargin: '-8px 0px 0px 0px',
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    void router.prefetch('/thank-you');
  }, [router]);

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

  const showError = (field: CheckoutField) => errors[field] && (touched[field] || submitting) ? errors[field] : undefined;

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
      const firstInvalid = (['name', 'phone'] as CheckoutField[]).find((field) => nextErrors[field]);
      if (firstInvalid) {
        document.getElementById(`psc-checkout-${firstInvalid}`)?.focus();
      }
      return;
    }

    const offer = product.offers.find((item) => item.quantity === selected);
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
    document.getElementById('psc-checkout-name')?.focus();
    document.getElementById('psc-pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative overflow-hidden bg-[#FFFFFF] pt-8 pb-14 md:pt-14 md:pb-20">
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
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="order-1 lg:col-start-2 lg:row-start-1 lg:sticky lg:top-28">
            <div className="relative rounded-[2rem] border border-[#E5E7EB] bg-[#FFFFFF] p-2 shadow-[0_30px_80px_-20px_rgba(17,24,39,0.2)]">
              <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-tr from-[#E39A1C]/25 via-transparent to-[#1663D6]/20 opacity-70" />
              <div className="relative overflow-hidden rounded-[1.6rem] bg-[#EAF2FF]">
                <ProductImage
                  src={product.image}
                  alt={product.nameAr}
                  fallbackLabel={product.nameAr}
                  fallbackSublabel={product.category}
                  aspect="square"
                  fit="cover"
                  priority
                />
              </div>
              <div className="absolute top-4 right-4 rounded-xl bg-[#E39A1C] px-3 py-1.5 text-xs font-extrabold text-[#111827] shadow-lg shadow-[#E39A1C]/35">
                Pack
              </div>
            </div>
          </div>

          <div dir="rtl" className="order-2 lg:col-start-1 lg:row-start-1 text-right">
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

            <p className="mb-5 text-base font-medium leading-relaxed text-[#4B5563] md:text-lg">{product.checkoutDescription}</p>

            <ul className="mb-6 space-y-2.5">
              {product.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-3 font-bold text-[#111827]">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EAF2FF] text-[#1663D6]">
                    <Icon name="check" size={14} />
                  </span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

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
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1663D6] text-sm font-bold text-white">1</span>
              <p className="font-heading font-extrabold text-[#111827]">اختار العرض</p>
            </div>

            <div id="psc-pricing" className="mb-5 flex scroll-mt-28 flex-col gap-3">
              {product.offers.map((offer) => {
                const isSelected = selected === offer.quantity;
                const savings = offer.compareAt != null ? offer.compareAt - offer.price : null;
                return (
                  <div key={offer.quantity} className="relative">
                    {offer.badge && (
                      <span
                        className={`absolute -top-2.5 right-4 z-10 rounded-full px-3 py-1 text-[0.65rem] font-extrabold text-white shadow-lg ${
                          offer.badge === 'أقصى توفير' ? 'bg-[#16A34A]' : 'bg-[#E39A1C] text-[#111827]'
                        }`}
                      >
                        {offer.badge}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => isAvailable && setSelectedOffer(product.id, offer.quantity)}
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
                        {offer.sublabel && <span className="mt-0.5 block text-sm text-[#6B7280]">{offer.sublabel}</span>}
                      </span>
                      <span className="shrink-0 text-start">
                        <span className="flex items-baseline gap-1">
                          <span className="font-heading text-2xl font-extrabold leading-none text-[#1663D6]">{offer.price}</span>
                          <span className="text-sm font-semibold text-[#6B7280]">{CURRENCY}</span>
                        </span>
                        {offer.compareAt && (
                          <span className="mt-0.5 block text-xs text-[#6B7280] line-through">{offer.compareAt} {CURRENCY}</span>
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

            <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF]">
              <div className="flex items-center gap-3 bg-[#EAF2FF] px-5 py-3.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1663D6] text-sm font-bold text-white">2</span>
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-sm font-extrabold leading-none text-[#111827]">أكمل بياناتك — التوصيل مجاناً</p>
                  <p className="mt-0.5 text-xs text-[#4B5563]">دفع عند الاستلام • لا حاجة لبطاقة بنكية</p>
                </div>
                <span className="shrink-0 rounded-full bg-[#E39A1C] px-2.5 py-1 text-[0.6rem] font-extrabold leading-none text-[#111827]">الخطوة الأخيرة</span>
              </div>

              <div className="px-5 pb-5 pt-4">
                <form onSubmit={(e) => { void handleSubmit(e); }} noValidate className="space-y-3">
                  <div>
                    <label htmlFor="psc-checkout-name" className="mb-1.5 block text-sm font-bold text-[#111827]">الاسم الكامل</label>
                    <input
                      ref={nameRef}
                      id="psc-checkout-name"
                      type="text"
                      name="name"
                      autoComplete="name"
                      placeholder="مثلاً: محمد العلوي"
                      value={formData.name}
                      onChange={(e) => setField('name', e.target.value)}
                      onBlur={(e) => handleBlur('name', e.target.value)}
                      disabled={submitting}
                      aria-invalid={Boolean(showError('name'))}
                      className={`w-full rounded-xl border bg-[#FFFFFF] px-4 py-3 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1663D6]/35 ${showError('name') ? 'border-[#DC2626]' : 'border-[#E5E7EB]'}`}
                    />
                    {showError('name') && <p className="mt-1 text-xs font-semibold text-[#DC2626]" role="alert">{showError('name')}</p>}
                  </div>

                  <div>
                    <label htmlFor="psc-checkout-phone" className="mb-1.5 block text-sm font-bold text-[#111827]">رقم الهاتف</label>
                    <input
                      id="psc-checkout-phone"
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
                      className={`w-full rounded-xl border bg-[#FFFFFF] px-4 py-3 text-left text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1663D6]/35 ${showError('phone') ? 'border-[#DC2626]' : 'border-[#E5E7EB]'}`}
                    />
                    {showError('phone') ? (
                      <p className="mt-1 text-xs font-semibold text-[#DC2626]" role="alert">{showError('phone')}</p>
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
                        <p className="mt-0.5 text-xs text-[#6B7280]">{selectedOffer?.sublabel ?? firstOffer.sublabel}</p>
                      )}
                    </div>
                    <div className="text-end">
                      <p className="text-lg font-extrabold leading-none text-[#1663D6]">{selectedOffer?.price ?? firstOffer.price} <span className="text-sm font-semibold text-[#6B7280]">{CURRENCY}</span></p>
                      {(selectedOffer?.compareAt ?? firstOffer.compareAt) && (
                        <p className="mt-0.5 text-[0.65rem] text-[#6B7280] line-through">{selectedOffer?.compareAt ?? firstOffer.compareAt} {CURRENCY}</p>
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
                    disabled={submitting || !isAvailable}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1663D6] px-4 py-3.5 text-base font-extrabold text-white shadow-[0_15px_35px_-12px_rgba(22,99,214,0.7)] transition-all hover:bg-[#124FA8] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Icon name="cart" size={19} />
                    <span>{submitting ? 'جاري التأكيد...' : 'أكمل الطلب'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

      </div>

      {showSticky && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E5E7EB] bg-[#FFFFFF]/95 px-4 py-3 backdrop-blur md:hidden">
          <button
            type="button"
            onClick={handleStickyClick}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1663D6] px-4 py-3 text-base font-extrabold text-white"
          >
            <Icon name="cart" size={18} />
            <span>اطلب الآن — {selectedOffer?.price ?? firstOffer.price} {CURRENCY}</span>
          </button>
        </div>
      )}

      {upsellProduct && <UpsellPopup product={upsellProduct} onAccept={handleUpsellAdded} onClose={handleUpsellClose} />}
    </section>
  );
}

export default function PhoneStandCablePage({ product }: { product: Product }) {
  useEffect(() => {
    trackViewContent({
      productId: product.id,
      name: product.nameAr,
      price: product.offers[0]?.price ?? 0,
    });
  }, [product.id, product.nameAr, product.offers]);

  return (
    <>
      <Head>
        <title>{`${product.nameAr} | بويا شوب`}</title>
        <meta name="description" content={product.metaDescription} />
        <meta property="og:title" content={`${product.nameAr} | بويا شوب`} />
        <meta property="og:description" content={product.metaDescription} />
        <meta name="theme-color" content="#F7F7F5" />
      </Head>
      <div className="relative bg-[#FFFFFF] text-[#111827]">
        <Header />
        <main>
          <BundleHero product={product} />
          <SimpleSection
            eyebrow="المشكل"
            title={product.pain.title}
            body={product.pain.body}
            bullets={product.pain.bullets ?? []}
            image={product.pain.image ?? product.image ?? ''}
            reverse
          />
          <SimpleSection
            eyebrow="الحل"
            title={product.logic.title}
            body={product.logic.body}
            bullets={product.logic.bullets ?? []}
            image={product.logic.image ?? product.image ?? ''}
          />
          <SimpleSection
            eyebrow="كيفاش كتستعمل"
            title={product.howToUse.title}
            body="خطوات بسيطة باش تستفد من الباك فالسفر، المكتب، والسيارة بلا تعقيد."
            bullets={product.howToUse.steps.map((step) => `${step.title} — ${step.body}`)}
            image={product.howToUse.image ?? product.image ?? ''}
            reverse
          />
          <ReviewsSection product={product} />
          <FAQSection product={product} />
          <FinalCTA product={product} />
        </main>
        <Footer />
        <WhatsAppFloat />
      </div>
    </>
  );
}
