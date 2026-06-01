import { useEffect, useRef, useState } from 'react';
import Icon, { Stars } from './ui/Icon';
import { appendUpsellToOrder } from '../lib/order-confirmation';
import { CURRENCY, type Product } from '../lib/products';
import { UPSELL_DURATION_SEC, UPSELL_PRICE } from '../lib/upsell';

interface UpsellPopupProps {
  product: Product;
  onAdded: () => void;
  onClose: () => void;
}

export default function UpsellPopup({ product, onAdded, onClose }: UpsellPopupProps) {
  const [secondsLeft, setSecondsLeft] = useState(UPSELL_DURATION_SEC);
  const [added, setAdded] = useState(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (secondsLeft <= 0) {
      onCloseRef.current();
      return;
    }

    const timer = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  const progress = ((UPSELL_DURATION_SEC - secondsLeft) / UPSELL_DURATION_SEC) * 100;

  const handleAdd = () => {
    if (added) return;
    appendUpsellToOrder(product.id, product.nameAr, UPSELL_PRICE);
    setAdded(true);
    onAdded();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/55" onClick={onClose} aria-hidden />

      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-lift overflow-hidden animate-fade-up"
        role="dialog"
        aria-labelledby="upsell-title"
        aria-modal="true"
      >
        <div
          className="h-1 bg-brand/15"
          aria-hidden
        >
          <div
            className="h-full bg-accent transition-[width] duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-accent-dark font-bold text-sm mb-1">عرض لمرة وحدة — {secondsLeft} ث</p>
              <h2 id="upsell-title" className="font-heading text-xl font-extrabold text-ink leading-snug">
                قبل ما نسدّو الطلب…
              </h2>
            </div>
            <button type="button" onClick={onClose} className="icon-btn shrink-0" aria-label="إغلاق">
              <Icon name="close" size={20} />
            </button>
          </div>

          <div className="flex gap-4 rounded-2xl border border-ink/[0.08] bg-cream p-4 mb-5">
            <span className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-ink/[0.07] text-brand shrink-0 shadow-soft">
              <Icon name={product.icon} size={30} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-heading font-bold text-ink leading-snug">{product.nameAr}</p>
              <p className="text-sm text-ink/55 mt-1 line-clamp-2">{product.tagline}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <Stars value={product.rating} size={12} />
                <span className="text-xs text-ink/45">({product.reviewCount})</span>
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <p className="text-xs text-ink/45 line-through">{product.offers[0].price} {CURRENCY}</p>
              <p className="font-heading text-3xl font-extrabold text-brand leading-none">
                {UPSELL_PRICE} <span className="text-base font-semibold">{CURRENCY}</span>
              </p>
              <p className="text-xs text-emerald-700 font-bold mt-1">عرض خاص بعد الطلب</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 rounded-full px-3 py-1.5">
              <Icon name="flame" size={14} />
              آخر فرصة
            </span>
          </div>

          <button type="button" onClick={handleAdd} className="checkout-cta w-full mb-3">
            <Icon name="cart" size={18} />
            نعم، زيدها للطلب — {UPSELL_PRICE} {CURRENCY}
          </button>
          <button type="button" onClick={onClose} className="btn-ghost w-full text-sm">
            لا شكراً، كمل بلا هاد المنتج
          </button>

          <p className="flex items-center justify-center gap-2 text-xs text-ink/45 mt-4">
            <Icon name="wallet" size={14} className="text-brand" />
            نفس الطلب — دفع عند الاستلام
          </p>
        </div>
      </div>
    </div>
  );
}
