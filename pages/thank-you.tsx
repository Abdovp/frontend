import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';
import UpsellPopup from '../components/UpsellPopup';
import CartProductThumb from '../components/ui/CartProductThumb';
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
  confirmOrderDetails,
  loadOrderConfirmation,
  type OrderConfirmation,
} from '../lib/order-confirmation';
import { pickUpsellProduct, UPSELL_PRICE } from '../lib/upsell';

function getOrderedProductIds(order: OrderConfirmation): ProductId[] {
  return [...new Set(order.items.map((item) => item.productId).filter(Boolean))] as ProductId[];
}

function formatOfferLabel(offer: number): string {
  return `${offer} ${offer === 1 ? 'وحدة' : 'وحدات'}`;
}

const ON_CALL_STEPS = [
  {
    title: 'نأكدو شنو طلبتي',
    desc: 'نقولو ليك المنتجات والثمن بالضبط — باش تكون مطمئن 100%.',
  },
  {
    title: 'ناخدو العنوان ديالك',
    desc: 'العنوان كامل ف المكالمة: المدينة، الحي. ساهل وبسيط.',
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
  const [detailsConfirmed, setDetailsConfirmed] = useState(false);
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
    setDetailsConfirmed(saved?.detailsConfirmed ?? false);
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

  const handleConfirmDetails = () => {
    const updated = confirmOrderDetails();
    if (updated) {
      setOrder(updated);
      setDetailsConfirmed(true);
    }
  };

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

      <main className="ty-page" dir="rtl">
        <div className="ty-wrap">

          {/* ── HERO ── */}
          <header className="ty-hero">
            <span className="ty-hero-icon">
              <Icon name="check" size={30} />
            </span>
            <p className="text-ink/55 text-base mb-1">
              شكراً <span className="font-bold text-ink">{firstName}</span>
            </p>
            <h1 className="font-heading text-2xl sm:text-[1.75rem] font-extrabold text-ink leading-snug text-balance">
              طلبك محجوز – في انتظار تأكيدك
            </h1>
            {order?.publicOrderId ? (
              <button type="button" onClick={copyOrderId} className="ty-order-pill">
                <span>رقم الطلب</span>
                <span className="font-bold text-ink" dir="ltr">
                  {order.publicOrderId}
                </span>
                <Icon name="badge" size={14} className="text-ink/35" />
                {copied ? <span className="text-emerald-600 text-xs font-bold">تم النسخ</span> : null}
              </button>
            ) : null}
          </header>

          {/* ── PRIORITY: CALL + DETAILS ── */}
          <div className="ty-priority-stack">
            <div className="ty-call-card">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <p className="ty-call-status">{callInfo.statusLine}</p>
                  <p className="ty-call-message">{callInfo.message}</p>
                  <p className="ty-unknown-pill">
                    <Icon name="phone" size={13} />
                    الرقم غادي يبان مجهول — جاوب عليه بلا تردد
                  </p>
                </div>
                <span className="flex shrink-0 items-center justify-center w-11 h-11 rounded-full bg-emerald-700 text-white shadow-soft">
                  <Icon name="phone" size={20} />
                </span>
              </div>
              {order?.phone ? (
                <div className="ty-phone-row">
                  <span className="text-ink/50 text-sm flex items-center gap-2 shrink-0">
                    <Icon name="phone" size={15} className="text-emerald-700/60" />
                    غادي نتصلو على:
                  </span>
                  <span className="ty-phone-number" dir="ltr">
                    {order.phone}
                  </span>
                </div>
              ) : null}
            </div>

            {ready && order ? (
              <div className="ty-details-card">
                <div className="ty-details-head">
                  <h2 className="font-heading font-bold text-ink text-base">بياناتك للمكالمة</h2>
                  {detailsConfirmed ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
                      <Icon name="check-circle" size={13} />
                      مؤكد
                    </span>
                  ) : null}
                </div>
                <div>
                  <div className="ty-detail-row">
                    <span className="ty-detail-label">الاسم</span>
                    <span className="ty-detail-value">{fullName}</span>
                  </div>
                  <div className="ty-detail-row">
                    <span className="ty-detail-label">الجوال</span>
                    <span className="ty-detail-value font-heading tabular-nums" dir="ltr">
                      {order.phone}
                    </span>
                  </div>
                </div>
                {detailsConfirmed ? (
                  <p className="ty-status-badge" role="status" aria-live="polite">
                    <Icon name="check-circle" size={18} className="text-emerald-700" />
                    تم التأكيد — بانتظار مكالمتنا
                  </p>
                ) : (
                  <>
                    <p className="ty-confirm-hint">تأكد أن رقم الجوال صحيح قبل ما نتصلو بيك</p>
                    <button type="button" onClick={handleConfirmDetails} className="ty-confirm-btn">
                      <Icon name="check" size={18} />
                      البيانات صحيحة
                    </button>
                  </>
                )}
              </div>
            ) : ready && !order ? (
              <div className="ty-details-card text-sm text-ink/55 text-center">
                ما لقيناش تفاصيل الطلب. إلا كملتي الطلب، غادي نتصلو بيك قريباً.
              </div>
            ) : null}
          </div>

          {/* ── ORDER SUMMARY ── */}
          {ready && order && order.items.length > 0 ? (
            <section className="ty-section" aria-labelledby="ty-order-summary">
              <h2 id="ty-order-summary" className="ty-section-title">
                ملخص الطلب
              </h2>
              <div className="ty-order-summary">
                {order.items.map((item, index) => (
                  <div
                    key={`${item.productId ?? item.name}-${item.offer}-${index}`}
                    className="ty-order-line"
                  >
                    {item.productId ? (
                      <CartProductThumb productId={item.productId} size="sm" />
                    ) : (
                      <span className="flex shrink-0 items-center justify-center w-12 h-12 rounded-xl bg-brand/10 text-brand">
                        <Icon name="spark" size={20} />
                      </span>
                    )}
                    <div className="flex flex-1 justify-between gap-3 min-w-0">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-ink leading-snug line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-xs text-ink/50 mt-0.5">
                          {formatOfferLabel(item.offer)}
                          {item.isUpsell ? (
                            <span className="mr-1.5 text-accent-dark font-semibold">· إضافة</span>
                          ) : null}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-ink shrink-0">
                        {item.price * item.quantity} {CURRENCY}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="ty-order-total">
                  <span>المجموع</span>
                  <span className="ty-order-total-price">
                    {order.total} {CURRENCY}
                  </span>
                </div>
                <p className="ty-order-cod">
                  <Icon name="wallet" size={14} />
                  دفع عند الاستلام — ما كاينش دفع أونلاين
                </p>
              </div>
            </section>
          ) : null}

          {/* ── WHAT HAPPENS ON THE CALL ── */}
          <section className="ty-section" aria-labelledby="ty-call-steps">
            <h2 id="ty-call-steps" className="ty-section-title">
              شنو غادي يوقع ف الاتصال؟
            </h2>
            <div className="ty-timeline">
              {ON_CALL_STEPS.map((step, i) => (
                <div key={step.title} className="ty-timeline-item">
                  <span className="ty-timeline-num">{i + 1}</span>
                  <div className="ty-timeline-body">
                    <h3 className="font-heading font-bold text-ink mb-1">{step.title}</h3>
                    <p className="text-sm text-ink/65 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── REVIEWS ── */}
          <section className="ty-section" aria-labelledby="ty-reviews">
            <h2 id="ty-reviews" className="ty-section-title">
              اللي جاوبو على المكالمة — وصلهم الطرد بسرعة
            </h2>
            <div className="space-y-3">
              {THANK_YOU_REVIEWS.map((r) => (
                <div key={r.name} className="ty-review-card">
                  <span className="ty-review-avatar">{r.name.charAt(0)}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-bold text-ink text-sm">
                        {r.name} · {r.city}
                      </span>
                      <Stars value={r.rating} size={13} />
                    </div>
                    <p className="text-sm text-ink/70 leading-relaxed">{r.text}</p>
                    <p className="flex items-center gap-1 mt-2.5 text-xs text-emerald-700 font-semibold">
                      <Icon name="check-circle" size={13} />
                      شراء موثّق
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="ty-section" aria-labelledby="ty-faq">
            <h2 id="ty-faq" className="ty-section-title">
              عندك سؤال؟
            </h2>
            <p className="ty-section-sub">جاوبنا على الأسئلة اللي كتتسأل بزاف من بعد الطلب</p>
            <div className="space-y-2.5">
              {THANK_YOU_FAQS.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={faq.q} className="ty-faq-card">
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
          </section>

          {/* ── MORE PRODUCTS ── */}
          {moreProducts.length > 0 && (
            <section className="ty-section" aria-labelledby="ty-more-products">
              <h2 id="ty-more-products" className="ty-section-title">
                بغيتي تشوف منتجات أخرى؟
              </h2>
              <p className="ty-section-sub">
                منتجات أخرى من بويا شوب — نفس التوصيل والدفع عند الاستلام
              </p>
              <div className="space-y-3">
                {moreProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={product.href}
                    className="ty-product-card"
                    onClick={() => clearOrderConfirmation()}
                  >
                    <div className="ty-product-thumb">
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
                      <p className="font-heading font-extrabold text-brand text-sm mt-1.5">
                        من {product.offers[0].price} {CURRENCY}
                      </p>
                    </div>
                    <Icon name="arrow-left" size={18} className="text-brand/40 shrink-0" />
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
            </section>
          )}

          <div className="pt-1 pb-2 text-center">
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
