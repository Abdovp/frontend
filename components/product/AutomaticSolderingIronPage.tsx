import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Header from '../Header';
import solderingPackHeroImage from '../../screenshot/automatic-soldering-hero.webp';
import solderingPackImage from '../../screenshot/automatic-soldering-pack.webp';
import solderingGunGif from '../../screenshot/automatic-soldering-gif.webp';
import wireCutterPhoto from '../../screenshot/wire-cutter.webp';
import Footer from '../Footer';
import Icon from '../ui/Icon';
import { createPurchaseEventId, submitOrder } from '../../lib/api/orders';
import { getCheckoutErrorMessage } from '../../lib/api/order-errors';
import { trackInitiateCheckout, trackPurchase, trackViewContent } from '../../lib/analytics/track';
import { saveOrderConfirmation } from '../../lib/order-confirmation';
import { STORE } from '../../lib/products';

type FormState = {
  name: string;
  phone: string;
};

const PRODUCT_ID = 'automatic-soldering-iron-pack';
const PRICE_VARIANTS = {
  A: { single: 199, bundle: 329 },
  B: { single: 189, bundle: 300 },
} as const;
type PriceVariant = keyof typeof PRICE_VARIANTS;
const PRICE_MAD = PRICE_VARIANTS.A.single;
const ALT_PRICE_MAD = PRICE_VARIANTS.A.bundle;
const PRICE_OPTIONS = [PRICE_MAD, ALT_PRICE_MAD] as const;
const QUANTITY_OPTIONS = [1, 2, 3] as const;
const PRODUCT_NAME = 'Automatic Soldering Iron + Precision Wire Cutter Pack';
const PRODUCT_NAME_AR = 'باك مكواة اللحام الآلي + قاطع الأسلاك الدقيق';
const ORDER_BUTTON_TEXT = 'اطلب الآن';

const getInitialPriceVariant = (): PriceVariant => {
  if (typeof window === 'undefined') return 'A';

  const storedVariant = window.sessionStorage.getItem('soldering-pack-price-variant');
  if (storedVariant === 'A' || storedVariant === 'B') {
    return storedVariant;
  }

  const variant = Math.random() < 0.5 ? 'A' : 'B';
  window.sessionStorage.setItem('soldering-pack-price-variant', variant);
  return variant;
};

const galleryCards = [
  { title: 'مكواة اللحام', accent: 'from-sky-500/20 via-sky-400/5 to-transparent' },
  { title: 'نظام التغذية', accent: 'from-amber-500/20 via-amber-400/5 to-transparent' },
  { title: 'القاطع الدقيق', accent: 'from-slate-800/20 via-slate-700/5 to-transparent' },
];

const formatPhone = (value: string) => value.replace(/[^0-9+]/g, '').slice(0, 15);

const validateMoroccanPhone = (value: string) => {
  const normalized = value.replace(/\s+/g, '');
  if (!normalized) return false;
  if (/^\+212[0-9]{9}$/.test(normalized)) return true;
  if (/^0[567][0-9]{8}$/.test(normalized)) return true;
  return false;
};

export default function AutomaticSolderingIronPage() {
  const router = useRouter();
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
  });
  const [priceVariant, setPriceVariant] = useState<PriceVariant>('A');
  const [selectedPrice, setSelectedPrice] = useState<number>(PRICE_VARIANTS.A.single);
  const [quantity, setQuantity] = useState<number>(1);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const currentPriceVariant = PRICE_VARIANTS[priceVariant];
  const priceOptions = [currentPriceVariant.single, currentPriceVariant.bundle] as const;

  useEffect(() => {
    const variant = getInitialPriceVariant();
    setPriceVariant(variant);
    setSelectedPrice(PRICE_VARIANTS[variant].single);
  }, []);

  useEffect(() => {
    void router.prefetch('/thank-you');
  }, [router]);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById('page-hero');
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      setShowStickyCta(rect.bottom < window.innerHeight * 0.8);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    trackViewContent({
      productId: PRODUCT_ID,
      name: PRODUCT_NAME_AR,
      price: currentPriceVariant.single,
    });
  }, [currentPriceVariant.single]);

  const total = selectedPrice * quantity;

  const faqs = [
    {
      q: 'شنو كيتضمن هاد الباك؟',
      a: 'الطلب يتضمن مكواة لحام مزودة بنظام تغذية سلك اللحام، وقاطع أسلاك دقيق. هذا هو ما تم التحقق منه في المنتج المعروض.',
    },
    {
      q: 'واش مكواة اللحام فيها نظام تغذية سلك اللحام؟',
      a: 'نعم، المنتج الأساسي في هذا الباك هو مكواة اللحام مع نظام مدمج لتغذية سلك اللحام، بغاية تسهيل العمل أثناء اللحام.',
    },
    {
      q: 'واش القاطع مناسب للأسلاك الصغيرة؟',
      a: 'نعم، القاطع مصمّم لقطع الأسلاك الدقيقة وأطراف المكونات الإلكترونية بطريقة عملية للمهام الصغيرة.',
    },
    {
      q: 'واش الباك مناسب للمبتدئين؟',
      a: 'نعم، الباك مناسب للمهتمين بالإلكترونيات والطلاب والهواة، خاصة عند الحاجة لأدوات عملية في المشاريع البسيطة.',
    },
    {
      q: 'واش نقدر نستعمالو فمشاريع الإلكترونيات؟',
      a: 'نعم، كيتناسب للمشاريع اليدوية والإصلاحات السريعة في مجال الإلكترونيات، خاصة في التعامل مع الأسلاك والموصلات.',
    },
    {
      q: 'شحال ثمن الباك؟',
      a: `ثمن الباك هو ${currentPriceVariant.single} درهم.`,
    },
    {
      q: 'واش التوصيل مجاني؟',
      a: 'نعم، التوصيل مجاني لجميع مدن المغرب.',
    },
    {
      q: 'كيفاش نقدر نخلص؟',
      a: 'الدفعة تتم عند الاستلام، ودفعك يتم مباشرة عند وصول الطلب للعنوان المذكور.',
    },
  ];

  const handleFieldChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (): Partial<Record<keyof FormState, string>> => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.name.trim()) nextErrors.name = 'الاسم الكامل مطلوب';
    if (!validateMoroccanPhone(form.phone)) nextErrors.phone = 'رقم الهاتف غير صحيح';

    return nextErrors;
  };

  const scrollToOrderForm = () => {
    const section = document.getElementById('order-form');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      const input = document.getElementById('boyashop-order-name') as HTMLInputElement | null;
      input?.focus();
    }, 250);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstKey = Object.keys(nextErrors)[0] as keyof FormState;
      const firstInputId = firstKey === 'name' ? 'boyashop-order-name' : 'boyashop-order-phone';
      document.getElementById(firstInputId)?.focus();
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    const items: any[] = [
      {
        id: PRODUCT_ID,
        lineKey: `${PRODUCT_ID}-q1`,
        name: PRODUCT_NAME_AR,
        price: selectedPrice,
        offer: 1,
        quantity,
      },
    ];

    const orderTotal = total;
    trackInitiateCheckout(
      items.map((item) => ({ productId: item.id, name: item.name, price: item.price, quantity: item.quantity })),
      orderTotal
    );

    const eventId = createPurchaseEventId();

    try {
      const result = await submitOrder({
        eventId,
        name: form.name.trim(),
        phone: form.phone.trim(),
        items,
        total: orderTotal,
      });

      saveOrderConfirmation({
        name: form.name.trim(),
        phone: form.phone.trim(),
        items,
        total: orderTotal,
        eventId,
        orderId: result.id,
        publicOrderId: result.public_order_id,
      });

      trackPurchase({
        eventId,
        value: orderTotal,
        items: items.map((item) => ({ productId: item.id, name: item.name, price: item.price, quantity: item.quantity })),
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
        <title>باك مكواة اللحام الآلي + قاطع الأسلاك الدقيق | بويا شوب</title>
        <meta
          name="description"
          content="باك عملي للإلكترونيات يجمع مكواة لحام بنظام تغذية سلك اللحام وقاطع أسلاك دقيق، مناسب للإصلاح والمشاريع اليدوية والدروس العملية. الدفع عند الاستلام وتوصيل مجاني لجميع مدن المغرب."
        />
        <meta property="og:title" content="باك مكواة اللحام الآلي + قاطع الأسلاك الدقيق | بويا شوب" />
        <meta
          property="og:description"
          content={`جوج أدوات ضروريين لأي واحد كيخدم فالإلكترونيات! مكواة لحام بنظام تغذية سلك اللحام وقاطع أسلاك دقيق، بثمن ${currentPriceVariant.single} درهم، توصيل مجاني، الدفع عند الاستلام.`}
        />
      </Head>

      <div className="min-h-screen bg-[#f5f7fb] text-slate-900" dir="rtl">
        <Header />

        <main>
          <section id="page-hero" className="bg-white text-slate-900">
            <div className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-10">
              <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-6">
                  <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50 p-0 shadow-[0_20px_40px_rgba(15,23,42,0.08)] backdrop-blur-sm">
                    <div className="relative h-[420px] overflow-hidden bg-slate-100 sm:h-[460px] lg:h-[500px]">
                      <Image
                        src={solderingPackHeroImage}
                        alt="باك مكواة اللحام الآلي + قاطع الأسلاك الدقيق"
                        fill
                        priority
                        className="object-cover object-center"
                      />
                    </div>
                  </div>

                  <div>
                    <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-slate-900 sm:text-5xl">
                      باك اللحام الاوتوماتيكي + قاطع الأسلاك
                    </h1>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
                      <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-700">
                        <span className="text-base tracking-wide text-amber-500">★★★★★</span>
                        <span>4.9/5</span>
                      </div>
                      <div className="text-sm font-medium text-slate-600">من أكثر من 1,200 عميل</div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {['توصيل سريع', 'دفع عند الاستلام', 'موثوق ومضمون'].map((label) => (
                        <div key={label} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm">
                          {label}
                        </div>
                      ))}
                    </div>

                    <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
                      باك عملي لكل من يشتغل في الإلكترونيات، الإصلاحات الصغيرة، والمشاريع اليدوية بوضوح وسرعة.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      'دقة في القطع واللحام',
                      'سهل الاستخدام للمبتدئين',
                      'قاطع أسلاك دقيق مع تحكم أفضل في التفاصيل',
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-700 backdrop-blur-sm">
                        <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-400 text-slate-900">
                          <Icon name="check-circle" size={16} />
                        </div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="mb-1 text-right text-sm font-black text-slate-800">اختر العرض</div>
                    {priceOptions.map((price, index) => (
                      <button
                        key={price}
                        type="button"
                        onClick={() => setSelectedPrice(price)}
                        className={`flex w-full items-center justify-between gap-3 rounded-[22px] border p-4 text-right transition ${
                          selectedPrice === price
                            ? 'border-black bg-slate-50 shadow-[0_0_0_1px_rgba(0,0,0,0.24)]'
                            : 'border-slate-400 bg-white hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${selectedPrice === price ? 'border-black bg-black' : 'border-slate-500 bg-transparent'}`}>
                            {selectedPrice === price && <span className="h-2.5 w-2.5 rounded-full bg-white" />}
                          </span>
                          <div>
                            <div className="text-lg font-black text-slate-900">{index === 0 ? 'باك واحد' : '2 باكات'}</div>
                            <div className="text-[11px] text-slate-500">{index === 0 ? 'الاختيار المفضل' : 'تخفيض أفضل'}</div>
                          </div>
                        </div>

                        <div className="text-left">
                          {index === 1 ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[1.4rem] font-black leading-none text-slate-900">{price} درهم</span>
                              <span className="text-xs font-medium text-slate-400 line-through">{priceVariant === 'A' ? '400' : '350'} درهم</span>
                            </div>
                          ) : (
                            <div className="text-[1.4rem] font-black leading-none text-slate-900">{price} درهم</div>
                          )}
                          {index === 0 ? <div className="mt-1 text-[10px] text-emerald-600">توصيل مجاني</div> : <div className="mt-1 text-[10px] text-amber-700">{priceVariant === 'A' ? 'وفر 49 درهم' : 'وفر 45 درهم'}</div>}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="rounded-[22px] border border-black/20 bg-white p-4 shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
                    <h2 className="mb-3 text-right text-2xl font-black text-slate-900">ادخل معلوماتك للطلب</h2>
                    <form id="order-form" onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="boyashop-order-name" className="mb-2 block text-base font-bold text-slate-800">الاسم الكامل</label>
                        <input
                          id="boyashop-order-name"
                          value={form.name}
                          onChange={(e) => handleFieldChange('name', e.target.value)}
                          className="w-full rounded-2xl border border-slate-400 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-black"
                          placeholder="أدخل اسمك الكامل"
                        />
                        {errors.name && <p className="mt-2 text-xs font-medium text-red-600">{errors.name}</p>}
                      </div>

                      <div>
                        <label htmlFor="boyashop-order-phone" className="mb-2 block text-base font-bold text-slate-800">رقم الهاتف</label>
                        <input
                          id="boyashop-order-phone"
                          value={form.phone}
                          onChange={(e) => handleFieldChange('phone', formatPhone(e.target.value))}
                          className="w-full rounded-2xl border border-slate-400 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-black"
                          placeholder="06XXXXXXXX"
                        />
                        {errors.phone && <p className="mt-2 text-xs font-medium text-red-600">{errors.phone}</p>}
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#f6bb3f] px-6 py-4 text-lg font-black text-slate-900 shadow-[0_18px_30px_rgba(246,187,63,0.28)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <Icon name="cart" size={18} />
                        {submitting ? 'جاري تأكيد الطلب...' : `${ORDER_BUTTON_TEXT} بـ ${total} درهم`}
                      </button>

                      <a
                        href={`https://wa.me/${STORE.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`السلام عليكم، بدي اطلب باك مكواة اللحام الآلي + قاطع الأسلاك الدقيق، الكمية ${quantity}، المجموع ${total} درهم.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-6 py-3 text-base font-black text-emerald-700 transition hover:bg-emerald-100"
                      >
                        <Icon name="whatsapp" size={18} />
                        تواصل واتساب
                      </a>

                      {submitError && <p className="mt-3 text-sm font-medium text-red-600">{submitError}</p>}
                    </form>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      {[
                        { label: 'توصيل مجاني', icon: 'truck' },
                        { label: 'الدفع عند الاستلام', icon: 'check-circle' },
                        { label: 'استرجاع مضمون', icon: 'shield' },
                      ].map((item) => (
                        <div key={item.label} className="rounded-2xl border border-emerald-200 bg-emerald-50 px-2 py-3">
                          <div className="mb-1 flex justify-center text-emerald-600">
                            <Icon name={item.icon as any} size={16} />
                          </div>
                          <div className="text-[10px] font-bold text-emerald-700">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex justify-center">
              <button
                type="button"
                onClick={scrollToOrderForm}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f6bb3f] px-6 py-3 text-sm font-black text-slate-900 shadow-[0_12px_24px_rgba(246,187,63,0.3)] transition hover:-translate-y-0.5"
              >
                <Icon name="cart" size={16} />
                اطلب الآن
              </button>
            </div>
          </div>

          <section className="bg-[#0d1d2d] py-10 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-6 max-w-3xl lg:mb-10">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1.5 text-xs font-bold text-sky-200">
                  <Icon name="settings" size={14} />
                  لحام اوتوماتيكي
                </div>
                <h2 className="text-3xl font-black sm:text-4xl lg:text-5xl">لحام اوتوماتيكي</h2>
                <p className="mt-3 text-base leading-8 text-slate-300 lg:text-lg lg:leading-9">
                  مكواة لحام مزودة بنظام مدمج لتغذية سلك اللحام، كتعاونك تقدم السلك أثناء العمل بطريقة عملية.
                </p>
              </div>

              <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
                <div className="order-2 lg:order-1">
                  <div className="grid gap-3 sm:grid-cols-2 lg:gap-4">
                    {[
                      { icon: 'zap', title: 'تغذية عملية', text: 'تقدّم السلك بشكل مستمر أثناء الاستخدام.' },
                      { icon: 'settings', title: 'راحة في العمل', text: 'تسهل التغطية على الأسلاك والمكونات.' },
                    ].map((item) => (
                      <div key={item.title} className="rounded-[24px] border border-sky-500/20 bg-white/5 p-4 shadow-[0_20px_30px_rgba(14,116,144,0.08)] lg:min-h-[210px] lg:p-6">
                        <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-300 lg:h-12 lg:w-12">
                          <Icon name={item.icon as any} size={20} />
                        </div>
                        <h3 className="text-xl font-black text-white lg:text-2xl">{item.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-slate-300 lg:text-base">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="order-1 rounded-[30px] border border-sky-400/20 bg-white/5 p-0 shadow-[0_30px_50px_rgba(14,116,144,0.15)] lg:order-2">
                  <div className="relative h-[420px] overflow-hidden rounded-[30px] bg-white lg:h-[520px]">
                    <Image
                      src={solderingGunGif}
                      alt="GIF لمكواة اللحام"
                      fill
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8 max-w-3xl lg:mb-12">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                  <Icon name="spark" size={14} />
                  قاطع متعدد الاستخدامات
                </div>
                <h2 className="text-3xl font-black text-slate-900 lg:text-5xl">قاطع متعدد الاستخدامات</h2>
                <p className="mt-4 text-base leading-8 text-slate-600 lg:text-lg lg:leading-9">
                  قاطع أسلاك دقيق مخصص لقطع الأسلاك الصغيرة وأطراف المكونات الإلكترونية.
                </p>
              </div>

              <div className="space-y-6">
                <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-[#f6f8fc] shadow-[0_24px_45px_rgba(15,23,42,0.04)]">
                  <div className="relative h-[420px] overflow-hidden bg-white sm:h-[500px] lg:h-[620px]">
                    <Image
                      src={wireCutterPhoto}
                      alt="قاطع أسلاك متعدد الاستخدامات"
                      fill
                      className="object-cover object-center scale-[1.02]"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
                  {[
                    { title: 'قطع دقيق', body: 'مناسب للأسلاك الصغيرة.', icon: 'check' },
                    { title: 'تحكم أفضل', body: 'مفيد في المشاريع الدقيقة وأعمال الإصلاح.', icon: 'pin' },
                    { title: 'قاطع متعدد الاستخدامات', body: 'أداة عملية في نفس الباك.', icon: 'shield' },
                  ].map((item) => (
                    <div key={item.title} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 shadow-[0_18px_32px_rgba(15,23,42,0.03)] lg:min-h-[220px] lg:p-6">
                      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 lg:h-14 lg:w-14">
                        <Icon name={item.icon as any} size={22} />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 lg:text-2xl">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600 lg:text-base">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#f0f5ff] py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">جوج أدوات مكملين لبعضياتهم، فباك واحد!</h2>
              </div>

              <div className="mb-8 flex justify-center">
                <div className="relative h-[420px] w-full max-w-5xl overflow-hidden rounded-[28px] border border-sky-200 bg-white shadow-[0_16px_28px_rgba(15,23,42,0.05)]">
                  <Image
                    src={solderingPackImage}
                    alt="منتج باك اللحام الاوتوماتيكي + قاطع الأسلاك"
                    fill
                    className="object-cover object-center"
                  />
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
                {[
                  { title: 'لحام اوتوماتيكي', text: 'مكواة اللحام كتعاونك فعمليات اللحام وربط المكونات الإلكترونية.' },
                  { title: 'قاطع متعدد الاستخدامات', text: 'قاطع الأسلاك كيساعدك فالتقليم وقطع الأطراف والأسلاك الدقيقة.' },
                  { title: 'باك اللحام الاوتوماتيكي + قاطع الأسلاك', text: 'جوج أدوات مختلفة الاستعمال مجموعين فطلب واحد.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-[28px] border border-sky-200 bg-white p-5 text-center shadow-[0_18px_32px_rgba(15,23,42,0.04)]">
                    <h3 className="text-lg font-black text-slate-900">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-[#f8fafc] py-14 text-slate-900">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8 text-center">
                <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-amber-700">
                  <Icon name="star" size={14} />
                  آراء موثّقة
                </p>
                <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">ماذا قال من جربوه؟</h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    name: 'ياسين ب.',
                    city: 'الرباط',
                    date: 'منذ 2 أيام',
                    text: 'المنتج فعلاً أعطاني سرعته في العمل، والراحة واضحة أثناء اللحام. الجودة قوية والباك يشتغل كتحتاجه.',
                  },
                  {
                    name: 'أمين ح.',
                    city: 'فاس',
                    date: 'منذ 5 أيام',
                    text: 'الباك عملي جدًا، خاصة القاطع الدقيق. الخطوات سريعة، واللحام أوضح من أول استخدام.',
                  },
                  {
                    name: 'حسن ت.',
                    city: 'الدار البيضاء',
                    date: 'منذ أسبوع',
                    text: 'عندك كلشي في باك واحد، وهذا هو اللي خلاني أستعمله يومياً في أعمالي الصغيرة.',
                  },
                  {
                    name: 'كريم م.',
                    city: 'مراكش',
                    date: 'منذ 9 أيام',
                    text: 'المكواة متينة، وسهلة في الاستخدام، والقاطع يخفف عني الوقت في كل مشروع صغير.',
                  },
                ].map((review) => (
                  <div key={review.name} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_32px_rgba(15,23,42,0.04)]">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-600 text-sm font-black text-white">
                          {review.name.charAt(0)}
                        </span>
                        <div className="text-right">
                          <p className="text-sm font-black text-slate-900">{review.name}</p>
                          <p className="text-xs text-slate-500">{review.city} · {review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Icon key={`${review.name}-${index}`} name="star" size={14} className="fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm leading-7 text-slate-600 text-right">“{review.text}”</p>
                    <p className="mt-4 flex items-center justify-end gap-1.5 text-xs font-black text-emerald-700">
                      <Icon name="check-circle" size={14} />
                      شراء موثّق
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-[#0b1730] py-14 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8 max-w-3xl">
                <h2 className="text-3xl font-black">أسئلة شائعة</h2>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div key={faq.q} className="rounded-[20px] border border-slate-700 bg-white/5 overflow-hidden">
                    <div className="flex items-center justify-between gap-4 px-5 py-4 text-right font-bold text-white">
                      <span>{index + 1}. {faq.q}</span>
                      <Icon name="chevron-down" size={18} className="text-sky-300" />
                    </div>
                    <div className="px-5 pb-4 text-sm leading-7 text-slate-300">{faq.a}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-5xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
            <div className="rounded-[28px] border border-sky-200 bg-sky-50 p-6 text-center shadow-[0_18px_32px_rgba(59,130,246,0.08)]">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-sky-700">
                <Icon name="phone" size={14} />
                تواصل مباشر
              </div>
              <h3 className="text-2xl font-black text-slate-900">ادخل معلوماتك للطلب.</h3>
              <p className="mt-3 text-base text-slate-600">مكواة لحام بنظام تغذية سلك اللحام + قاطع أسلاك دقيق، بجوج فباك واحد.</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={scrollToOrderForm}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-black text-white"
                >
                  <Icon name="cart" size={16} />
                  اطلب الآن
                </button>
                <a
                  href={`https://wa.me/${STORE.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('السلام عليكم، بدي اطلب باك مكواة اللحام + قاطع الأسلاك الدقيق.')}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-black text-slate-900"
                >
                  <Icon name="whatsapp" size={18} />
                  تواصل واتساب
                </a>
              </div>
            </div>
          </section>
        </main>

        <Footer />

        {showStickyCta && (
          <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-3 sm:px-4">
            <div className="w-full max-w-xl rounded-[26px] border border-slate-200/80 bg-white/90 p-2 shadow-[0_18px_40px_rgba(15,23,42,0.18)] backdrop-blur-xl">
              <div className="flex items-center justify-center gap-3 rounded-[20px] bg-slate-950 px-3 py-2.5 text-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f6bb3f] text-slate-900">
                  <Icon name="cart" size={18} />
                </div>

                <div className="flex min-w-0 items-center gap-2 text-center">
                  <div>
                    <div className="text-[10px] font-bold text-slate-300">الدفع عند الاستلام</div>
                    <div className="text-base font-black text-white">{total} درهم</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={scrollToOrderForm}
                  className="ml-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#f6bb3f] px-4 py-2.5 text-sm font-black text-slate-900 shadow-[0_12px_24px_rgba(246,187,63,0.35)] transition hover:scale-[1.01]"
                >
                  <Icon name="arrow-left" size={15} />
                  اطلب الآن
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
