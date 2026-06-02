import type { CartItem } from './cart-store';

export const PENDING_CHECKOUT_KEY = 'boya_pending_checkout';

export interface PendingCheckout {
  eventId: string;
  name: string;
  address: string;
  phone: string;
  items: CartItem[];
  total: number;
}

export function savePendingCheckout(data: PendingCheckout): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify(data));
  } catch {
    // Private browsing / storage limits must not block checkout.
  }
}

export function loadPendingCheckout(): PendingCheckout | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = sessionStorage.getItem(PENDING_CHECKOUT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PendingCheckout;
  } catch {
    return null;
  }
}

export function clearPendingCheckout(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
}
