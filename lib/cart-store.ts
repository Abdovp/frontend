import { create } from 'zustand';
import type { ProductId } from './products';

export interface CartItem {
  id: ProductId;
  lineKey: string;
  name: string;
  price: number;
  offer: 1 | 2 | 3;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  selectedOffers: Partial<Record<ProductId, 1 | 2 | 3>>;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  setSelectedOffer: (productId: ProductId, offer: 1 | 2 | 3) => void;
  addItem: (item: Omit<CartItem, 'lineKey'>) => void;
  removeItem: (lineKey: string) => void;
  updateQuantity: (lineKey: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  selectedOffers: {},
  isOpen: false,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  setSelectedOffer: (productId, offer) =>
    set({ selectedOffers: { ...get().selectedOffers, [productId]: offer } }),

  addItem: (item) => {
    const lineKey = `${item.id}-${item.offer}`;
    const { items } = get();
    const existing = items.find((i) => i.lineKey === lineKey);
    if (existing) {
      set({
        items: items.map((i) =>
          i.lineKey === lineKey ? { ...i, quantity: i.quantity + item.quantity } : i
        ),
      });
    } else {
      set({ items: [...items, { ...item, lineKey }] });
    }
  },

  removeItem: (lineKey) => set({ items: get().items.filter((i) => i.lineKey !== lineKey) }),

  updateQuantity: (lineKey, quantity) => {
    if (quantity <= 0) {
      get().removeItem(lineKey);
    } else {
      set({
        items: get().items.map((i) => (i.lineKey === lineKey ? { ...i, quantity } : i)),
      });
    }
  },

  clearCart: () => set({ items: [] }),

  getTotalPrice: () =>
    get().items.reduce((total, item) => total + item.price * item.quantity, 0),
}));
