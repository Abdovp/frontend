import type { FinalizeUpsellInput } from './api/orders';
import type { CartItem } from './cart-store';
import type { ProductId } from './products';

export const ORDER_CONFIRMATION_KEY = 'boya_order_confirmation';

export interface OrderConfirmation {
  firstName: string;
  fullName: string;
  phone: string;
  orderedAt: string;
  publicOrderId?: string;
  eventId?: string;
  orderId?: number;
  purchaseTracked?: boolean;
  items: Array<{
    productId?: ProductId;
    name: string;
    offer: number;
    price: number;
    quantity: number;
    isUpsell?: boolean;
  }>;
  total: number;
  /** Customer tapped "البيانات صحيحة" on thank-you page */
  detailsConfirmed?: boolean;
}

export function saveOrderConfirmation(data: {
  name: string;
  phone: string;
  items: CartItem[];
  total: number;
  eventId?: string;
  orderId?: number;
  publicOrderId?: string;
  upsellItem?: {
    productId: ProductId;
    name: string;
    price: number;
  };
}): void {
  if (typeof window === 'undefined') return;

  const payload: OrderConfirmation = {
    firstName: data.name.trim().split(/\s+/)[0] || data.name.trim(),
    fullName: data.name.trim(),
    phone: data.phone.trim(),
    orderedAt: new Date().toISOString(),
    publicOrderId: data.publicOrderId,
    eventId: data.eventId,
    orderId: data.orderId,
    purchaseTracked: true,
    items: [
      ...data.items.map((item) => ({
        productId: item.id,
        name: item.name,
        offer: item.offer,
        price: item.price,
        quantity: item.quantity,
      })),
      ...(data.upsellItem
        ? [
            {
              productId: data.upsellItem.productId,
              name: data.upsellItem.name,
              offer: 1 as const,
              price: data.upsellItem.price,
              quantity: 1,
              isUpsell: true,
            },
          ]
        : []),
    ],
    total: data.total,
  };

  try {
    sessionStorage.setItem(ORDER_CONFIRMATION_KEY, JSON.stringify(payload));
  } catch {
    // Private browsing / storage limits must not block checkout.
  }
}

export function loadOrderConfirmation(): OrderConfirmation | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = sessionStorage.getItem(ORDER_CONFIRMATION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OrderConfirmation;
  } catch {
    return null;
  }
}

export function confirmOrderDetails(): OrderConfirmation | null {
  const order = loadOrderConfirmation();
  if (!order) return null;

  const updated: OrderConfirmation = { ...order, detailsConfirmed: true };
  try {
    sessionStorage.setItem(ORDER_CONFIRMATION_KEY, JSON.stringify(updated));
  } catch {
    return order;
  }
  return updated;
}

export function clearOrderConfirmation(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(ORDER_CONFIRMATION_KEY);
}

export function appendUpsellToOrder(
  productId: ProductId,
  name: string,
  price: number
): OrderConfirmation | null {
  const order = loadOrderConfirmation();
  if (!order) return null;

  const alreadyAdded = order.items.some((item) => item.productId === productId && item.isUpsell);
  if (alreadyAdded) return order;

  const updated: OrderConfirmation = {
    ...order,
    items: [
      ...order.items,
      {
        productId,
        name,
        offer: 1,
        price,
        quantity: 1,
        isUpsell: true,
      },
    ],
    total: order.total + price,
  };

  sessionStorage.setItem(ORDER_CONFIRMATION_KEY, JSON.stringify(updated));
  return updated;
}

export function getUpsellFromConfirmation(order: OrderConfirmation): FinalizeUpsellInput | undefined {
  const item = order.items.find((entry) => entry.isUpsell && entry.productId);
  if (!item?.productId) return undefined;

  return {
    product_id: item.productId,
    product_name: item.name,
    unit_price: item.price,
    offer: item.offer,
    quantity: item.quantity,
  };
}
