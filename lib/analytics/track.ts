import { createEventId } from './event-id';
import { logTrackingEvent } from '../api/events';
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

function whenPixelsReady(run: () => void) {
  if (typeof window === 'undefined') return;

  const runSafely = () => {
    try {
      run();
    } catch {
      // Analytics must not block checkout UX.
    }
  };

  if (PIXEL_IDS.tiktok && window.ttq?.ready) {
    window.ttq.ready(runSafely);
    return;
  }

  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(runSafely, { timeout: 2000 });
    return;
  }

  setTimeout(runSafely, 500);
}

function mapFacebookContents(items: AnalyticsItem[]) {
  return items.map((item) => ({
    id: item.productId,
    quantity: item.quantity ?? 1,
    item_price: item.price,
  }));
}

function mapTikTokContents(items: AnalyticsItem[]) {
  return items.map((item) => ({
    content_id: item.productId,
    content_type: 'product',
    content_name: item.name,
    quantity: item.quantity ?? 1,
    price: item.price,
  }));
}

function trackFacebook(eventName: string, params: Record<string, unknown>, eventId: string) {
  if (!PIXEL_IDS.facebook || !window.fbq) return;
  window.fbq('track', eventName, params, { eventID: eventId });
}

function trackTikTok(eventName: string, params: Record<string, unknown>, eventId: string) {
  if (!PIXEL_IDS.tiktok || !window.ttq) return;
  if (eventName === 'PageView') {
    window.ttq.page({}, { event_id: eventId });
    return;
  }
  const tiktokEvent = eventName === 'Purchase' ? 'CompletePayment' : eventName;
  window.ttq.track(tiktokEvent, params, { event_id: eventId });
}

function trackSnapchat(eventName: string, params: Record<string, unknown>, eventId: string) {
  if (!PIXEL_IDS.snapchat || !window.snaptr) return;
  window.snaptr('track', eventName, { ...params, uuid_c1: eventId });
}

function buildFacebookParams(
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

function buildTikTokParams(
  items: AnalyticsItem[],
  value: number,
  extra: Record<string, unknown> = {}
) {
  return {
    content_ids: items.map((item) => item.productId),
    content_type: 'product',
    currency: CURRENCY,
    value,
    contents: mapTikTokContents(items),
    ...extra,
  };
}

function trackAll(
  eventName: 'PageView' | 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase',
  facebookParams: Record<string, unknown>,
  tiktokParams: Record<string, unknown>,
  eventId: string,
  orderId?: number
) {
  void logTrackingEvent(eventId, eventName, facebookParams, orderId);
  whenPixelsReady(() => {
    trackFacebook(eventName, facebookParams, eventId);
    trackTikTok(eventName, tiktokParams, eventId);
    trackSnapchat(eventName, facebookParams, eventId);
  });
}

export function trackPageView(path?: string) {
  const eventId = createEventId('pv');
  const params = { page_path: path || (typeof window !== 'undefined' ? window.location.pathname : '/') };
  trackAll('PageView', params, params, eventId);
}

export function trackViewContent(item: AnalyticsItem) {
  const eventId = createEventId('vc');
  trackAll(
    'ViewContent',
    buildFacebookParams([item], item.price, { content_name: item.name }),
    buildTikTokParams([item], item.price),
    eventId
  );
}

export function trackAddToCart(item: AnalyticsItem) {
  const eventId = createEventId('atc');
  trackAll(
    'AddToCart',
    buildFacebookParams([item], item.price, { content_name: item.name }),
    buildTikTokParams([item], item.price),
    eventId
  );
}

export function trackInitiateCheckout(items: AnalyticsItem[], value: number) {
  const eventId = createEventId('ic');
  const extra = {
    num_items: items.reduce((sum, item) => sum + (item.quantity ?? 1), 0),
  };
  trackAll(
    'InitiateCheckout',
    buildFacebookParams(items, value, extra),
    buildTikTokParams(items, value, extra),
    eventId
  );
}

export function trackPurchase(payload: PurchasePayload) {
  const extra = {
    num_items: payload.items.reduce((sum, item) => sum + (item.quantity ?? 1), 0),
  };
  const facebookParams = buildFacebookParams(payload.items, payload.value, extra);
  const tiktokParams = buildTikTokParams(payload.items, payload.value, extra);

  // Purchase is stored by POST /api/orders (order + order_items + tracking_events + CAPI).
  whenPixelsReady(() => {
    trackFacebook('Purchase', facebookParams, payload.eventId);
    trackTikTok('Purchase', tiktokParams, payload.eventId);
    trackSnapchat('Purchase', facebookParams, payload.eventId);
  });
}

export { getFacebookCookies, createEventId };
