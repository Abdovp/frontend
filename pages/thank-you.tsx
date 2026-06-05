import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';
import UpsellPopup from '../components/UpsellPopup';
import ProductImage from '../components/ui/ProductImage';
import Icon, { Stars } from '../components/ui/Icon';
import { finalizeOrder, type FinalizeUpsellInput } from '../lib/api/orders';
import { getCallScheduleInfo } from '../lib/call-schedule';
import {
  CURRENCY,
  productList,
  STORE,
  type Product,
  type ProductId,
} from '../lib/products';
import {
  clearOrderConfirmation,
  loadOrderConfirmation,
  type OrderConfirmation,
} from '../lib/order-confirmation';
import { pickUpsellProduct, UPSELL_PRICE } from '../lib/upsell';

function getOrderedProductIds(order: OrderConfirmation): ProductId[] {
  return [...new Set(order.items.map((item) => item.productId).filter(Boolean))] as ProductId[];
}

const ON_CALL_STEPS = [
  {
    title: 'نأكدو شنو طلبتي',
    desc: 'نقولو ليك المنتجات والثمن بالضبط — باش تكون مطمئن 100%.',
  },
  {
    title: 'ناخدو العنوان ديالك',
    desc: 'العنوان كامل ف المكالمة: المدينة، الحي، ورقم الدار. ساهل وبسيط.',
  },
  {
    title: 'نحددو موعد التوصيل',
    desc: 'نوصلو لبابك ف 24–48 ساعة. تخلّص ملي توصلك وتعاين المنتج.',
  },
];

const THANK_YOU_REVIEWS = [
  {
    name: 'أيمن بنعلي',
    city: 'الدار البيضاء',
    text: 'جاوبت على المكالمة وف يومين وصلني الطرد. سرعة مجنونة!',
    rating: 5,
  },
  {
    name: 'سلمى الحسني',
    city: 'الرباط',
    text: 'أكدو ليا الطلب ف المكالمة واخدو العنوان. كلشي واضح ومريح.',
    rating: 5,
  },
  {
    name: 'كريم زيان',
    city: 'مراكش',
    text: 'المنتج فاق التوقعات! جاوبت على المكالمة وكان التوصيل سريع.',
    rating: 5,
  },
];

const THANK_YOU_FAQS = [
  {
    q: 'واش خاصني نخلّص قبل ما يوصلني الطلب؟',
    a: 'لا أبداً. الدفع عند الاستلام فقط — كتخلّص ملي توصلك السلعة وتعاينها بيدك.',
  },
  {
    q: 'واش غادي تعيطو على رقم مجهول؟',
    a: 'إيه، الرقم ممكن يبان مجهول. جاوب عليه بلا تردد — هاد المكالمة ضرورية باش نأكدو الطلب.',
  },
  {
    q: 'شنو غادي يوقع ف المكالمة بالضبط؟',
    a: 'غادي نأكدو المنتجات والثمن، وناخدو العنوان ديالك كامل، ونحددو معاك موعد التوصيل.',
  },
  {
    q: 'شحال كياخد التوصيل من بعد المكالمة؟',
    a: 'عادةً 24 إلى 48 ساعة لكل مدن المغرب. كنقولو ليك التاريخ بالضبط ف المكالمة.',
  },
  {
    q: 'واش نقدر نبدّل أو نلغي الطلب؟',
    a: 'إيه، ف المكالمة نقدرو نبدلو العرض أو نلغيو الطلب بلا أي مشكل.',
  },
  {
    q: 'ما وصلنيش التيليفون — شنو ندير؟',
    a: `راسلنا ف الواتساب على ${STORE.phone} وغادي نتصلو بيك من جديد ف أقرب وقت.`,
  },
];

export default function ThankYou() {
  const [order, setOrder] = useState<OrderConfirmation | null>(null);
  const [upsellProduct, setUpsellProduct] = useState<Product | null>(null);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const sheetSentRef = useRef(false);
  const upsellProductRef = useRef<Product | null>(null);

  const sendOrderToSheet = useCallback((upsell?: FinalizeUpsellInput) => {
    if (sheetSentRef.current) return;
    const confirmation = loadOrderConfirmation();
    if (!confirmation?.orderId || !confirmation?.eventId) return;
    sheetSentRef.current = true;
    void finalizeOrder({
      orderId: confirmation.orderId,
      eventId: confirmation.eventId,
      upsell,
    }).then((ok) => {
      if (!ok) sheetSentRef.current = false;
    });
  }, []);

  useEffect(() => {
    const saved = loadOrderConfirmation();
    setOrder(saved);
    if (saved) {
      const upsell = pickUpsellProduct(getOrderedProductIds(saved));
      upsellProductRef.current = upsell;
      setUpsellProduct(upsell);
      if (!upsell) sendOrderToSheet();
    }
    setReady(true);
  }, [sendOrderToSheet]);

  const handleCloseUpsell = useCallback(() => {
    setUpsellProduct(null);
    upsellProductRef.current = null;
    sendOrderToSheet();
  }, [sendOrderToSheet]);

  const handleUpsellAdded = useCallback(() => {
    const product = upsellProductRef.current;
    setOrder(loadOrderConfirmation());
    setUpsellProduct(null);
    upsellProductRef.current = null;
    if (!product) {
      sendOrderToSheet();
      return;
    }
    sendOrderToSheet({
      product_id: product.id,
      product_name: product.nameAr,
      unit_price: UPSELL_PRICE,
    });
  }, [sendOrderToSheet]);

  const firstName = order?.firstName ?? 'صديقنا';
  const fullName = order?.fullName ?? firstName;
  const orderedAt = order?.orderedAt ? new Date(order.orderedAt) : new Date();
  const callInfo = getCallScheduleInfo(orderedAt);

  const moreProducts = useMemo(() => {
    const orderedIds = order ? getOrderedProductIds(order) : [];
    return productList.filter((p) => !orderedIds.includes(p.id));
  }, [order]);

  const copyOrderId = async () => {
    if (!order?.publicOrderId) return;
    try {
      await navigator.clipboard.writeText(order.publicOrderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked
    }
  };

  return (
    <>
      <Head>
        <title>شكراً — طلبك محجوز | {STORE.nameAr}</title>
        <meta
          name="description"
          content="طلبك محجوز في انتظار تأكيدك. غادي نتصلو بيك باش نأكدو الطلب وناخدو العنوان."
        />
      </Head>

      <main className="bg-cream min-h-screen py-10 md:py-14 px-4" dir="rtl">
        <div className="max-w-lg mx-auto space-y-5">

          {/* ── HEADER ── */}
          <div className="text-center">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-700 text-white mb-5 shadow-soft">
              <Icon name="check" size={32} />
            </span>
            <p className="text-ink/70 text-base mb-1">
              شكراً <span className="font-bold text-ink">{firstName}</span> 🌿
            </p>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-ink leading-snug">
              طلبك محجوز – في انتظار تأكيدك
            </h1>
            {order?.publicOrderId ? (
              <button
                type="button"
                onClick={copyOrderId}
                className="inline-flex items-center gap-2 mt-4 text-sm text-ink/55 hover:text-ink transition"
              >
                <span>رقم الطلب:</span>
                <span className="font-bold text-ink" dir="ltr">
                  {order.publicOrderId}
                </span>
                <Icon name="badge" size={14} className="text-ink/40" />
                {copied ? <span className="text-emerald-600 text-xs font-bold">تم النسخ</span> : null}
              </button>
            ) : null}
          </div>

          {/* ── CALL CARD (photo style) ── */}
          <div className="rounded-2xl border border-ink/[0.08] bg-gradient-to-b from-[#f3ede3] to-white p-5 sm:p-6 shadow-soft">
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-accent-dark mb-2">{callInfo.statusLine}</p>
                <p className="font-heading font-extrabold text-ink text-lg sm:text-xl leading-snug">
                  {callInfo.message}
                </p>
              </div>
              <span className="flex shrink-0 items-center justify-center w-12 h-12 rounded-full bg-emerald-700 text-white">
                <Icon name="phone" size={22} />
              </span>
            </div>
            {order?.phone ? (
              <div className="mt-5 flex items-center gap-2.5 bg-white border border-ink/[0.1] rounded-xl px-4 py-3.5 text-sm">
                <Icon name="phone" size={16} className="text-ink/40 shrink-0" />
                <span className="text-ink/55">بنتصل على:</span>
                <span className="font-bold text-ink mr-auto" dir="ltr">
                  {order.phone}
                </span>
              </div>
            ) : null}
          </div>

          {/* ── CUSTOMER DETAILS CARD (photo style) ── */}
          {ready && order ? (
            <div className="bg-white rounded-2xl border border-ink/[0.1] shadow-soft p-5 sm:p-6">
              <h2 className="font-heading font-bold text-ink mb-4">بياناتك للمكالمة</h2>
              <div className="space-y-2.5 text-sm mb-5">
                <p>
                  <span className="text-ink/50">الاسم: </span>
                  <span className="font-bold text-ink">{fullName}</span>
                </p>
                <p>
                  <span className="text-ink/50">الجوال: </span>
                  <span className="font-bold text-ink" dir="ltr">
                    {order.phone}
                  </span>
                </p>
              </div>
              <div className="w-full flex items-center justify-center gap-2 bg-emerald-700 text-white rounded-xl py-3.5 text-sm font-bold">
                <Icon name="check" size={18} />
                البيانات صحيحة
              </div>
            </div>
          ) : ready && !order ? (
            <div className="bg-white rounded-2xl border border-ink/[0.08] p-5 text-sm text-ink/55 text-center">
              ما لقيناش تفاصيل الطلب. إلا كملتي الطلب، غادي نتصلو بيك قريباً.
            </div>
          ) : null}

          {/* ── WHAT HAPPENS ON THE CALL ── */}
          <div className="pt-2">
            <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-ink text-center mb-1">
              شنو غادي يوقع ف التيليفون؟
            </h2>
            <p className="text-ink/55 text-sm text-center mb-6">
              ما خصك تعمر العنوان ف الموقع — غادي ناخدوه معاك ف المكالمة
            </p>
            <div className="space-y-3">
              {ON_CALL_STEPS.map((step, i) => (
                <div
                  key={step.title}
                  className="bg-white rounded-2xl border border-ink/[0.08] shadow-soft p-5 flex items-start gap-4"
                >
                  <span className="flex shrink-0 items-center justify-center w-9 h-9 rounded-full bg-brand text-white font-heading font-extrabold text-sm">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-heading font-bold text-ink mb-1">{step.title}</h3>
                    <p className="text-sm text-ink/65 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── REVIEWS ── */}
          <div className="pt-4">
            <h2 className="font-heading font-extrabold text-lg text-ink text-center mb-5">
              اللي جاوبو على المكالمة — وصلهم الطرد بسرعة
            </h2>
            <div className="space-y-3">
              {THANK_YOU_REVIEWS.map((r) => (
                <div key={r.name} className="bg-white rounded-2xl border border-ink/[0.08] p-5 flex gap-4">
                  <span className="flex shrink-0 items-center justify-center w-10 h-10 rounded-full bg-emerald-700 text-white font-heading font-bold">
                    {r.name.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-ink text-sm">
                        {r.name} · {r.city}
                      </span>
                      <Stars value={r.rating} size={13} />
                    </div>
                    <p className="text-sm text-ink/70 leading-relaxed">{r.text}</p>
                    <p className="flex items-center gap-1 mt-2 text-xs text-emerald-700 font-semibold">
                      <Icon name="check-circle" size={13} />
                      شراء موثّق
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── FAQ ── */}
          <div className="pt-4">
            <h2 className="font-heading text-xl font-extrabold text-ink text-center mb-1">
              عندك سؤال؟
            </h2>
            <p className="text-ink/55 text-sm text-center mb-5">
              جاوبنا على الأسئلة اللي كتتسأل بزاف من بعد الطلب
            </p>
            <div className="space-y-2">
              {THANK_YOU_FAQS.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={faq.q} className="bg-white rounded-2xl border border-ink/[0.08] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full px-5 py-4 flex items-center justify-between text-start gap-3"
                      aria-expanded={isOpen}
                    >
                      <span className="font-heading font-bold text-ink text-sm">{faq.q}</span>
                      <span
                        className={`flex items-center justify-center w-7 h-7 rounded-full bg-brand/[0.07] text-brand shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      >
                        <Icon name="chevron-down" size={16} />
                      </span>
                    </button>
                    <div
                      className={`grid transition-all duration-300 ${
                        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-4 text-sm text-ink/70 leading-relaxed">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── MORE PRODUCTS ── */}
          {moreProducts.length > 0 && (
            <div className="pt-4">
              <h2 className="font-heading text-xl font-extrabold text-ink text-center mb-1">
                بغيتي تشوف منتجات أخرى؟
              </h2>
              <p className="text-ink/55 text-sm text-center mb-5">
                منتجات أخرى من بويا شوب — نفس التوصيل والدفع عند الاستلام
              </p>
              <div className="space-y-3">
                {moreProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={product.href}
                    className="flex items-center gap-4 bg-white rounded-2xl border border-ink/[0.08] p-4 hover:border-brand/25 hover:shadow-soft transition"
                    onClick={() => clearOrderConfirmation()}
                  >
                    <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden">
                      <ProductImage
                        src={product.image}
                        alt={product.nameAr}
                        fallbackLabel={product.nameAr}
                        aspect="square"
                        fit="cover"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-ink text-sm leading-snug line-clamp-1">
                        {product.nameAr}
                      </p>
                      <p className="text-xs text-ink/50 mt-0.5 line-clamp-1">{product.tagline}</p>
                      <p className="font-heading font-extrabold text-brand text-sm mt-1">
                        من {product.offers[0].price} {CURRENCY}
                      </p>
                    </div>
                    <Icon name="arrow-left" size={18} className="text-ink/30 shrink-0" />
                  </Link>
                ))}
              </div>
              <Link
                href="/collections"
                className="btn-outline w-full text-center mt-4"
                onClick={() => clearOrderConfirmation()}
              >
                <Icon name="spark" size={18} />
                شوف كل المنتجات
              </Link>
            </div>
          )}

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="text-sm font-semibold text-brand hover:underline"
              onClick={() => clearOrderConfirmation()}
            >
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </main>

      <Footer />

      {upsellProduct && (
        <UpsellPopup
          product={upsellProduct}
          onAdded={handleUpsellAdded}
          onClose={handleCloseUpsell}
        />
      )}
    </>
  );
}
