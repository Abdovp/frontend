import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import Icon from '../ui/Icon';
import { createPurchaseEventId, submitOrder } from '../../lib/api/orders';
import { getCheckoutErrorMessage } from '../../lib/api/order-errors';
import { trackInitiateCheckout, trackPurchase } from '../../lib/analytics/track';
import type { CartItem } from '../../lib/cart-store';
import { STORE } from '../../lib/products';
import { validateCheckoutForm } from '../../lib/checkout-validation';
import { saveOrderConfirmation } from '../../lib/order-confirmation';

const offers = [
  {
    id: 'single',
    label: 'عرض البداية',
    price: 149,
    oldPrice: 289,
    badge: 'أفضل قيمة',
    perk: 'الدفع عند الاستلام + توصيل سريع',
  },
  {
    id: 'bundle',
    label: 'عرض المجموع',
    price: 249,
    oldPrice: 459,
    badge: 'وفر 130 درهم',
    perk: 'جهاز + إكسسوارات إضافية + توصيل مجاني',
  },
] as const;

const firstOfferPrice = offers[0].price;

const benefitCards = [
  {
    icon: 'droplets' as const,
    title: 'تنظيف أعمق',
    text: 'يزيل بقايا الطعام بين الأسنان بسهولة.',
  },
  {
    icon: 'shield' as const,
    title: 'انتعاش فوري',
    text: 'تخلص من رائحة الفم الكريهة.',
  },
  {
    icon: 'clock' as const,
    title: 'روتين سريع',
    text: 'دقيقتين فقط يوميًا.',
  },
  {
    icon: 'battery' as const,
    title: 'قابل للشحن',
    text: 'مناسب للاستخدام المنزلي والسفر.',
  },
];

const stepCards = [
  {
    title: 'ملأ الخزان',
    body: 'قم بملء خزان الماء بماء فاتر، ثم ركّب الرأس المناسب حسب الراحة الخاصة بك.',
  },
  {
    title: 'اختر مستوى الضغط',
    body: 'حدد إعداد الضغط المناسب لبدأتك، مع إمكانية تعديل مستوى الشدة تدريجيًا.',
  },
  {
    title: 'وجه التدفق بين الأسنان',
    body: 'وجه المجرى بين الأسنان ومسار اللثة بخفة، وتأكد من تغطية المساحات الصعبة.',
  },
];

const specs = [
  ['سعة الخزان', '300 مل (معيار النموذج)'],
  ['السعة', 'بطارية قابلة لإعادة الشحن'],
  ['نوع الشحن', 'USB-C / شحن سريع (حسب الطراز)'],
  ['الوضعيات', '3 إلى 6 أوضاع غسيل'],
  ['مقاومة الماء', 'مقاوم للرطوبة — مناسب للاستخدام المنزلي'],
  ['الإكسسوارات', 'رؤوس متعددة / خزان / شاحن / كيس حمل'],
  ['الأبعاد', 'مقاس أنيق ومريح للحمل'],
  ['تجهيزات', 'قيمة تجريبية — يمكن تعديله حسب التوفر النهائي'],
];

const faqs = [
  {
    q: 'كيفاش كايتشتغل سلك الأسنان المائي؟',
    a: 'كيمدّ ماء مضغوط ليخرج من فوهة التوزيع، وكيغسل ما بين الأسنان واللثة بشكل أسرع من التنظيف اليدوي فقط. هو مكمل ممتاز للعناية اليومية، ماشي بديل كامل للفرشاة.',
  },
  {
    q: 'كيفاش نستعمله؟',
    a: 'ملأ الخزان، اختار مستوى الضغط المناسب، وجه الفوهة بين الأسنان، وبدّل جهة التدفق تدريجيًا حسب المناطق. من الأفضل الاستعمال مرة في اليوم بعد تنظيف الأسنان الأساسي.',
  },
  {
    q: 'واش هو rechargeable؟',
    a: 'نعم، حسب الطراز المختار، الجهاز مزود ببطارية قابلة لإعادة الشحن مع شحن USB-C أو شحن مماثل، مناسب للاستخدام اليومي والمنزلي والسفر.',
  },
  {
    q: 'شحال كايدوز التوصيل؟',
    a: 'التوصيل عادة بين 24 و 72 ساعة داخل المدن الكبرى، وقد يختلف حسب المنطقة. يضاف التوصيل حسب جهة التوريد والمدينة.',
  },
  {
    q: 'واش كايمكن الدفع عند الاستلام؟',
    a: 'نعم، الدفع عند الاستلام هو الخيار المتاح في معظم الطلبات في المغرب. ما كتسددش إلا بعد ما تلاقي السلعة بيدك.',
  },
];

const comparisonRows = [
  {
    label: 'التنظيف بين الأسنان',
    brushing: 'تنظيف سطحي فقط.',
    irrigator: 'يزيل بقايا الطعام بين الأسنان.',
  },
  {
    label: 'السرعة',
    brushing: 'يحتاج حركة دقيقة يدويًا.',
    irrigator: 'سريع ويختصر الوقت.',
  },
  {
    label: 'الاستخدام اليومي',
    brushing: 'مفيد لكن يتطلب وقتًا.',
    irrigator: 'سهل ورائع في الروتين اليومي.',
  },
];

const reviews = [
  {
    name: 'سارة م.',
    text: 'الفرق واضح مباشرة. بين الأسنان أصبح أنظف، والروتين صار أسرع بكثير.',
    image: '/images/reviews/review-1.avif',
  },
  {
    name: 'ياسين ب.',
    text: 'أحببت الشكل ومريح في الاستخدام، خصوصًا لسهولة تنظيف المناطق الصعبة.',
    image: '/images/reviews/review-2.avif',
  },
  {
    name: 'ليلى ر.',
    text: 'رائحة الفم أصبحت أفضل والنتيجة محسوسة بعد اسبوع فقط من الاستخدام.',
    image: '/images/reviews/review-3.avif',
  },
  {
    name: 'حسن ت.',
    text: 'من أحسن إكسسوارات العناية اليومية، عملي، سريع، ويفيد فعلاً في الروتين.',
    image: '/images/reviews/review-4.avif',
  },
] as const;

const whatsappNumber = STORE.whatsapp.replace(/\D/g, '');
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('السلام عليكم، بدي اطلب جهاز تنظيف الأسنان المائي / Oral Irrigator')}`;

export default function OralIrrigatorPage() {
  const router = useRouter();
  const [selectedOffer, setSelectedOffer] = useState<(typeof offers)[number]['id']>('single');
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [formErrors, setFormErrors] = useState<{ name?: string; phone?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [openFaq, setOpenFaq] = useState<string | null>('0');

  useEffect(() => {
    const handleScroll = () => {
      const pricingSection = document.getElementById('product-pricing');
      if (!pricingSection) return;
      const rect = pricingSection.getBoundingClientRect();
      setShowStickyCta(rect.top < window.innerHeight * 0.65);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    void router.prefetch('/thank-you');
  }, [router]);

  const activeOffer = useMemo(
    () => offers.find((offer) => offer.id === selectedOffer) ?? offers[0],
    [selectedOffer]
  );

  const scrollToOrderForm = () => {
    setSelectedOffer('single');
    const pricingSection = document.getElementById('product-pricing');
    pricingSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => {
      const nameInput = document.getElementById('oral-checkout-name') as HTMLInputElement | null;
      nameInput?.focus();
    }, 350);
  };

  const OrderNowButton = () => (
    <div className="my-8 flex justify-center px-4">
      <button
        type="button"
        onClick={scrollToOrderForm}
        className="inline-flex items-center justify-center gap-3 rounded-full bg-[#0f5b8a] px-6 py-3.5 text-base font-black text-white shadow-[0_18px_30px_rgba(15,91,138,0.22)] transition hover:bg-[#0d4f7b]"
      >
        <span>اطلب الآن</span>
        <span className="rounded-full bg-white/10 px-2 py-1 text-sm">{offers[0].price} درهم</span>
      </button>
    </div>
  );

  const handleCheckoutCTA = async () => {
    const errors = validateCheckoutForm({
      name: customerName,
      phone: customerPhone,
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const firstInputId = errors.name ? 'oral-checkout-name' : 'oral-checkout-phone';
      document.getElementById(firstInputId)?.focus();
      return;
    }

    setFormErrors({});
    setSubmitting(true);
    setSubmitError('');

    const offerValue: 1 | 2 = activeOffer.id === 'bundle' ? 2 : 1;
    const orderItems: CartItem[] = [
      {
        id: 'oral-irrigator',
        lineKey: `oral-irrigator-${activeOffer.id}`,
        name: 'Oral Irrigator / Water Flosser',
        price: activeOffer.price,
        offer: offerValue,
        quantity: 1,
      },
    ];

    trackInitiateCheckout(
      orderItems.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      activeOffer.price
    );

    const eventId = createPurchaseEventId();

    try {
      const result = await submitOrder({
        eventId,
        name: customerName.trim(),
        phone: customerPhone.trim(),
        items: orderItems,
        total: activeOffer.price,
      });

      saveOrderConfirmation({
        name: customerName.trim(),
        phone: customerPhone.trim(),
        items: orderItems,
        total: activeOffer.price,
        eventId,
        orderId: result.id,
        publicOrderId: result.public_order_id,
      });

      trackPurchase({
        eventId,
        value: activeOffer.price,
        items: orderItems.map((item) => ({
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

  return (
    <>
      <Head>
        <title>Oral Irrigator / Water Flosser | بويا شوب</title>
        <meta
          name="description"
          content="جهاز تنظيف الأسنان المائي من بويا شوب: تنظيف بين الأسنان، عناية اللثة، ومكمل يومي لروتين الأسنان. الدفع عند الاستلام في المغرب."
        />
        <meta property="og:title" content="Oral Irrigator / Water Flosser | بويا شوب" />
        <meta
          property="og:description"
          content="تنظيف أعمق بين الأسنان ووراء اللثة مع جهاز مائي عملي وسهل الاستخدام."
        />
      </Head>

      <div className="min-h-screen bg-[#f7fbff] text-[#112033]" dir="rtl">
        <Header />

        <main className="overflow-hidden pb-20">
          <div
            className={`fixed inset-x-0 bottom-3 z-50 px-3 transition-all duration-300 md:hidden ${showStickyCta ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-5 opacity-0'}`}
          >
            <div className="mx-auto max-w-md rounded-full bg-white/90 p-1.5 shadow-[0_18px_40px_rgba(17,32,51,0.18)] ring-1 ring-[#dbeaf7] backdrop-blur-md">
              <button
                type="button"
                onClick={handleCheckoutCTA}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-[#0f5b8a] px-4 py-3 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.3)]"
                disabled={submitting}
              >
                <span className="text-sm font-black">اطلب الآن</span>
                <span className="text-base font-black">{firstOfferPrice} درهم</span>
              </button>
            </div>
          </div>

          <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(110,198,214,0.22),_transparent_23%),linear-gradient(135deg,#f9fcff_0%,#eef8ff_40%,#fdfdfd_100%)] py-10 md:py-16">
            <div className="container-wide relative z-10">
              <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
                <div className="order-1 lg:order-2 lg:sticky lg:top-24">
                  <div className="relative mx-auto w-full max-w-[520px] overflow-hidden rounded-[30px] border border-[#dfeef9] bg-white p-0 shadow-[0_26px_60px_rgba(17,32,51,0.09)]">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[30px] bg-[#eef7ff]">
                      <img
                        src="/images/hero/hero-product.avif"
                        alt="Oral Irrigator"
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                  </div>
                </div>

                <div className="order-2 text-right">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#cfeaf8] bg-white px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#0e688f]">
                    <Icon name="spark" size={12} />
                    Oral Irrigator
                  </div>

                  <h1 className="mb-4 font-heading text-3xl font-extrabold leading-[1.3] text-[#102233] md:text-4xl lg:text-[3.2rem]">
                    <span className="text-[#0f6b9c]">نظافة أعمق للأسنان</span> و<span className="text-[#102233]">انتعاش يدوم كل يوم</span>
                  </h1>

                  <p className="mb-5 max-w-xl text-base leading-relaxed text-[#3d5165] md:text-lg">
                    جهاز تنظيف الأسنان المائي لإزالة بقايا الطعام بين الأسنان و التخلص من رائحة الفم بسهولة، لنظافة أعمق وانتعاش يومي.
                  </p>

                  <div className="mb-6 grid gap-3 sm:grid-cols-2">
                    {benefitCards.slice(0, 2).map((item) => (
                      <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-[#dfeef8] bg-white/90 p-3.5 shadow-sm">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf8ff] text-[#0d6a9d]">
                          <Icon name={item.icon} size={18} />
                        </span>
                        <div>
                          <p className="font-extrabold text-[#102233]">{item.title}</p>
                          <p className="mt-1 text-xs leading-relaxed text-[#4d647a]">{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div id="product-pricing" className="scroll-mt-28 rounded-[24px] border border-[#dfeef8] bg-white p-4 shadow-[0_16px_40px_rgba(17,32,51,0.07)]">
                    <div className="mb-3 text-right">
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#5a7083]">اختر العرض</p>
                    </div>

                    <div className="flex flex-col gap-3">
                      {offers.map((offer) => {
                        const isSelected = selectedOffer === offer.id;
                        return (
                          <button
                            key={offer.id}
                            type="button"
                            onClick={() => setSelectedOffer(offer.id)}
                            className={`w-full rounded-2xl border p-3 text-right transition ${isSelected ? 'border-[#0f6b9c] bg-[#edf8ff] shadow-sm' : 'border-[#dfeef8] bg-[#f9fbff] hover:border-[#cfeaf8]'}`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="text-sm font-extrabold text-[#112033]">{offer.label}</p>
                                <p className="text-[11px] text-[#476078]">{offer.perk}</p>
                              </div>
                              <div className="text-left">
                                <p className="text-lg font-black text-[#112033]">{offer.price} درهم</p>
                                <p className="text-[11px] text-[#73859a] line-through">{offer.oldPrice} درهم</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-4 grid gap-3 text-right">
                      <div>
                        <label htmlFor="oral-checkout-name" className="mb-1.5 block text-sm font-bold text-[#112033]">الاسم الكامل</label>
                        <input
                          id="oral-checkout-name"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full rounded-2xl border border-[#dfeef8] bg-[#f9fbff] px-4 py-3 text-base text-[#112033] outline-none ring-0 transition focus:border-[#0f6b9c]"
                          placeholder="اكتب اسمك"
                        />
                        {formErrors.name && <p className="mt-1 text-xs font-bold text-red-600">{formErrors.name}</p>}
                      </div>

                      <div>
                        <label htmlFor="oral-checkout-phone" className="mb-1.5 block text-sm font-bold text-[#112033]">رقم الهاتف</label>
                        <input
                          id="oral-checkout-phone"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full rounded-2xl border border-[#dfeef8] bg-[#f9fbff] px-4 py-3 text-base text-[#112033] outline-none ring-0 transition focus:border-[#0f6b9c]"
                          placeholder="06XXXXXXXX"
                        />
                        {formErrors.phone && <p className="mt-1 text-xs font-bold text-red-600">{formErrors.phone}</p>}
                      </div>
                    </div>

                    {submitError && <p className="mt-4 text-sm font-bold text-red-600">{submitError}</p>}

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={handleCheckoutCTA}
                        disabled={submitting}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#0f5b8a] px-6 py-4 text-base font-black text-white shadow-[0_18px_30px_rgba(15,91,138,0.22)] transition hover:bg-[#0d4f7b]"
                      >
                        <Icon name="cart" size={18} />
                        {submitting ? 'جاري الطلب...' : 'اطلب الآن'}
                      </button>
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#dfeef8] bg-white px-6 py-4 text-base font-black text-[#123752]"
                      >
                        <Icon name="whatsapp" size={18} />
                        تواصل واتساب
                      </a>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[#4d647a]">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef9f5] px-3 py-1.5 font-black text-[#1a765b]">
                      <Icon name="check-circle" size={16} />
                      الدفع عند الاستلام
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef5ff] px-3 py-1.5 font-black text-[#235f90]">
                      <Icon name="truck" size={16} />
                      free delivery
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff5e8] px-3 py-1.5 font-black text-[#a65f0f]">
                      <Icon name="shield" size={16} />
                      ضمان 30 يوم
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#f5f9fc] py-16 md:py-20">
            <div className="container-wide">
              <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="overflow-hidden rounded-[28px] border border-[#dfeef8] bg-white shadow-[0_18px_40px_rgba(17,32,51,0.06)]">
                  <div className="relative aspect-[4/4.6] overflow-hidden bg-[#edf9ff]">
                    <img
                      src="/screenshot/solution-alt.gif"
                      alt="Oral Irrigator solution"
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                </div>

                <div className="text-right">
                  <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#dfeef8] bg-white px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#0f6b9c]">
                    <Icon name="droplets" size={12} />
                    الحل
                  </p>

                  <h2 className="font-heading text-2xl font-extrabold text-[#102233] md:text-4xl">
                    جهاز مائي يعالج الأماكن التي تتجاهلها الفرشاة
                  </h2>

                  <p className="mt-4 text-base leading-relaxed text-[#46617c]">
                    اندفاع الماء يساعد على إزالة بقايا الطعام بين الأسنان وحول اللثة بسهولة، لنظافة أفضل وروتين يومي أكثر راحة.
                  </p>

                  <ul className="mt-6 space-y-3">
                    {[
                      'ينظف المناطق الصعبة الوصول إليها من الفرشاة التقليدية.',
                      'يخفف تراكم الطعام من بين الأسنان وعند خط اللثة.',
                      'يساعد على إضفاء إحساس بالنظافة بعد كل وجبة أو في الليلة.',
                    ].map((entry) => (
                      <li key={entry} className="flex items-start gap-3 text-[#102233] font-bold">
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eaf6ff] text-[#0f6b9c]">
                          <Icon name="check" size={14} />
                        </span>
                        <span>{entry}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <OrderNowButton />

          <section className="bg-white py-16 md:py-20">
            <div className="container-wide max-w-5xl">
              <div className="mb-10 text-center">
                <p className="mb-3 inline-flex items-center justify-center gap-2 rounded-full border border-[#dfeef8] bg-[#f5fbff] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#0f6b9c]">
                  <Icon name="settings" size={12} />
                  طريقة الاستعمال
                </p>
                <h2 className="font-heading text-2xl font-extrabold text-[#112033] md:text-4xl">
                  3 خطوات فقط لتحصل على تجربة تنظيف أسهل
                </h2>
              </div>

              <div className="mb-7 overflow-hidden rounded-[28px] border border-[#dfeef8] bg-[#f7fbff] shadow-[0_18px_40px_rgba(17,32,51,0.04)]">
                <div className="relative aspect-[16/20] overflow-hidden bg-[#edf9ff] md:aspect-[16/4.5]">
                  <img
                    src="/screenshot/how-to-use.gif"
                    alt="Oral Irrigator usage"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {stepCards.map((step, idx) => (
                  <div key={step.title} className="rounded-[26px] border border-[#dfeef8] bg-[#f7fbff] p-5 text-right shadow-sm">
                    <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0f5b8a] text-xl font-black text-white">{idx + 1}</span>
                    <h3 className="mb-2 text-xl font-extrabold text-[#112033]">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-[#4c647a]">{step.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <OrderNowButton />

          <section className="bg-[#eff8ff] py-16 md:py-20">
            <div className="container-wide">
              <div className="mb-8 text-center">
                <p className="mb-3 inline-flex items-center justify-center gap-2 rounded-full border border-[#dfeef8] bg-white px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#0f6b9c]">
                  <Icon name="shield" size={12} />
                  الفوائد الرئيسية
                </p>
                <h2 className="font-heading text-2xl font-extrabold text-[#112033] md:text-4xl">
                  لماذا يضيف هذا الجهاز قيمة في روتينك اليومي
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {benefitCards.map((item) => (
                  <div key={item.title} className="rounded-[24px] border border-[#dfeef8] bg-white p-5 text-right shadow-[0_12px_30px_rgba(17,32,51,0.05)]">
                    <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eaf8ff] text-[#0c6d9f]">
                      <Icon name={item.icon} size={18} />
                    </span>
                    <h3 className="mb-2 text-lg font-extrabold text-[#112033]">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-[#4a6076]">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <OrderNowButton />

          <section className="bg-white py-16 md:py-20">
            <div className="container-wide max-w-5xl">
              <div className="mb-8 text-center">
                <p className="mb-3 inline-flex items-center justify-center gap-2 rounded-full border border-[#dfeef8] bg-[#f5fbff] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#0f6b9c]">
                  <Icon name="settings" size={12} />
                  مقارنة
                </p>
                <h2 className="font-heading text-2xl font-extrabold text-[#112033] md:text-4xl">
                  فرشاة تقليدية مقابل غسيل بالماء
                </h2>
              </div>

              <div className="overflow-hidden rounded-[28px] border border-[#dfeef8] shadow-[0_16px_40px_rgba(17,32,51,0.06)]">
                <table className="w-full text-right">
                  <thead className="bg-[#f4fbff]">
                    <tr>
                      <th className="px-4 py-4 text-sm font-black text-[#112033]">الميزة</th>
                      <th className="px-4 py-4 text-sm font-black text-[#112033]">الفرشاة التقليدية</th>
                      <th className="px-4 py-4 text-sm font-black text-[#0f6b9c]">غسيل الأسنان بالماء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row) => (
                      <tr key={row.label} className="border-t border-[#edf3f8] bg-white">
                        <td className="px-4 py-4 text-sm font-bold text-[#112033]">{row.label}</td>
                        <td className="px-4 py-4 text-sm text-[#4d647a]">{row.brushing}</td>
                        <td className="px-4 py-4 text-sm text-[#0c648d]">{row.irrigator}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <OrderNowButton />

          <section className="bg-[#f6fbff] py-16 md:py-20" dir="rtl">
            <div className="container-wide max-w-5xl">
              <div className="mb-8 text-center">
                <p className="mb-3 inline-flex items-center justify-center gap-2 rounded-full border border-[#dfeef8] bg-white px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#0f6b9c]">
                  <Icon name="star" size={12} />
                  آراء العملاء
                </p>
                <h2 className="font-heading text-2xl font-extrabold text-[#112033] md:text-4xl">
                  تجارب عملاء حقيقية
                </h2>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-2 md:overflow-visible md:pb-0 xl:grid-cols-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {reviews.map((review) => (
                  <div key={review.name} className="min-w-[260px] snap-start rounded-[24px] border border-[#dfeef8] bg-white p-5 text-right shadow-[0_18px_40px_rgba(17,32,51,0.04)] md:min-w-0">
                    <img
                      src={review.image}
                      alt={review.name}
                      className="mb-4 h-60 w-full rounded-[18px] border border-[#dfeef8] object-cover bg-[#eef7fb]"
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="mb-3 flex items-center gap-1 text-[#f3b100]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Icon key={`${review.name}-${i}`} name="star" size={16} />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-[#4e6479]">“{review.text}”</p>
                    <p className="mt-4 text-sm font-extrabold text-[#112033]">{review.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-[#102233] py-16 text-white md:py-20">
            <div className="container-wide">
              <div className="mb-8 text-center">
                <p className="mb-3 inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#9ad5f3]">
                  <Icon name="shield" size={12} />
                  ثقة وراحة
                </p>
                <h2 className="font-heading text-2xl font-extrabold text-white md:text-4xl">
                  الدفع عند الاستلام و سياسة واضحة
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                {[
                  { icon: 'wallet', title: 'الدفع عند الاستلام', text: 'لا تدفع قبل أن تستلم الطلب وتأكد من الجودة.' },
                  { icon: 'truck', title: 'free delivery', text: 'توصيل إلى المدن الكبرى والمدن الأخرى حسب المنطقة.' },
                  { icon: 'refresh', title: 'ضمان 30 يوم', text: 'إمكانية إرجاع أو استبدال المنتج في حالة وجود خلل.' },
                  { icon: 'whatsapp', title: 'دعم مباشر', text: 'تواصل مباشر مع الفريق قبل الطلب أو بعده.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-[24px] border border-white/10 bg-white/5 p-5 text-right">
                    <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#173d5d] text-[#b7ebff]">
                      <Icon name={item.icon as any} size={18} />
                    </span>
                    <h3 className="mb-2 text-lg font-extrabold text-white">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-white/70">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white py-16 md:py-20">
            <div className="container-wide max-w-4xl">
              <div className="mb-8 text-center">
                <p className="mb-3 inline-flex items-center justify-center gap-2 rounded-full border border-[#dfeef8] bg-[#f5fbff] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#0f6b9c]">
                  <Icon name="chat" size={12} />
                  أسئلة شائعة
                </p>
                <h2 className="font-heading text-2xl font-extrabold text-[#112033] md:text-4xl">
                  كل ما يهمك قبل الطلب
                </h2>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, index) => {
                  const key = String(index);
                  const isOpen = openFaq === key;
                  return (
                    <div key={faq.q} className="overflow-hidden rounded-[22px] border border-[#dfeef8] bg-[#f7fbff]">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : key)}
                        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-right"
                        aria-expanded={isOpen}
                      >
                        <span className="font-extrabold text-[#112033]">{faq.q}</span>
                        <span className={`flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#0f6b9c] transition ${isOpen ? 'rotate-180' : ''}`}>
                          <Icon name="chevron-down" size={16} />
                        </span>
                      </button>
                      <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                          <p className="px-4 pb-4 text-sm leading-relaxed text-[#4c647a]">{faq.a}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="bg-[#f4fbff] py-16 md:py-20">
            <div className="container-wide">
              <div className="rounded-[30px] border border-[#dfeef8] bg-[linear-gradient(135deg,#0f5b8a_0%,#0d3b67_100%)] p-7 text-white shadow-[0_28px_55px_rgba(10,52,77,0.17)] md:p-10">
                <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="text-right">
                    <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#bfe8ff]">
                      <Icon name="spark" size={12} />
                      طلب سريع
                    </p>
                    <h2 className="font-heading text-2xl font-extrabold text-white md:text-4xl">
                      ابني روتينك اليومي على تنظيف أكثر فعالية
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-white/75">
                      جهاز تنظيف الأسنان المائي من بويا شوب مناسب لمن يرغب في روتين أسهل، تنظيف أعمق، وموقف استلام مريح مع الدفع عند الاستلام.
                    </p>
                  </div>

                  <div className="rounded-[26px] border border-white/10 bg-white/5 p-4 text-right">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="text-xs text-white/75">السعر الحالي</span>
                      <span className="text-2xl font-black">{firstOfferPrice} درهم</span>
                    </div>
                    <div className="mb-4 flex items-center justify-between gap-3 text-xs text-white/75">
                      <span>free delivery</span>
                      <span>الدفع عند الاستلام</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCheckoutCTA}
                      disabled={submitting}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3.5 text-base font-black text-[#0d3b67]"
                    >
                      <Icon name="cart" size={18} />
                      {submitting ? 'جاري الطلب...' : 'اطلب الآن'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </main>

        <Footer />
      </div>
    </>
  );
}
