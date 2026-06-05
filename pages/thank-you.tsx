import { useCallback, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UpsellPopup from '../components/UpsellPopup';
import TrustBadgesStrip from '../components/TrustBadgesStrip';
import Icon, { Stars } from '../components/ui/Icon';
import { finalizeOrder, type FinalizeUpsellInput } from '../lib/api/orders';
import { CURRENCY, SHARED_GUARANTEES, type Product, type ProductId } from '../lib/products';
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
  if (isUpsell) return 'عرض خاص — 99 درهم';
  if (offer === 1) return 'عرض 1 وحدة';
  return `عرض ${offer} وحدات`;
}

const steps = [
  {
    n: '1',
    icon: 'phone' as const,
    title: 'مكالمة التأكيد',
    desc: 'غادي يتصل بيك فريق بويا شوب — جاوب حتى لو الرقم مجهول.',
  },
  {
    n: '2',
    icon: 'check-circle' as const,
    title: 'تأكيد الطلب',
    desc: 'ثواني بس باش تأكد الطلب ومعلومات التوصيل.',
  },
  {
    n: '3',
    icon: 'truck' as const,
    title: 'التوصيل للباب',
    desc: 'الطرد يوصلك خلال 24–48 ساعة. تخلّص ملي يوصلك.',
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
    if (!product) { sendOrderToSheet(); return; }
    sendOrderToSheet({
      product_id: product.id,
      product_name: product.nameAr,
      unit_price: UPSELL_PRICE,
    });
  }, [sendOrderToSheet]);

  const firstName = order?.firstName ?? 'صديقنا';

  return (
    <>
      <Head>
        <title>شكراً — طلبك في الطريق | بويا شوب</title>
        <meta name="description" content="تم استقبال طلبك بنجاح. غادي نتصلو بيك ف 10 دقائق لتأكيد التوصيل." />
      </Head>
      <Header />

      <main className="bg-cream min-h-[70vh]">

        {/* ── HERO CONFIRMATION ── */}
        <section className="section-padding pb-10 md:pb-12">
          <div className="container-wide max-w-2xl mx-auto">

            {/* Big success card */}
            <div className="card-elevated p-6 sm:p-10 text-center">
              <div className="mx-auto mb-5 flex items-center justify-center w-24 h-24 rounded-full bg-emerald-50">
                <span className="text-5xl">🎉</span>
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-ink leading-tight text-balance mb-3">
                مبروك، {firstName}! طلبك مسجّل ✅
              </h1>
              <p className="text-ink/65 text-lg leading-relaxed max-w-lg mx-auto">
                حجزنا ليك آخر كمية متوفرة. ما كاين غير خطوة وحدة — <span className="font-bold text-ink">جاوب على التيليفون</span>.
              </p>
              {order?.publicOrderId ? (
                <div className="inline-flex items-center gap-2 mt-5 bg-brand/[0.06] rounded-full px-5 py-2">
                  <Icon name="badge" size={16} className="text-brand" />
                  <span className="font-heading font-bold text-brand text-sm" dir="ltr">{order.publicOrderId}</span>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {/* ── URGENT CALL BANNER ── */}
        <section className="pb-10 px-4">
          <div className="container-wide max-w-2xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-brand text-white px-6 py-7 shadow-lift">
              {/* subtle grid bg */}
              <div className="absolute inset-0 hero-grid-bg opacity-50" />
              <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
                {/* pulsing icon */}
                <span className="flex shrink-0 items-center justify-center w-14 h-14 rounded-2xl bg-accent/20 text-accent animate-[cta-pulse_2s_ease-in-out_infinite]">
                  <Icon name="phone" size={28} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-extrabold text-xl md:text-2xl leading-snug">
                    انتظر مكالمة التأكيد! 📞
                  </p>
                  <p className="mt-1.5 text-white/80 text-sm md:text-base leading-relaxed">
                    غادي يتصل بيك فريقنا{' '}
                    <span className="font-bold text-accent">ف 10 دقائق</span>{' '}
                    {order?.phone ? (
                      <>على <span dir="ltr" className="font-bold text-white">{order.phone}</span>{' '}</>
                    ) : null}
                    — <span className="font-bold">الرقم ممكن يبان مجهول</span>، جاوب عليه بلا تردد.
                  </p>
                </div>
              </div>

              {/* Hours info */}
              <div className="relative mt-5 grid sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3">
                  <Icon name="clock" size={18} className="text-accent shrink-0" />
                  <div className="leading-tight text-sm">
                    <p className="font-bold">ساعات الخدمة</p>
                    <p className="text-white/70">من 11 صباحاً حتى 8 مساءً</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3">
                  <Icon name="spark" size={18} className="text-accent shrink-0" />
                  <div className="leading-tight text-sm">
                    <p className="font-bold">طلبات الليل؟</p>
                    <p className="text-white/70">نتصلو بيك الصباح بكري</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHAT HAPPENS NEXT ── */}
        <section className="pb-10 px-4">
          <div className="container-wide max-w-2xl mx-auto">
            <div className="card-elevated p-6 sm:p-8">
              <h2 className="font-heading font-extrabold text-xl text-ink text-center mb-6">
                شنو كيجري بعد ما تطلب؟
              </h2>
              <div className="space-y-4">
                {steps.map((s, i) => (
                  <div key={s.n} className="flex items-start gap-4">
                    <div className="relative flex shrink-0 flex-col items-center">
                      <span className="flex items-center justify-center w-11 h-11 rounded-full bg-brand text-white font-heading font-extrabold text-base shadow-brand">
                        {s.n}
                      </span>
                      {i < steps.length - 1 && (
                        <span className="mt-1 w-0.5 h-8 bg-ink/10" />
                      )}
                    </div>
                    <div className="pt-1.5 min-w-0">
                      <p className="font-heading font-bold text-ink">{s.title}</p>
                      <p className="text-sm text-ink/60 mt-0.5 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pro tip */}
              <div className="mt-6 flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3.5">
                <Icon name="flame" size={20} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-900 font-semibold leading-relaxed">
                  <span className="font-extrabold">نصيحة:</span> الزبناء اللي كيجاوبو على المكالمة كيستلمو طلباتهم أسرع بيوم كامل. خلي التيليفون حداك!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── ORDER SUMMARY ── */}
        {ready && order && (
          <section className="pb-10 px-4">
            <div className="container-wide max-w-2xl mx-auto">
              <div className="card-elevated overflow-hidden">
                {/* Header */}
                <div className="bg-brand text-white px-6 py-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Icon name="cart" size={20} className="text-accent" />
                    <h2 className="font-heading font-extrabold text-lg">تفاصيل طلبيتك</h2>
                  </div>
                  {order.publicOrderId && (
                    <span className="text-xs sm:text-sm font-bold bg-white/15 rounded-full px-3 py-1 shrink-0" dir="ltr">
                      {order.publicOrderId}
                    </span>
                  )}
                </div>

                {/* Items */}
                <div className="px-6 py-5 space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={`${item.name}-${item.offer}-${index}`}
                      className="flex items-start justify-between gap-4"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="mt-1 flex shrink-0 items-center justify-center w-8 h-8 rounded-xl bg-brand/[0.07] text-brand">
                          <Icon name="check" size={15} />
                        </span>
                        <div className="min-w-0">
                          <p className="font-bold text-ink leading-snug text-sm md:text-base">{item.name}</p>
                          <p className="text-ink/50 text-xs mt-0.5">{offerLabel(item.offer, item.isUpsell)}</p>
                        </div>
                      </div>
                      <p className="font-heading font-extrabold text-ink shrink-0 whitespace-nowrap text-base md:text-lg">
                        {item.price * item.quantity}{' '}
                        <span className="text-sm font-semibold text-ink/55">{CURRENCY}</span>
                      </p>
                    </div>
                  ))}

                  {/* Divider + total */}
                  <div className="border-t border-ink/[0.08] pt-4 flex items-center justify-between">
                    <div>
                      <span className="font-heading font-bold text-ink text-base">المجموع</span>
                      <p className="text-xs text-ink/45 mt-0.5">شامل التوصيل</p>
                    </div>
                    <span className="font-heading text-3xl font-extrabold text-brand leading-none">
                      {order.total}{' '}
                      <span className="text-base font-semibold text-ink/55">{CURRENCY}</span>
                    </span>
                  </div>

                  {/* COD badge row */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-full px-3 py-1.5">
                      <Icon name="wallet" size={15} />
                      الدفع عند الاستلام
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand bg-brand/[0.06] rounded-full px-3 py-1.5">
                      <Icon name="truck" size={15} />
                      توصيل 24–48 ساعة
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/60 bg-ink/[0.04] rounded-full px-3 py-1.5">
                      <Icon name="refresh" size={15} />
                      ضمان 30 يوم
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {ready && !order && (
          <section className="pb-10 px-4">
            <div className="container-wide max-w-2xl mx-auto">
              <div className="card-elevated px-6 py-5 text-sm text-ink/60 text-center">
                ما لقيناش تفاصيل الطلب ف هاد الجلسة. إلا كملتي الطلب، غادي يتصل بيك فريقنا قريباً.
              </div>
            </div>
          </section>
        )}

        {/* ── EXCITEMENT / SOCIAL PROOF ── */}
        <section className="pb-10 px-4">
          <div className="container-wide max-w-2xl mx-auto">
            <div className="card-elevated p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-accent/15 text-accent">
                  <Icon name="flame" size={20} />
                </span>
                <h2 className="font-heading font-extrabold text-lg text-ink">
                  واش دارو الزبناء الآخرين؟
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'أيمن بنعلي', city: 'الدار البيضاء', text: 'جاوبت على المكالمة وف يومين وصلني الطرد. سرعة مجنونة! دفعت عند الاستلام وكل شيء تمام.', rating: 5 },
                  { name: 'سلمى الحسني', city: 'الرباط', text: 'كنت خايفة نطلب أونلاين، لكن لما تصلو بيا وأكدو الطلب تطمنت. مشكورين على الخدمة الراقية.', rating: 5 },
                  { name: 'كريم زيان', city: 'مراكش', text: 'المنتج فاق التوقعات! وجاوبت على المكالمة بسرعة وكان التوصيل في اليوم التالي.', rating: 5 },
                ].map((r) => (
                  <div key={r.name} className="flex gap-4 p-4 bg-cream rounded-2xl border border-ink/[0.05]">
                    <span className="flex shrink-0 items-center justify-center w-10 h-10 rounded-full bg-brand text-white font-heading font-bold text-sm">
                      {r.name.charAt(0)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div>
                          <span className="font-bold text-ink text-sm">{r.name}</span>
                          <span className="text-ink/45 text-xs mr-2">{r.city}</span>
                        </div>
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
          </div>
        </section>

        {/* ── CTA BUTTONS ── */}
        <section className="pb-14 px-4">
          <div className="container-wide max-w-2xl mx-auto space-y-3">
            <Link href="/collections" className="btn-primary w-full text-center" onClick={() => clearOrderConfirmation()}>
              <Icon name="spark" size={18} />
              تصفّح منتجات أخرى — هدية لطوموبيلك
            </Link>
            <Link href="/" className="btn-outline w-full text-center">
              العودة للرئيسية
            </Link>
          </div>
        </section>

      </main>

      {/* ── WHITE TRUST BADGES STRIP ── */}
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
