import { useCallback, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UpsellPopup from '../components/UpsellPopup';
import TrustBadgesStrip from '../components/TrustBadgesStrip';
import Icon, { Stars } from '../components/ui/Icon';
import { finalizeOrder, type FinalizeUpsellInput } from '../lib/api/orders';
import { CURRENCY, SHARED_GUARANTEES, STORE, type Product, type ProductId } from '../lib/products';
import {
  clearOrderConfirmation,
  loadOrderConfirmation,
  type OrderConfirmation,
} from '../lib/order-confirmation';
import { pickUpsellProduct, UPSELL_PRICE } from '../lib/upsell';

function getOrderedProductIds(order: OrderConfirmation): ProductId[] {
  return [...new Set(order.items.map((item) => item.productId).filter(Boolean))] as ProductId[];
}

function offerLabel(offer: number, isUpsell?: boolean) {
  if (isUpsell) return 'عرض خاص';
  if (offer === 1) return 'وحدة واحدة';
  return `${offer} وحدات`;
}

const ON_CALL_STEPS = [
  {
    icon: 'check-circle' as const,
    title: 'نأكدو شنو طلبتي',
    desc: 'نقولو ليك المنتجات والثمن بالضبط — باش تكون مطمئن 100%.',
  },
  {
    icon: 'pin' as const,
    title: 'ناخدو العنوان ديالك',
    desc: 'العنوان كامل ف المكالمة: المدينة، الحي، ورقم الدار. ساهل وبسيط.',
  },
  {
    icon: 'truck' as const,
    title: 'نحددو موعد التوصيل',
    desc: 'نوصلو لبابك ف 24–48 ساعة. تخلّص ملي توصلك وتعاين المنتج.',
  },
];

const CALL_REVIEWS = [
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
];

export default function ThankYou() {
  const [order, setOrder] = useState<OrderConfirmation | null>(null);
  const [upsellProduct, setUpsellProduct] = useState<Product | null>(null);
  const [ready, setReady] = useState(false);
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
  const whatsappHref = `https://wa.me/${STORE.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('مرحبا، كملت الطلب وما وصلنيش التيليفون')}`;

  return (
    <>
      <Head>
        <title>مبروك! طلبك مسجّل | بويا شوب</title>
        <meta
          name="description"
          content="طلبك مسجّل. انتظر مكالمة التأكيد — غادي نأكدو الطلب وناخدو العنوان ديالك ف المكالمة."
        />
      </Head>
      <Header />

      <main className="bg-cream min-h-[70vh]" dir="rtl">
        {/* ── CELEBRATION HERO ── */}
        <section className="bg-brand text-white pt-10 pb-16 md:pt-14 md:pb-20 relative overflow-hidden">
          <div className="absolute inset-0 hero-grid-bg opacity-40" aria-hidden />
          <div className="container-wide max-w-2xl mx-auto relative text-center px-4">
            <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-400/20 text-emerald-300 mb-6 ring-4 ring-emerald-400/30">
              <Icon name="check-circle" size={44} />
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-balance mb-4">
              مبروك {firstName}! 🎉
            </h1>
            <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-md mx-auto mb-6">
              طلبك مسجّل ومحجوز. بقات خطوة وحدة باش توصلك السلعة —
              <span className="font-bold text-accent"> جاوب على التيليفون</span>.
            </p>
            {order?.publicOrderId ? (
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2.5">
                <Icon name="badge" size={16} className="text-accent" />
                <span className="text-sm text-white/70">رقم الطلب</span>
                <span className="font-heading font-extrabold text-accent" dir="ltr">
                  {order.publicOrderId}
                </span>
              </div>
            ) : null}
          </div>
        </section>

        {/* ── PHONE CALL — primary focus ── */}
        <section className="px-4 -mt-8 relative z-10 pb-8">
          <div className="container-wide max-w-2xl mx-auto">
            <div className="card-elevated p-6 sm:p-8 border-2 border-brand/15 shadow-lift">
              <div className="flex items-start gap-4 mb-5">
                <span className="flex shrink-0 items-center justify-center w-14 h-14 rounded-2xl bg-brand text-white shadow-brand animate-cta-pulse">
                  <Icon name="phone" size={28} />
                </span>
                <div className="min-w-0">
                  <p className="font-heading font-extrabold text-xl sm:text-2xl text-ink leading-snug">
                    انتظر مكالمة التأكيد 📞
                  </p>
                  <p className="text-ink/65 mt-2 leading-relaxed">
                    غادي يتصل بيك فريق {STORE.nameAr}{' '}
                    <span className="font-bold text-brand">ف أقل من 10 دقائق</span>
                    {order?.phone ? (
                      <>
                        {' '}
                        على{' '}
                        <span dir="ltr" className="font-bold text-ink">
                          {order.phone}
                        </span>
                      </>
                    ) : null}
                    .
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3.5 flex items-start gap-3">
                <Icon name="flame" size={20} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-900 font-semibold leading-relaxed">
                  <span className="font-extrabold">مهم:</span> الرقم ممكن يبان مجهول — جاوب عليه!
                  الزبناء اللي كيجاوبو كيستلمو أسرع بيوم كامل.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 mt-5">
                <div className="flex items-center gap-3 bg-cream rounded-xl px-4 py-3">
                  <Icon name="clock" size={18} className="text-brand shrink-0" />
                  <div className="text-sm leading-tight">
                    <p className="font-bold text-ink">ساعات الخدمة</p>
                    <p className="text-ink/55">11 صباحاً — 8 مساءً</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-cream rounded-xl px-4 py-3">
                  <Icon name="spark" size={18} className="text-brand shrink-0" />
                  <div className="text-sm leading-tight">
                    <p className="font-bold text-ink">طلبت ف الليل؟</p>
                    <p className="text-ink/55">نتصلو بيك الصباح بكري</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHAT HAPPENS ON THE CALL ── */}
        <section className="px-4 pb-10">
          <div className="container-wide max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <p className="eyebrow mb-2">
                <Icon name="phone" size={14} />
                ف المكالمة
              </p>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-ink">
                شنو غادي يوقع ف التيليفون؟
              </h2>
              <p className="text-ink/55 mt-2 text-sm">
                ما خصك تعمر العنوان ف الموقع — غادي ناخدوه معاك ف المكالمة
              </p>
            </div>

            <div className="space-y-4">
              {ON_CALL_STEPS.map((step, i) => (
                <div key={step.title} className="card-flat p-5 sm:p-6 flex items-start gap-4">
                  <span className="flex shrink-0 items-center justify-center w-11 h-11 rounded-full bg-brand text-white font-heading font-extrabold">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon name={step.icon} size={18} className="text-brand shrink-0" />
                      <h3 className="font-heading font-bold text-ink">{step.title}</h3>
                    </div>
                    <p className="text-sm text-ink/65 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl py-4 px-5">
              <Icon name="wallet" size={22} className="text-emerald-700 shrink-0" />
              <p className="font-bold text-emerald-800 text-sm sm:text-base">
                الدفع عند الاستلام — ما كتخلّص والو حتى توصلك السلعة
              </p>
            </div>
          </div>
        </section>

        {/* ── ORDER RECAP ── */}
        {ready && order && (
          <section className="px-4 pb-10">
            <div className="container-wide max-w-2xl mx-auto">
              <div className="card-elevated overflow-hidden">
                <div className="bg-ink text-white px-6 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-heading font-extrabold text-lg flex items-center gap-2">
                      <Icon name="cart" size={20} className="text-accent" />
                      شنو طلبتي
                    </h2>
                    <span className="text-xs font-bold bg-white/15 rounded-full px-3 py-1">
                      غادي نأكدو ف المكالمة
                    </span>
                  </div>
                  <p className="text-white/55 text-xs mt-1">
                    هاد القائمة هي اللي غادي نقولوها ليك ف التيليفون
                  </p>
                </div>

                <div className="px-6 py-5 space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={`${item.name}-${item.offer}-${index}`}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="flex shrink-0 items-center justify-center w-8 h-8 rounded-full bg-brand/[0.08] text-brand">
                          <Icon name="check" size={14} />
                        </span>
                        <div className="min-w-0">
                          <p className="font-bold text-ink text-sm sm:text-base leading-snug">
                            {item.name}
                          </p>
                          <p className="text-ink/45 text-xs">{offerLabel(item.offer, item.isUpsell)}</p>
                        </div>
                      </div>
                      <p className="font-heading font-extrabold text-ink shrink-0">
                        {item.price * item.quantity}{' '}
                        <span className="text-sm text-ink/50">{CURRENCY}</span>
                      </p>
                    </div>
                  ))}

                  <div className="border-t border-ink/[0.08] pt-4 flex items-center justify-between">
                    <span className="font-heading font-bold text-ink">المجموع</span>
                    <span className="font-heading text-2xl font-extrabold text-brand">
                      {order.total} <span className="text-base text-ink/50">{CURRENCY}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {ready && !order && (
          <section className="px-4 pb-10">
            <div className="container-wide max-w-2xl mx-auto">
              <div className="card-flat px-6 py-5 text-sm text-ink/60 text-center">
                ما لقيناش تفاصيل الطلب. إلا كملتي الطلب، غادي يتصل بيك فريقنا قريباً.
              </div>
            </div>
          </section>
        )}

        {/* ── SOCIAL PROOF ── */}
        <section className="px-4 pb-10">
          <div className="container-wide max-w-2xl mx-auto">
            <h2 className="font-heading font-extrabold text-lg text-ink text-center mb-5">
              اللي جاوبو على المكالمة — وصلهم الطرد بسرعة
            </h2>
            <div className="space-y-3">
              {CALL_REVIEWS.map((r) => (
                <div key={r.name} className="card-flat p-5 flex gap-4">
                  <span className="flex shrink-0 items-center justify-center w-10 h-10 rounded-full bg-brand text-white font-heading font-bold">
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MISSED CALL FALLBACK ── */}
        <section className="px-4 pb-12">
          <div className="container-wide max-w-2xl mx-auto">
            <div className="card-flat p-6 text-center">
              <p className="font-heading font-bold text-ink mb-2">ما وصلكش التيليفون؟</p>
              <p className="text-sm text-ink/55 mb-4">
                راسلنا ف الواتساب وغادي نتصلو بيك من جديد
              </p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 font-bold text-[#25D366] border border-[#25D366]/30 rounded-full py-3 px-6 hover:bg-[#25D366]/5 transition"
              >
                <Icon name="whatsapp" size={20} />
                تواصل ف الواتساب
              </a>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <Link
                href="/collections"
                className="btn-primary flex-1 text-center"
                onClick={() => clearOrderConfirmation()}
              >
                <Icon name="spark" size={18} />
                شوف منتجات أخرى
              </Link>
              <Link href="/" className="btn-outline flex-1 text-center">
                الرئيسية
              </Link>
            </div>
          </div>
        </section>
      </main>

      <TrustBadgesStrip items={SHARED_GUARANTEES} />
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
