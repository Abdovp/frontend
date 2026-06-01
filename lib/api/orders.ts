import type { CartItem } from '../cart-store';
import { createEventId, getFacebookCookies } from '../analytics/track';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface SubmitOrderInput {
  eventId: string;
  name: string;
  address: string;
  phone: string;
  items: CartItem[];
  total: number;
}

export interface SubmitOrderResult {
  id: number;
  event_id: string;
  status: string;
  total: number;
  capi_sent: string[];
}

export async function submitOrder(input: SubmitOrderInput): Promise<SubmitOrderResult> {
  const { fbp, fbc } = getFacebookCookies();

  const response = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_id: input.eventId,
      customer_name: input.name,
      address: input.address,
      phone: input.phone,
      total: input.total,
      source_url: typeof window !== 'undefined' ? window.location.href : undefined,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      fbp,
      fbc,
      items: input.items.map((item) => ({
        product_id: item.id,
        product_name: item.name,
        offer: item.offer,
        quantity: item.quantity,
        unit_price: item.price,
        is_upsell: false,
      })),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || 'Order submission failed');
  }

  return response.json();
}

export function createPurchaseEventId(): string {
  return createEventId('purchase');
}
