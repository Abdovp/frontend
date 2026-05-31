import { useCartStore } from '../lib/cart-store';
import Icon from './ui/Icon';

export default function CartButton() {
  const { items, openCart } = useCartStore();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <button onClick={openCart} className="icon-btn" aria-label={`السلة (${itemCount})`}>
      <Icon name="cart" size={23} />
      {itemCount > 0 && (
        <span className="absolute -top-0.5 -end-0.5 bg-accent text-ink text-[0.65rem] font-extrabold min-w-[1.15rem] h-[1.15rem] px-1 rounded-full flex items-center justify-center shadow-gold">
          {itemCount}
        </span>
      )}
    </button>
  );
}
