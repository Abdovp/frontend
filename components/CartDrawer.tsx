import { useState } from 'react';
import { useRouter } from 'next/router';
import { useCartStore } from '../lib/cart-store';
import { saveOrderConfirmation } from '../lib/order-confirmation';
import { products, CURRENCY, WARRANTY_DAYS, type Product, type ProductId } from '../lib/products';
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
    addItem({
      id: crossSell.id,
      name: crossSell.nameAr,
      price: offer.price,
      offer: offer.quantity,
      quantity: 1,
    });
  };

  if (!isOpen) return null;

  return (
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
            <button onClick={() => setIsCheckoutOpen(true)} className="checkout-cta w-full">
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
  const [formData, setFormData] = useState({ name: '', address: '', phone: '' });
  const [phoneError, setPhoneError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validatePhone = (phone: string) => /^(\+212|0)[67]\d{8}$/.test(phone.replace(/\s/g, ''));

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    setFormData({ ...formData, phone });
    setPhoneError(phone && !validatePhone(phone) ? 'دخّل رقم هاتف مغربي صحيح' : '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.phone) return;
    if (!validatePhone(formData.phone)) {
      setPhoneError('دخّل رقم هاتف مغربي صحيح');
      return;
    }

    setSubmitting(true);
    saveOrderConfirmation({
      name: formData.name,
      phone: formData.phone,
      items,
      total,
    });
    clearCart();
    closeCart();
    onClose();
    router.push('/thank-you');
  };

  return (
    <>
      <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-[80]" onClick={onClose} />
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-lift max-h-[92vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-2xl font-extrabold text-ink">إتمام الطلب</h2>
            <button onClick={onClose} className="icon-btn" aria-label="إغلاق">
              <Icon name="close" size={20} />
            </button>
          </div>

          <div className="bg-cream rounded-2xl p-4 mb-5">
            {items.map((item) => (
              <div key={item.lineKey} className="flex justify-between mb-2 text-sm">
                <span className="text-ink/70">{item.name} ({item.offer})</span>
                <span className="font-bold text-ink">{item.price * item.quantity} {CURRENCY}</span>
              </div>
            ))}
            <div className="border-t border-ink/10 pt-2 mt-2 flex justify-between font-extrabold">
              <span>المجموع</span>
              <span className="text-brand">{total} {CURRENCY}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="field-label">الاسم الكامل</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="field-input"
                placeholder="مثال: محمد العلوي"
                required
              />
            </div>
            <div>
              <label className="field-label">العنوان والمدينة</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="field-input"
                placeholder="الحي، الشارع، المدينة"
                required
              />
            </div>
            <div>
              <label className="field-label">رقم الهاتف</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="06XXXXXXXX"
                dir="ltr"
                className={`field-input-tel ${phoneError ? '!border-red-400 !ring-red-100' : ''}`}
                required
              />
              {phoneError && <p className="text-red-500 text-xs mt-1.5">{phoneError}</p>}
            </div>
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
    </>
  );
}
