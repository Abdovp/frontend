import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import WhatsAppFloat from '../ui/WhatsAppFloat';
import Icon from '../ui/Icon';
import { useCartStore } from '../../lib/cart-store';
import { createPurchaseEventId, submitOrder } from '../../lib/api/orders';
import { getCheckoutErrorMessage } from '../../lib/api/order-errors';
import { trackInitiateCheckout, trackPurchase } from '../../lib/analytics/track';
import { CURRENCY, STORE, products } from '../../lib/products';
import { validateCheckoutForm } from '../../lib/checkout-validation';
import { saveOrderConfirmation } from '../../lib/order-confirmation';

const offers = [
  {
    id: 'single',
    label: 'باك واحد',
    price: 199,
    oldPrice: 349,
    badge: 'أفضل قيمة',
    perk: 'توصيل سريع + دفع عند الاستلام',
  },
  {
    id: 'double',
    label: 'عرض خاص',
    price: 349,
    oldPrice: 398,
    badge: 'وفر 49 درهم',
    perk: 'باك كامل + شحن سريع',
  },
] as const;

const starRow = Array.from({ length: 5 }, (_, index) => (
  <span key={index} className="text-[#f7b500] text-lg">★</span>
));

const whatsappNumber = STORE.whatsapp.replace(/\D/g, '');
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('السلام عليكم، بدي اطلب باك إضاءة الوجه + تنظيف الأسنان')}`;

export default function GlowSmilePackPage() {
  const router = useRouter();
  const [selectedOffer, setSelectedOffer] = useState<(typeof offers)[number]['id']>('double');
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [formErrors, setFormErrors] = useState<{ name?: string; phone?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const pricingSection = document.getElementById('product-pricing');
      if (!pricingSection) return;

      const rect = pricingSection.getBoundingClientRect();
      setShowStickyCta(rect.top < window.innerHeight * 0.6);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeOffer = offers.find((offer) => offer.id === selectedOffer) ?? offers[0];

  const handleCheckoutCTA = async () => {
    const errors = validateCheckoutForm({
      name: customerName,
      phone: customerPhone,
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      document.getElementById('cta-form')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      return;
    }

    setFormErrors({});
    setSubmitting(true);
    setSubmitError('');

    const product = products['face-pack'] ?? products['cooling-pack'];
    const offer = product.offers.find((item) => item.quantity === (selectedOffer === 'double' ? 2 : 1)) ?? product.offers[0];
    const items = [
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

    trackInitiateCheckout(
      items.map((item) => ({ productId: item.id, name: item.name, price: item.price, quantity: item.quantity })),
      total
    );

    const eventId = createPurchaseEventId();

    try {
      const result = await submitOrder({
        eventId,
        name: customerName.trim(),
        phone: customerPhone.trim(),
        items,
        total,
      });

      saveOrderConfirmation({
        name: customerName.trim(),
        phone: customerPhone.trim(),
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

      setSubmitting(false);
      await router.push('/thank-you');
    } catch (error) {
      setSubmitError(getCheckoutErrorMessage(error));
      setSubmitting(false);
    }
  };

  const handleAddToCart = () => {
    handleCheckoutCTA();
  };

  return (
    <>
      <Head>
        <title>باك إضاءة الوجه + تنظيف الأسنان | بويا شوب</title>
        <meta
          name="description"
          content="باك مكوّن من XR Cleaner لتفتيح البقع السوداء و Oral Irrigator لتنظيف الأسنان بين الأسنان. حل عملي لوجه أنعم وابتسامة أنظف. دفع عند الاستلام و توصيل سريع في المغرب."
        />
        <meta
          property="og:title"
          content="باك إضاءة الوجه + تنظيف الأسنان | بويا شوب"
        />
        <meta
          property="og:description"
          content="باك مكوّن من XR Cleaner لتفتيح البقع السوداء و Oral Irrigator لتنظيف الأسنان بين الأسنان."
        />
      </Head>

      <div className="min-h-screen bg-[#fffaf6] text-[#1f1b1a]">
        <Header />

        <main className="overflow-hidden pb-24">
          <div
            className={`fixed inset-x-0 bottom-4 z-50 px-3 transition-all duration-300 ${showStickyCta ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-5 opacity-0'}`}
          >
            <div className="mx-auto max-w-md rounded-full bg-white/80 p-1.5 shadow-[0_18px_40px_rgba(116,77,61,0.18)] ring-1 ring-[#f0d9cd] backdrop-blur-md">
              <button
                type="button"
                onClick={handleCheckoutCTA}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-[#f7d8cc] px-4 py-3 text-[#1f1b1a] shadow-[0_0_0_1px_rgba(255,255,255,0.4)] transition-all duration-300 [animation:ctaPulse_3s_ease-in-out_infinite]"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1f1d1d] text-sm font-black text-white">↑</span>
                <span className="text-sm font-black">اطلب الآن</span>
                <span className="text-lg font-black">{offers[0].price} {CURRENCY}</span>
              </button>
            </div>
          </div>

          <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(246,197,178,0.28),_transparent_30%),linear-gradient(135deg,#fffaf5_0%,#fff4ef_42%,#f4f7ff_100%)] py-10 md:py-16">
            <div className="container-wide relative z-10">
              <div className="layout-ltr grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
                <div className="order-1 lg:order-2 lg:sticky lg:top-28">
                  <div className="relative aspect-[1792/1920] overflow-hidden rounded-[30px] border border-[#f0d8cd] bg-white shadow-[0_25px_70px_rgba(126,78,60,0.12)]">
                    <Image
                      src="/images/pack-hero.jpg"
                      alt="باك إضاءة الوجه + تنظيف الأسنان"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-center"
                    />
                  </div>
                </div>

                <div dir="rtl" className="order-2 -mt-1 text-right lg:order-1 lg:-mt-2">
                  <h1 className="mb-2 font-heading text-3xl font-extrabold leading-[1.35] text-[#1d1d1d] md:text-4xl lg:text-5xl lg:leading-[1.3]">
                    باك كامل يخلّي وجهك ناعم <span className="text-[#c77763]">وابتسامتك أنضف</span>
                  </h1>

                  <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="flex items-center gap-1 rounded-full bg-[#fffaf6] px-2 py-1 ring-1 ring-[#f0dfd5]">{starRow}</span>
                      <span className="font-bold text-[#1d1d1d]">4.9</span>
                      <span className="text-[#5a4e49]">(2,400+ تقييم)</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-semibold text-[#734d3d]">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fbe9e3] text-[#a95c4a]">🔥</span>
                      الطلبات تزور بسرعة
                    </span>
                  </div>

                  <p className="mb-5 text-base leading-relaxed text-[#4d3f3a] md:text-lg">
                    تخلصي من البقع السوداء واللون المتجانس في البشرة، وخذي عناية عميقة للأسنان مع سلك الاسنان المائي في باك واحد مناسب للنساء والرجال.
                  </p>

                  <ul className="mb-6 space-y-2.5">
                    {[
                      'تخفيف مظهر البقع السوداء مع استعمال منتظم',
                      'تنظيف عميق بين الأسنان وتحسين رائحة الفم',
                      'روتين سهل وسريع في البيت',
                    ].map((highlight) => (
                      <li key={highlight} className="flex items-center gap-3 text-[#1d1d1d] font-bold">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f6e6df] text-[#a75c49]">
                          <span className="text-xs">✓</span>
                        </span>
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  <div className="mb-6 rounded-2xl border border-[#f2d6c8] bg-[#fff7f3] px-4 py-3 text-[#69473f] shadow-sm">
                    <div className="flex items-center gap-2 font-bold">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f7d6c8] text-[#9a5d4e]">⚡</span>
                      المخزون محدود — الطلبات بسرعة متزايدة هذه الأيام
                    </div>
                  </div>

                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1f1d1b] text-sm font-black text-white">
                      1
                    </span>
                    <p className="font-heading text-xl font-extrabold text-[#1d1d1d]">اختر العرض</p>
                  </div>

                  <div id="product-pricing" className="mb-5 flex scroll-mt-28 flex-col gap-3">
                    {offers.map((offer) => {
                      const isSelected = selectedOffer === offer.id;
                      const discount = Math.max(offer.oldPrice - offer.price, 0);
                      const shouldShowDiscount = offer.id === 'double';

                      return (
                        <div key={offer.id} className="relative">
                          <button
                            type="button"
                            onClick={() => setSelectedOffer(offer.id)}
                            aria-pressed={isSelected}
                            className={`offer-card w-full ${isSelected ? 'offer-card--selected' : ''}`}
                          >
                            <span className={`offer-radio ${isSelected ? 'offer-radio--checked' : ''}`} />
                            <span className="flex-1 min-w-0 text-right">
                              <span className="block font-heading text-lg font-bold text-[#1d1d1d]">{offer.label}</span>
                              <span className="mt-0.5 block text-sm text-[#5b4c48]">{offer.perk}</span>
                            </span>
                            <span className="shrink-0 text-left">
                              {offer.id === 'double' ? (
                                <>
                                  <span className="flex items-baseline gap-1">
                                    <span className="font-heading text-2xl font-extrabold leading-none text-[#1b5d96]">{offer.price}</span>
                                    <span className="text-sm font-semibold text-[#5a4c49]">{CURRENCY}</span>
                                  </span>
                                  {shouldShowDiscount && (
                                    <span className="mt-1 block rounded-full bg-[#f8dece] px-2 py-0.5 text-[0.6rem] font-black text-[#7e4b3b]">
                                      وفر {discount} {CURRENCY}
                                    </span>
                                  )}
                                  <span className="mt-1 block text-xs text-[#7a6d68] line-through">{offer.oldPrice} {CURRENCY}</span>
                                </>
                              ) : (
                                <>
                                  <span className="flex items-baseline gap-1">
                                    <span className="font-heading text-2xl font-extrabold leading-none text-[#1b5d96]">{offer.price}</span>
                                    <span className="text-sm font-semibold text-[#5a4c49]">{CURRENCY}</span>
                                  </span>
                                  <span className="mt-1 block text-xs text-[#7a6d68] line-through">{offer.oldPrice} {CURRENCY}</span>
                                </>
                              )}
                            </span>
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div id="cta-form" className="mt-2 scroll-mt-28 overflow-hidden rounded-2xl border border-[#e9dcd6] bg-white shadow-card">
                    <div className="flex items-center gap-3 bg-[#1f1d1d] px-5 py-3.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-sm font-bold text-white">2</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading text-sm font-extrabold leading-none text-white">أكمل بياناتك — التوصيل مجاناً</p>
                        <p className="mt-1 text-[0.65rem] text-white/75">دفع عند الاستلام • لا حاجة لبطاقة بنكية</p>
                      </div>
                    </div>

                    <div className="bg-white px-5 pt-4 pb-5">
                      <div className="space-y-3">
                        <div>
                          <label className="mb-1.5 block text-[0.72rem] font-black tracking-[0.12em] text-[#2f2a28]">الاسم الكامل</label>
                          <div className={`rounded-xl border bg-[#fffaf8] px-3 py-2 ${formErrors.name ? 'border-[#d86262]' : 'border-[#f0e4df]'}`}>
                            <input
                              type="text"
                              value={customerName}
                              onChange={(e) => {
                                setCustomerName(e.target.value);
                                if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: undefined }));
                              }}
                              placeholder="مثلاً: ابتسام"
                              className="w-full border-0 bg-transparent text-right text-sm text-[#2c2726] outline-none placeholder:text-[#9d8f8a]"
                              aria-invalid={Boolean(formErrors.name)}
                            />
                          </div>
                          {formErrors.name && <p className="mt-1 text-[0.62rem] font-bold text-[#c94d4d]">{formErrors.name}</p>}
                        </div>

                        <div>
                          <label className="mb-1.5 block text-[0.72rem] font-black tracking-[0.12em] text-[#2f2a28]">رقم الهاتف</label>
                          <div className={`rounded-xl border bg-[#fffaf8] px-3 py-2 ${formErrors.phone ? 'border-[#d86262]' : 'border-[#f0e4df]'}`}>
                            <input
                              type="tel"
                              dir="ltr"
                              value={customerPhone}
                              onChange={(e) => {
                                setCustomerPhone(e.target.value);
                                if (formErrors.phone) setFormErrors((prev) => ({ ...prev, phone: undefined }));
                              }}
                              placeholder="06XXXXXXXX"
                              className="w-full border-0 bg-transparent text-left text-sm text-[#2c2726] outline-none placeholder:text-[#9d8f8a]"
                              aria-invalid={Boolean(formErrors.phone)}
                            />
                          </div>
                          {formErrors.phone && <p className="mt-1 text-[0.62rem] font-bold text-[#c94d4d]">{formErrors.phone}</p>}
                        </div>

                        <div className="rounded-xl border border-[#f4dbc8] bg-[#fff6f0] px-3 py-2.5">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-[0.62rem] font-black tracking-[0.14em] text-[#9b5e55] uppercase">
                              {selectedOffer === 'double' ? 'عرض خاص' : 'عرض أساسي'}
                            </span>
                            {selectedOffer === 'double' && (
                              <span className="rounded-full bg-[#f7d8c7] px-2 py-0.5 text-[0.6rem] font-black text-[#7e4d3b]">
                                وفر {Math.max((offers.find((offer) => offer.id === selectedOffer)?.oldPrice ?? 0) - (offers.find((offer) => offer.id === selectedOffer)?.price ?? 0), 0)} {CURRENCY}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-right">
                              <p className="font-bold text-[#1d1d1d]">{offers.find((offer) => offer.id === selectedOffer)?.label}</p>
                              <p className="text-[0.64rem] text-[#6b5d5a]">{offers.find((offer) => offer.id === selectedOffer)?.perk}</p>
                            </div>
                            <div className="text-left">
                              <p className="font-extrabold text-[#1d5a8e] text-lg leading-none">
                                {offers.find((offer) => offer.id === selectedOffer)?.price} <span className="text-sm font-semibold text-[#6a5e5b]">{CURRENCY}</span>
                              </p>
                              <p className="mt-0.5 text-[0.65rem] text-[#7d6a66] line-through">
                                {offers.find((offer) => offer.id === selectedOffer)?.oldPrice} {CURRENCY}
                              </p>
                            </div>
                          </div>
                        </div>

                        <a
                          href={whatsappLink}
                          target="_blank"
                          rel="noreferrer"
                          className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#9dd4a1] bg-[#1ebc58] px-3 py-2 text-sm font-black text-white shadow-sm transition hover:bg-[#18a94d]"
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                            <path d="M19.05 4.95A9.9 9.9 0 0 0 12.02 2a9.96 9.96 0 0 0-8.58 15.17L2 22l4.93-1.3a9.96 9.96 0 0 0 15.12-8.75ZM12.02 19.1c-1.59 0-3.15-.43-4.51-1.24l-.32-.19-2.93.77.78-2.85-.21-.3a8.13 8.13 0 0 1 12.35-9.72 8.1 8.1 0 0 1-6.16 13.53Zm4.46-6.08c-.25-.12-1.48-.73-1.71-.81-.22-.08-.39-.12-.55.12-.16.25-.61.81-.75.97-.14.16-.28.18-.53.06-.25-.12-1.05-.39-2-1.24-.74-.65-1.24-1.46-1.38-1.71-.15-.25-.02-.39.11-.51.11-.11.25-.28.37-.42.12-.14.16-.25.25-.42.08-.17.04-.32-.02-.45-.06-.12-.55-1.33-.75-1.82-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.31-.22.25-.84.82-.84 2.01s.86 2.33.98 2.49c.12.16 1.68 2.56 4.08 3.59.57.25 1.01.4 1.36.51.57.18 1.09.16 1.5.09.46-.07 1.48-.61 1.69-1.19.21-.58.21-1.08.15-1.18-.06-.11-.22-.17-.47-.29Z"/>
                          </svg>
                          واتساب
                        </a>

                        <button type="button" className="btn-gold !shadow-none w-full" onClick={() => void handleCheckoutCTA()} disabled={submitting}>
                          {submitting ? 'جاري التأكيد...' : `اطلب الآن — ${activeOffer.price} ${CURRENCY}`}
                        </button>

                        <div className="mt-3 grid grid-cols-3 gap-1.5">
                          {[
                            ['wallet', 'دفع عند الاستلام'],
                            ['truck', 'توصيل مجاني'],
                            ['refresh', 'استرجاع مضمون'],
                          ].map(([icon, label]) => (
                            <div key={label} className="flex flex-col items-center gap-1 rounded-xl border border-[#e8efe8] bg-[#f7fbf9] px-1 py-2 text-center">
                              <span className="text-[#1b8a5f]"><Icon name={icon as any} size={16} /></span>
                              <p className="text-[0.6rem] font-bold leading-tight text-[#246d58]">{label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section-padding pt-12 md:pt-16">
            <div className="container-wide">
              <div className="mb-8 text-center">
                <div className="eyebrow mx-auto">المشكلة</div>
                <h2 className="mt-4 text-3xl font-black text-[#1f1b1a] sm:text-4xl">
                  كل مرة كتشوفي راسك فالمراية، كتنقص ثقتك فراسك؟
                </h2>
              </div>

              <div className="mb-6 overflow-hidden rounded-[32px] border border-[#f3d9d0] bg-[linear-gradient(135deg,#fff7f4_0%,#f8efe8_100%)] shadow-[0_25px_60px_rgba(168,109,90,0.08)]">
                <div className="relative h-[300px] overflow-hidden rounded-[32px] bg-[#f7efe9]">
                  <Image
                    src="/images/pack-pain-custom.jfif"
                    alt="Problem image for skincare and oral care"
                    fill
                    priority
                    className="h-full w-full object-cover object-center scale-110"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.00),rgba(0,0,0,0.12))]" />
                  <div className="absolute right-4 top-4 rounded-full border border-white/60 bg-white/25 px-3 py-1.5 text-[0.6rem] font-black tracking-[0.18em] text-white backdrop-blur-sm">
                    قبل / بعد
                  </div>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-4">
                {[
                  ['البقع الداكنة', 'البقع الداكنة وتفاوت لون البشرة كيخليو الوجه يبان عيان، وكيأثرو على الإطلالة ديالك.'],
                  ['اصفرار الأسنان', 'اصفرار الأسنان وتراكم الاوساخ كيأثرو على نظافة الابتسامة وكيخليوك ما ترتاحيش ملي كتضحكي.'],
                  ['روتين طويل ومتعب', 'ماشي ديما عندك الوقت لروتين طويل، خصوصاً مع الخدمة، المواعيد والخروج.'],
                  ['الثقة فالنفس', 'بغيتي تخرجي مرتاحة، ببشرة مشرقة وابتسامة كتزيدك ثقة فراسك؟ العناية براسك تقدر تبدا بخطوات بسيطة.'],
                ].map(([title, body]) => (
                  <div key={title} className="card-elevated p-5 text-right">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fdf0eb] text-2xl">✦</div>
                    <h3 className="text-xl font-black text-[#1d1d1d]">{title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[#4f403b]">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-[#fffaf8] py-20">
            <div className="container-wide grid gap-8 lg:grid-cols-2 lg:items-center">
              <div className="rounded-[32px] border border-[#f3d9d0] bg-[linear-gradient(135deg,#fff6f2_0%,#ffffff_100%)] p-6 shadow-[0_25px_65px_rgba(154,92,73,0.08)]">
                <div className="overflow-hidden rounded-[24px] bg-[#f7efe9]">
                  <div className="relative h-[390px] w-full">
                    <Image
                      src="/images/pack-inside-custom.jfif"
                      alt="Face pack and oral care products"
                      fill
                      priority
                      className="object-cover object-center scale-110"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.00),rgba(0,0,0,0.08))]" />
                  </div>
                </div>

                <h2 className="mt-6 text-3xl font-black text-[#1f1b1a]">باك مصمم للعناية اليومية في وقت واحد</h2>

                <div className="mt-6 space-y-5">
                  {[
                    {
                      title: 'XR Cleaner للبقع السوداء',
                      desc: 'إزالة البقع الداكنة والخطوط غير المتجانسة في البشرة، مع لمسة ناعمة تمنحك مظهر أكثر توازنًا وضياء.',
                      accent: 'bg-[#f9eae6]',
                    },
                    {
                      title: 'سلك الاسنان المائي',
                      desc: 'تنظيف فعال بين الأسنان واللثة، يساعد على تقليل الترسبات والروائح ويمنحك شعوراً أنظف مع كل استخدام.',
                      accent: 'bg-[#edf4ff]',
                    },
                  ].map((item) => (
                    <div key={item.title} className={`rounded-2xl border border-[#f0e6e1] ${item.accent} p-5`}>
                      <div className="flex items-start gap-4">
                        <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl shadow-sm">✦</div>
                        <div>
                          <h3 className="text-lg font-black text-[#1d1d1d]">{item.title}</h3>
                          <p className="mt-2 text-sm leading-7 text-[#4f403b]">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] bg-[linear-gradient(135deg,#16151b_0%,#2a2d3c_100%)] p-7 text-white shadow-[0_30px_80px_rgba(10,12,23,0.25)]">
                <div className="mb-6 flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <span className="rounded-full border border-[#f7d9ca] bg-[#f7d9ca]/10 px-3 py-1 text-[10px] font-bold tracking-[0.24em] text-[#f7d9ca]">
                    RESULT
                  </span>
                  <span className="text-sm font-medium text-white/60">ما الذي ستحصلين عليه</span>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      title: 'بشرة أكثر توازنًا',
                      text: 'بشرة أكثر توازنًا وابتسامة أنظف في كل يوم.',
                      accent: 'from-[#f9d8ca] to-[#edd8ff]',
                    },
                    {
                      title: 'روتين سهل',
                      text: 'روتين سهل يليق بحياتك اليومية بدون تعقيد.',
                      accent: 'from-[#dfeaff] to-[#c7d7ff]',
                    },
                    {
                      title: 'ثقة أكبر',
                      text: 'نفس المذاق الداخلي والخارجي مع ثقة أكبر في كل خروج.',
                      accent: 'from-[#fce5cf] to-[#f6d6b8]',
                    },
                  ].map((item, index) => (
                    <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${item.accent} text-base font-black text-[#1d1d1d]`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-black text-[#fffaf8]">{item.title}</h3>
                          <p className="mt-1 text-sm leading-7 text-[#edf1ff]">{item.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="section-padding">
            <div className="container-wide">
              <div className="mb-8 text-center">
                <div className="eyebrow mx-auto">كيفاش كيتعمل</div>
                <h2 className="mt-4 text-3xl font-black text-[#1f1b1a] sm:text-4xl">روتين سريع، عملي، ومريح</h2>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {[
                  ['1', 'تنظيف الوجه', 'استخدمي XR Cleaner على المناطق المعرضة للبقع السوداء بشكل منتظم.'],
                  ['2', 'تنظيف الفم', 'اشتغلي السلك المائي بين الأسنان واللثة لمدة دقيقة أو دقيقتين يومياً.'],
                  ['3', 'نتيجة متوازنة', 'تلاحظين توازن البشرة ونعومة الابتسامة مع الاستمرار.'],
                ].map(([step, title, text]) => (
                  <div key={step} className="card-elevated p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f6e7de] text-xl font-black text-[#a75a4d]">{step}</div>
                    <h3 className="text-xl font-black text-[#1d1d1d]">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#4f403b]">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-[#f6f1ee] py-20">
            <div className="container-wide">
              <div className="mb-8 text-center">
                <div className="eyebrow mx-auto">تجارب حقيقية</div>
                <h2 className="mt-4 text-3xl font-black text-[#1f1b1a] sm:text-4xl">تجارب من نساء ورجال خدموا الباك</h2>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {[
                  ['سارة', 'الدار البيضاء', '“حسيت بفرق واضح بعد ثلاثة أسابيع: البشرة تبدلت، البقع خفّت، وابتسامتي بانت أنظف. الشيء اللي أعجبني هو سهولة الاستعمال، بلا تعقيد ولا وقت طويل.”'],
                  ['ياسين', 'مراكش', '“السلك المائي خلى الفم يبان أنضف ومريح أكثر، وXR Cleaner ساعدني على توازن لون البشرة. هذا الباك أعطاني شعوراً مختلفاً في كل يوم.”'],
                  ['رانية', 'فاس', '“الباك مناسب جدًا للروتين اليومي. ما كاينش تعقيد، والنتيجة واضحة في اللمعة وفي الشعور بالنظافة. فعلاً استعملته كل يوم واشتريت الثاني.”'],
                ].map(([name, city, text]) => (
                  <div key={name} className="rounded-[28px] border border-[#eedbce] bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-black text-[#1d1d1d]">{name}</div>
                        <div className="text-sm text-[#6b5249]">{city}</div>
                      </div>
                      <div className="flex gap-1 text-[#f7b500]">{starRow}</div>
                    </div>
                    <p className="mt-5 text-sm leading-8 text-[#4f403b]">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="pb-16">
            <div className="container-wide">
              <div className="mb-8 text-center">
                <div className="eyebrow mx-auto">الأسئلة الشائعة</div>
                <h2 className="mt-4 text-3xl font-black text-[#1f1b1a] sm:text-4xl">كلشي اللي كاتسأل عليه</h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    q: 'هل الباك مناسب للنساء والرجال؟',
                    a: 'نعم، الباك مصمم للعناية اليومية للوجه والابتسامة، ومناسب للنساء والرجال اللي حابسين يخففوا البقع السوداء ويستعيدوا نظافة الفم من الداخل.',
                  },
                  {
                    q: 'كم يستغرق ظهور النتيجة؟',
                    a: 'الفرق غالباً يبان تدريجياً مع الاستمرار، ومع الاستخدام المنتظم عادةً تظهر النتائج في الأسابيع الأولى.',
                  },
                  {
                    q: 'هل يمكن استخدام المنتج يومياً؟',
                    a: 'نعم، الباك مخصص للاستخدام اليومي ضمن روتين بسيط ومرن في البيت.',
                  },
                  {
                    q: 'كيف يتم التوصيل والدفع؟',
                    a: 'التوصيل سريع، والدفع يكون عند الاستلام، وهذا يخلّي الشراء آمن ومريح من أول خطوة إلى الأخيرة.',
                  },
                ].map((item) => (
                  <div key={item.q} className="rounded-[24px] border border-[#f0e0d9] bg-white p-5 shadow-sm">
                    <h3 className="text-lg font-black text-[#1d1d1d]">{item.q}</h3>
                    <p className="mt-2 text-sm leading-7 text-[#554842]">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="section-padding">
            <div className="container-wide">
              <div className="rounded-[36px] border border-[#f2d5ca] bg-[linear-gradient(135deg,#fff8f3_0%,#ffffff_100%)] p-6 shadow-[0_30px_80px_rgba(161,111,92,0.1)] md:p-10">
                <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                  <div>
                    <div className="eyebrow">3 أسباب للطلب اليوم</div>
                    <h2 className="mt-4 text-3xl font-black text-[#1d1d1d]">
                      باك متكامل لجمال كيبان من الداخل والخارج ✨
                    </h2>
                    <div className="mt-6 space-y-4">
                      {[
                        'خصم على الباك الكامل مقارنة بشراء كل منتج لوحدو',
                        'روتين سهل ومرن للنساء اللي عندهم مشوار وأولويات',
                        'دفع عند الاستلام + دعم مباشر قبل وبعد الطلب',
                      ].map((item) => (
                        <div key={item} className="text-base leading-8 text-[#4f403b]">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[28px] bg-[#1d1d1d] p-5 text-white">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#d7ddff]">العرض اليوم</div>
                      <div className="rounded-full bg-[#f3d3c7] px-2 py-1 text-[0.65rem] font-black text-[#38211d]">مخزون محدود</div>
                    </div>

                    <div className="space-y-3">
                      {offers.map((offer) => (
                        <button
                          key={offer.id}
                          type="button"
                          onClick={() => setSelectedOffer(offer.id)}
                          className={`w-full rounded-2xl border px-4 py-4 text-right transition ${
                            selectedOffer === offer.id
                              ? 'border-[#f0c2af] bg-[#2d2e38] shadow-[0_15px_40px_rgba(255,255,255,0.08)]'
                              : 'border-white/10 bg-white/5'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-base font-black">{offer.label}</div>
                              <div className="text-xs text-[#d8d8d8]">{offer.perk}</div>
                            </div>
                            <div className="text-left">
                              <div className="text-2xl font-black text-white">{offer.price} <span className="text-xs text-[#ddd]">درهم</span></div>
                              <div className="text-xs text-[#bbb] line-through">{offer.oldPrice}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <button className="btn-gold mt-5 w-full" onClick={handleCheckoutCTA}>
                      اطلب 199 درهم الآن
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="pb-16">
            <div className="container-wide">
              <div className="rounded-[30px] bg-[#1e1b20] px-6 py-8 text-white md:px-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-3xl font-black">وجه أنعم وابتسامة أنضف تبدأ من اليوم</h2>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button className="btn-gold" onClick={handleCheckoutCTA}>اطلب الباك الآن</button>
                    <a href={whatsappLink} target="_blank" rel="noreferrer" className="btn-outline border-white/30 bg-white/5 text-white hover:text-white">
                      تواصل واتساب
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
        <WhatsAppFloat />
      </div>
    </>
  );
}
