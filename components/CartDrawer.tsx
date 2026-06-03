import { createPurchaseEventId, submitOrder } from '../lib/api/orders';
import { getCheckoutErrorMessage } from '../lib/api/order-errors';
import { trackAddToCart, trackInitiateCheckout, trackPurchase } from '../lib/analytics/track';
import {
  validateCheckoutField,
  validateCheckoutForm,
  type CheckoutField,
  type CheckoutFormData,
} from '../lib/checkout-validation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/router';
import { useCartStore } from '../lib/cart-store';
import { saveOrderConfirmation } from '../lib/order-confirmation';
import { products, CURRENCY, WARRANTY_DAYS, type Product, type ProductId } from '../lib/products';
import FormField from './ui/FormField';
import Icon, { Stars } from './ui/Icon';

function getCrossSellProduct(cartIds: ProductId[]): Product | null {
  const hasPack = cartIds.includes('cooling-pack');
  const hasHolder = cartIds.includes('magnetic-holder');
  if (hasPack && !hasHolder) return products['magnetic-holder'];
  if (hasHolder && !hasPack) return products['cooling-pack'];
  return null;
}

function Thumb({ productId }: { productId: ProductId }) {
  return (
    <div className="cart-item-thumb">
      <Icon name={products[productId].icon} size={26} />
    </div>
  );
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, addItem, getTotalPrice } = useCartStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const crossSell = getCrossSellProduct(items.map((i) => i.id));
  const total = getTotalPrice();

  const handleAddCrossSell = () => {
    if (!crossSell) return;
    const offer = crossSell.offers[0];
    trackAddToCart({
      productId: crossSell.id,
      name: crossSell.nameAr,
      price: offer.price,
      quantity: 1,
    });
    addItem({
      id: crossSell.id,
      name: crossSell.nameAr,
      price: offer.price,
      offer: offer.quantity,
      quantity: 1,
    });
  };

  if (!isOpen && !isCheckoutOpen) return null;

  return (
    <>
      {isOpen && !isCheckoutOpen && (
        <>
          <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-[60]" onClick={closeCart} />

          <div className="fixed end-0 top-0 h-full w-full sm:w-[26rem] bg-white shadow-lift z-[70] flex flex-col animate-fade-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink/[0.07]">
          <h2 className="font-heading text-xl font-extrabold text-ink flex items-center gap-2">
            <Icon name="cart" size={22} className="text-brand" />
            سلة التسوق
          </h2>
          <button onClick={closeCart} className="icon-btn" aria-label="إغلاق السلة">
            <Icon name="close" size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <span className="mx-auto mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-cream text-ink/30">
                <Icon name="cart" size={30} />
              </span>
              <p className="text-ink/55">سلتك خاوية حالياً</p>
              <button onClick={closeCart} className="btn-ghost mt-3">
                واصل التسوّق
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 rounded-xl px-4 py-2.5 text-sm font-semibold mb-5">
                <Icon name="truck" size={16} />
                مبروك! حصلتي على التوصيل المجاني
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.lineKey} className="cart-item-card">
                    <Thumb productId={item.id} />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-ink leading-snug line-clamp-2">{item.name}</p>
                      <p className="text-sm text-ink/55 mt-0.5">
                        {item.offer} {item.offer === 1 ? 'وحدة' : 'وحدات'}
                      </p>
                    </div>
                    <div className="shrink-0 text-start">
                      <p className="font-heading font-extrabold text-ink leading-none">
                        {item.price} <span className="text-xs">{CURRENCY}</span>
                      </p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.lineKey)}
                        className="text-ink/40 hover:text-red-500 text-xs mt-2 font-medium transition"
                      >
                        إزالة
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {crossSell && (
                <div className="mt-6">
                  <p className="font-heading font-bold text-ink mb-3">منتوجات ستساعدك:</p>
                  <div className="cart-crosssell-card">
                    <Thumb productId={crossSell.id} />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-ink leading-snug line-clamp-1">{crossSell.nameAr}</p>
                      <p className="text-sm text-ink/55 mt-0.5 line-clamp-1">{crossSell.tagline}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Stars value={crossSell.rating} size={12} />
                        <span className="text-ink/45 text-xs">({crossSell.reviewCount})</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-start flex flex-col items-start gap-2">
                      <p className="text-sm font-extrabold text-ink whitespace-nowrap">
                        {crossSell.offers[0].price} {CURRENCY}
                      </p>
                      <button type="button" onClick={handleAddCrossSell} className="cart-crosssell-btn">
                        أضفه
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-ink/[0.07] px-5 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-ink/60">المجموع</span>
              <span className="font-heading text-2xl font-extrabold text-brand">
                {total} <span className="text-base">{CURRENCY}</span>
              </span>
            </div>
            <button
              onClick={() => {
                trackInitiateCheckout(
                  items.map((item) => ({
                    productId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                  })),
                  total
                );
                setIsCheckoutOpen(true);
              }}
              className="checkout-cta w-full"
            >
              <Icon name="lock" size={18} />
              إتمام الطلب
            </button>
            <div className="flex items-center justify-center gap-4 text-xs text-ink/50">
              <span className="inline-flex items-center gap-1">
                <Icon name="wallet" size={14} className="text-brand" /> دفع عند الاستلام
              </span>
              <span className="inline-flex items-center gap-1">
                <Icon name="refresh" size={14} className="text-brand" /> استرجاع {WARRANTY_DAYS} يوم
              </span>
            </div>
          </div>
        )}
      </div>
        </>
      )}

      {isCheckoutOpen && (
        <CheckoutModal onClose={() => setIsCheckoutOpen(false)} items={items} total={total} />
      )}
    </>
  );
}

interface CheckoutModalProps {
  onClose: () => void;
  items: ReturnType<typeof useCartStore.getState>['items'];
  total: number;
}

function CheckoutModal({ onClose, items, total }: CheckoutModalProps) {
  const router = useRouter();
  const { clearCart, closeCart } = useCartStore();
  const nameRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({ name: '', phone: '' });
  const [errors, setErrors] = useState<Partial<Record<CheckoutField, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<CheckoutField, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    nameRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, submitting]);

  const setField = useCallback((field: CheckoutField, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleBlur = (field: CheckoutField, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateCheckoutField(field, value);
    setErrors((prev) => {
      const next = { ...prev };
      if (error) next[field] = error;
      else delete next[field];
      return next;
    });
  };

  const showError = (field: CheckoutField) =>
    errors[field] && (touched[field] || submitting) ? errors[field] : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validateCheckoutForm(formData);
    setErrors(nextErrors);
    setTouched({ name: true, phone: true });

    if (Object.keys(nextErrors).length > 0) {
      const firstInvalid = (['name', 'phone'] as CheckoutField[]).find((f) => nextErrors[f]);
      if (firstInvalid) {
        document.getElementById(`checkout-${firstInvalid}`)?.focus();
      }
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    const eventId = createPurchaseEventId();

    try {
      const result = await submitOrder({
        eventId,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        items,
        total,
      });

      saveOrderConfirmation({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
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

      clearCart();
      closeCart();
      onClose();
      void router.push('/thank-you');
    } catch (error) {
      setSubmitError(getCheckoutErrorMessage(error));
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] overflow-y-auto">
      <div
        className="fixed inset-0 bg-ink/60 backdrop-blur-sm"
        onClick={submitting ? undefined : onClose}
        aria-hidden
      />
      <div className="relative flex min-h-[100dvh] items-center justify-center p-4 sm:min-h-full">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-title"
          className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-lift max-h-[90vh] overflow-y-auto animate-fade-up"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 id="checkout-title" className="font-heading text-2xl font-extrabold text-ink">
              إتمام الطلب
            </h2>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="icon-btn disabled:opacity-40"
              aria-label="إغلاق"
            >
              <Icon name="close" size={20} />
            </button>
          </div>

          <div className="bg-cream rounded-2xl p-4 mb-5">
            {items.map((item) => (
              <div key={item.lineKey} className="flex justify-between mb-2 text-sm gap-3">
                <span className="text-ink/70 min-w-0">
                  {item.name} ({item.offer} {item.offer === 1 ? 'وحدة' : 'وحدات'})
                </span>
                <span className="font-bold text-ink shrink-0">
                  {item.price * item.quantity} {CURRENCY}
                </span>
              </div>
            ))}
            <div className="border-t border-ink/10 pt-2 mt-2 flex justify-between font-extrabold">
              <span>المجموع</span>
              <span className="text-brand">{total} {CURRENCY}</span>
            </div>
            <p className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mt-2">
              <Icon name="wallet" size={14} />
              دفع عند الاستلام — ما كاينش دفع أونلاين
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <FormField
              ref={nameRef}
              id="checkout-name"
              label="الاسم الكامل"
              error={showError('name')}
              inputProps={{
                type: 'text',
                value: formData.name,
                onChange: (e) => setField('name', e.target.value),
                onBlur: (e) => handleBlur('name', e.target.value),
                placeholder: 'مثال: محمد العلوي',
                autoComplete: 'name',
                disabled: submitting,
              }}
            />
            <FormField
              id="checkout-phone"
              label="رقم الهاتف"
              error={showError('phone')}
              hint={!showError('phone') ? 'مثال: 0612345678 أو +212612345678' : undefined}
              inputProps={{
                type: 'tel',
                inputMode: 'tel',
                dir: 'ltr',
                value: formData.phone,
                onChange: (e) => setField('phone', e.target.value),
                onBlur: (e) => handleBlur('phone', e.target.value),
                placeholder: '06XXXXXXXX',
                autoComplete: 'tel',
                disabled: submitting,
              }}
            />
            {submitError && (
              <p className="text-red-600 text-sm font-semibold bg-red-50 border border-red-100 rounded-xl px-4 py-3" role="alert">
                {submitError}
              </p>
            )}
            <button type="submit" disabled={submitting} className="checkout-cta w-full disabled:opacity-50">
              <Icon name="check" size={20} />
              {submitting ? 'جاري التأكيد...' : 'تأكيد الطلب — دفع عند الاستلام'}
            </button>
          </form>

          <p className="flex items-center justify-center gap-2 text-xs text-ink/50 mt-4">
            <Icon name="shield" size={14} className="text-brand" />
            معلوماتك آمنة — كنستعملوها فقط لتأكيد الطلب
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
