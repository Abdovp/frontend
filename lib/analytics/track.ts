import { createEventId } from './event-id';
import { getFacebookCookies, PIXEL_IDS } from './pixels';

type AnalyticsItem = {
  productId: string;
  name: string;
  price: number;
  quantity?: number;
};

type PurchasePayload = {
  eventId: string;
  value: number;
  items: AnalyticsItem[];
};

const CURRENCY = 'MAD';

function whenReady(run: () => void) {
  if (typeof window === 'undefined') return;
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(() => run(), { timeout: 2500 });
    return;
  }
  setTimeout(run, 1500);
}

function mapContents(items: AnalyticsItem[]) {
  return items.map((item) => ({
    id: item.productId,
    quantity: item.quantity ?? 1,
    item_price: item.price,
  }));
}

function trackFacebook(eventName: string, params: Record<string, unknown>, eventId: string) {
  if (!PIXEL_IDS.facebook || !window.fbq) return;
  window.fbq('track', eventName, params, { eventID: eventId });
}

function trackTikTok(eventName: string, params: Record<string, unknown>, eventId: string) {
  if (!PIXEL_IDS.tiktok || !window.ttq) return;
  window.ttq.track(eventName, params, { event_id: eventId });
}

function trackSnapchat(eventName: string, params: Record<string, unknown>, eventId: string) {
  if (!PIXEL_IDS.snapchat || !window.snaptr) return;
  window.snaptr('track', eventName, { ...params, uuid_c1: eventId });
}

function trackAll(eventName: string, params: Record<string, unknown>, eventId: string) {
  whenReady(() => {
    trackFacebook(eventName, params, eventId);
    trackTikTok(eventName, params, eventId);
    trackSnapchat(eventName, params, eventId);
  });
}

export function trackPageView(path?: string) {
  const eventId = createEventId('pv');
  const params = { page_path: path || (typeof window !== 'undefined' ? window.location.pathname : '/') };
  trackAll('PageView', params, eventId);
}

export function trackViewContent(item: AnalyticsItem) {
  const eventId = createEventId('vc');
  const params = {
    content_ids: [item.productId],
    content_name: item.name,
    content_type: 'product',
    currency: CURRENCY,
    value: item.price,
    contents: mapContents([item]),
  };
  trackAll('ViewContent', params, eventId);
}

export function trackAddToCart(item: AnalyticsItem) {
  const eventId = createEventId('atc');
  const params = {
    content_ids: [item.productId],
    content_name: item.name,
    content_type: 'product',
    currency: CURRENCY,
    value: item.price,
    contents: mapContents([item]),
  };
  trackAll('AddToCart', params, eventId);
}

export function trackInitiateCheckout(items: AnalyticsItem[], value: number) {
  const eventId = createEventId('ic');
  const params = {
    content_ids: items.map((item) => item.productId),
    content_type: 'product',
    currency: CURRENCY,
    value,
    num_items: items.reduce((sum, item) => sum + (item.quantity ?? 1), 0),
    contents: mapContents(items),
  };
  trackAll('InitiateCheckout', params, eventId);
}

export function trackPurchase(payload: PurchasePayload) {
  const params = {
    content_ids: payload.items.map((item) => item.productId),
    content_type: 'product',
    currency: CURRENCY,
    value: payload.value,
    num_items: payload.items.reduce((sum, item) => sum + (item.quantity ?? 1), 0),
    contents: mapContents(payload.items),
  };
  trackAll('Purchase', params, payload.eventId);
}

export { getFacebookCookies, createEventId };
