import { useCallback, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';
import UpsellPopup from '../components/UpsellPopup';
import Icon from '../components/ui/Icon';
import { finalizeOrder, type FinalizeUpsellInput } from '../lib/api/orders';
import { getCallScheduleMessage } from '../lib/call-schedule';
import { STORE, type Product, type ProductId } from '../lib/products';
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

export default function ThankYou() {
  const [order, setOrder] = useState<OrderConfirmation | null>(null);
  const [upsellProduct, setUpsellProduct] = useState<Product | null>(null);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
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
  const callMessage = getCallScheduleMessage(orderedAt);

  const copyOrderId = async () => {
    if (!order?.publicOrderId) return;
    try {
      await navigator.clipboard.writeText(order.publicOrderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — ignore
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
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-600 text-white mb-5 shadow-soft">
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
                {copied ? (
                  <span className="text-emerald-600 text-xs font-bold">تم النسخ</span>
                ) : null}
              </button>
            ) : null}
          </div>

          {/* ── CALL CARD ── */}
          <div className="bg-white rounded-2xl border border-ink/[0.08] shadow-soft p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <span className="flex shrink-0 items-center justify-center w-12 h-12 rounded-full bg-emerald-600 text-white">
                <Icon name="phone" size={22} />
              </span>
              <p className="font-heading font-bold text-ink text-base sm:text-lg leading-relaxed pt-2">
                {callMessage}
              </p>
            </div>
            {order?.phone ? (
              <div className="mt-4 flex items-center gap-2.5 bg-cream rounded-xl px-4 py-3 text-sm">
                <Icon name="phone" size={16} className="text-ink/45 shrink-0" />
                <span className="text-ink/55">بنتصل على:</span>
                <span className="font-bold text-ink" dir="ltr">
                  {order.phone}
                </span>
              </div>
            ) : null}
          </div>

          {/* ── CUSTOMER DETAILS CARD ── */}
          {ready && order ? (
            <div className="bg-white rounded-2xl border border-ink/[0.08] shadow-soft p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-bold text-ink">بياناتك للمكالمة</h2>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                  <Icon name="check-circle" size={14} />
                  تم التأكيد
                </span>
              </div>
              <div className="space-y-2 text-sm">
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
              <div className="mt-4 flex items-center justify-center gap-2 bg-ink/[0.04] rounded-xl py-3 text-sm font-semibold text-ink/60">
                <Icon name="check" size={16} className="text-emerald-600" />
                تم – بانتظار مكالمتنا
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

          {/* ── HOME LINK ── */}
          <div className="pt-4 text-center">
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
