import { useCallback, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UpsellPopup from '../components/UpsellPopup';
import Icon from '../components/ui/Icon';
import { finalizeOrder, type FinalizeUpsellInput } from '../lib/api/orders';
import { CURRENCY, type Product, type ProductId } from '../lib/products';
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
      if (!upsell) {
        sendOrderToSheet();
      }
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

  return (
    <>
      <Head>
        <title>شكراً لك | بويا شوب</title>
        <meta name="description" content="تم استقبال طلبك بنجاح. شكراً لاختيارك بويا شوب." />
      </Head>
      <Header />
      <main className="bg-cream py-12 md:py-16 px-4 min-h-[70vh]">
        <div className="container-wide max-w-2xl mx-auto">
          <div className="card-elevated p-6 sm:p-9">
            <div className="text-center mb-8">
              <span className="mx-auto mb-5 flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 text-emerald-600">
                <Icon name="check-circle" size={42} />
              </span>
              <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-ink leading-tight text-balance">
                شكراً على ثقتك بنا، {firstName}
              </h1>
            </div>

            <div className="space-y-4 text-ink/75 text-base md:text-lg leading-relaxed">
              <p className="font-semibold text-ink">
                مبروك! حجزنا ليك آخر كمية متوفرة من المنتج.
              </p>
              <p>
                غادي نتصلو بيك ف <span className="font-bold text-brand">10 دقائق أو أقل</span>
                {order?.phone ? (
                  <>
                    {' '}
                    على الرقم{' '}
                    <span className="font-bold text-ink" dir="ltr">
                      {order.phone}
                    </span>
                  </>
                ) : null}{' '}
                باش نأكدو الطلب — خلي التيليفون حداك.
              </p>
              <p className="text-sm md:text-base text-ink/60 bg-cream rounded-2xl px-4 py-3 border border-ink/[0.06]">
                <Icon name="clock" size={16} className="inline-block text-brand ms-1 align-[-2px]" />{' '}
                إلا طلبتي ف الليل، غادي نتصلو بيك ف الصباح باكر ما أمكن.
              </p>
            </div>

            {ready && order && (
              <div className="mt-8 rounded-2xl border border-ink/[0.08] overflow-hidden">
                <div className="bg-brand text-white px-5 py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon name="cart" size={18} className="text-accent shrink-0" />
                    <h2 className="font-heading font-extrabold text-lg">طلبيتك</h2>
                  </div>
                  {order.publicOrderId ? (
                    <span className="text-xs sm:text-sm font-bold bg-white/15 rounded-full px-3 py-1 shrink-0" dir="ltr">
                      {order.publicOrderId}
                    </span>
                  ) : null}
                </div>
                <div className="bg-white px-5 py-4 space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={`${item.name}-${item.offer}-${index}`}
                      className="flex items-start justify-between gap-4 text-sm sm:text-base"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-ink leading-snug">{item.name}</p>
                        <p className="text-ink/50 text-sm mt-0.5">{offerLabel(item.offer, item.isUpsell)}</p>
                      </div>
                      <p className="font-heading font-extrabold text-ink shrink-0 whitespace-nowrap">
                        {item.price * item.quantity}{' '}
                        <span className="text-sm font-semibold text-ink/60">{CURRENCY}</span>
                      </p>
                    </div>
                  ))}
                  <div className="border-t border-ink/[0.08] pt-4 flex items-center justify-between">
                    <span className="font-heading font-bold text-ink">المجموع</span>
                    <span className="font-heading text-2xl font-extrabold text-brand">
                      {order.total}{' '}
                      <span className="text-base font-semibold">{CURRENCY}</span>
                    </span>
                  </div>
                  <p className="flex items-center gap-2 text-sm text-ink/55 pt-1">
                    <Icon name="wallet" size={15} className="text-brand shrink-0" />
                    الدفع عند الاستلام — بلا دفع مسبق
                  </p>
                </div>
              </div>
            )}

            {ready && !order && (
              <div className="mt-8 rounded-2xl bg-cream border border-ink/[0.06] px-5 py-4 text-sm text-ink/60 text-center">
                ما لقيناش تفاصيل الطلب ف هاد الجلسة. إلا كملتي الطلب، غادي يتصل بيك فريقنا قريباً.
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/" className="btn-primary flex-1 text-center">
                العودة للرئيسية
              </Link>
              <Link
                href="/collections"
                className="btn-outline flex-1 text-center"
                onClick={() => clearOrderConfirmation()}
              >
                تصفّح منتجات أخرى
              </Link>
            </div>
          </div>
        </div>
      </main>
      {upsellProduct && (
        <UpsellPopup
          product={upsellProduct}
          onAdded={handleUpsellAdded}
          onClose={handleCloseUpsell}
        />
      )}
      <Footer />
    </>
  );
}
