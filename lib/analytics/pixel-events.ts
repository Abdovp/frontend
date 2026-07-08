import type { AnalyticsItem } from './types';

export const CURRENCY = 'MAD';

export const SNAPCHAT_EVENT_NAMES = {
  PageView: 'PAGE_VIEW',
  ViewContent: 'VIEW_CONTENT',
  AddToCart: 'ADD_CART',
  InitiateCheckout: 'START_CHECKOUT',
  Purchase: 'PURCHASE',
} as const;

export type StandardEventName = keyof typeof SNAPCHAT_EVENT_NAMES;

export function mapFacebookContents(items: AnalyticsItem[]) {
  return items.map((item) => ({
    id: item.productId,
    quantity: item.quantity ?? 1,
    item_price: item.price,
  }));
}

export function mapTikTokContents(items: AnalyticsItem[]) {
  return items.map((item) => ({
    content_id: item.productId,
    content_type: 'product',
    content_name: item.name,
    quantity: item.quantity ?? 1,
    price: item.price,
  }));
}

export function buildFacebookParams(
  items: AnalyticsItem[],
  value: number,
  extra: Record<string, unknown> = {}
) {
  return {
    content_ids: items.map((item) => item.productId),
    content_type: 'product',
    currency: CURRENCY,
    value,
    contents: mapFacebookContents(items),
    ...extra,
  };
}

export function buildTikTokParams(
  items: AnalyticsItem[],
  value: number,
  extra: Record<string, unknown> = {}
) {
  const contentIds = items.map((item) => item.productId).filter(Boolean);

  return {
    ...(contentIds.length === 1 ? { content_id: contentIds[0] } : {}),
    content_ids: contentIds,
    content_type: 'product',
    currency: CURRENCY,
    value,
    contents: mapTikTokContents(items),
    ...extra,
  };
}

export function buildSnapchatParams(
  eventName: StandardEventName,
  items: AnalyticsItem[],
  value: number,
  eventId: string,
  extra: Record<string, unknown> = {}
) {
  const params: Record<string, unknown> = {
    currency: CURRENCY,
    client_dedup_id: eventId,
    ...extra,
  };

  if (items.length > 0) {
    params.item_ids = items.map((item) => item.productId);
    params.number_items = items.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
  }

  if (value > 0) {
    params.price = String(value);
  }

  if (eventName === 'Purchase') {
    params.transaction_id = eventId;
  }

  return params;
}
