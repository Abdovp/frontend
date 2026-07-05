import type { CartItem } from '../cart-store';
import { createEventId, getFacebookCookies } from '../analytics/track';
import { getTikTokCookies } from '../analytics/pixels';
import { getProductSku } from '../products';
import { OrderSubmitError, readOrderSubmitError } from './order-errors';

/** Hardcoded so static export on boyashop.store always hits the live API. */
const ORDERS_API_URL = 'https://api.boyashop.store/api/orders';

export interface SubmitOrderInput {
  eventId: string;
  name: string;
  phone: string;
  items: CartItem[];
  total: number;
}

export interface SubmitOrderResult {
  id: number;
  public_order_id: string;
  event_id: string;
  status: string;
  total: number;
  capi_sent: string[];
}

function normalizeOrderResult(data: unknown): SubmitOrderResult {
  if (!data || typeof data !== 'object') {
    throw new OrderSubmitError('الخدمة ردّت بشكل غير متوقع. جرّب مرة أخرى.', 502);
  }

  const order = data as Partial<SubmitOrderResult>;
  if (typeof order.id !== 'number') {
    throw new OrderSubmitError('الخدمة ردّت بشكل غير متوقع. جرّب مرة أخرى.', 502);
  }

  return {
    id: order.id,
    public_order_id: order.public_order_id ?? `boya${String(order.id).padStart(6, '0')}`,
    event_id: order.event_id ?? '',
    status: order.status ?? 'pending',
    total: typeof order.total === 'number' ? order.total : 0,
    capi_sent: Array.isArray(order.capi_sent) ? order.capi_sent : [],
  };
}

export async function submitOrder(input: SubmitOrderInput): Promise<SubmitOrderResult> {
  const { fbp, fbc } = getFacebookCookies();
  const { ttp, ttclid } = getTikTokCookies();

  let response: Response;
  try {
    response = await fetch(ORDERS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_id: input.eventId,
        customer_name: input.name,
        phone: input.phone,
        total: input.total,
        source_url: typeof window !== 'undefined' ? window.location.href : undefined,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        fbp,
        fbc,
        ttp,
        ttclid,
        items: input.items.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          sku: getProductSku(item.id),
          offer: item.offer,
          quantity: item.quantity,
          unit_price: item.price,
          is_upsell: item.lineKey.endsWith('-upsell'),
        })),
      }),
    });
  } catch {
    throw new OrderSubmitError(
      'ما قدرناش نوصلو للسيرفر. تأكّد من الاتصال بالإنترنت وجرب مرة أخرى.',
      0
    );
  }

  if (!response.ok) {
    throw await readOrderSubmitError(response);
  }

  try {
    return normalizeOrderResult(await response.json());
  } catch (error) {
    if (error instanceof OrderSubmitError) throw error;
    throw new OrderSubmitError('الخدمة ردّت بشكل غير متوقع. جرّب مرة أخرى.', response.status);
  }
}

export function createPurchaseEventId(): string {
  return createEventId('purchase');
}

export { OrderSubmitError } from './order-errors';

export interface FinalizeUpsellInput {
  product_id: string;
  product_name: string;
  unit_price: number;
  offer?: number;
  quantity?: number;
}

export interface FinalizeOrderInput {
  orderId: number;
  eventId: string;
  upsell?: FinalizeUpsellInput;
}

export async function finalizeOrder(input: FinalizeOrderInput): Promise<boolean> {
  const url = `${ORDERS_API_URL}/${input.orderId}/finalize`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_id: input.eventId,
        upsell: input.upsell
          ? {
              product_id: input.upsell.product_id,
              product_name: input.upsell.product_name,
              unit_price: input.upsell.unit_price,
              offer: input.upsell.offer ?? 1,
              quantity: input.upsell.quantity ?? 1,
            }
          : null,
      }),
    });
  } catch {
    return false;
  }

  return response.ok;
}
