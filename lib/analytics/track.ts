import { createEventId } from './event-id';
import { logTrackingEvent } from '../api/events';
import {
  buildFacebookParams,
  buildSnapchatParams,
  buildTikTokParams,
  SNAPCHAT_EVENT_NAMES,
  type StandardEventName,
} from './pixel-events';
import { getFacebookCookies, PIXEL_IDS, pixelsAreReady } from './pixels';
import type { AnalyticsItem, PurchasePayload } from './types';

export function whenPixelsReady(run: () => void) {
  if (typeof window === 'undefined') return;

  const runSafely = () => {
    try {
      run();
    } catch {
      // Analytics must not block checkout UX.
    }
  };

  const fire = () => {
    if (PIXEL_IDS.tiktok && window.ttq?.ready) {
      window.ttq.ready(runSafely);
      return;
    }
    runSafely();
  };

  const waitUntilReady = (attempt = 0) => {
    if (pixelsAreReady() || attempt >= 30) {
      fire();
      return;
    }
    window.setTimeout(() => waitUntilReady(attempt + 1), 100);
  };

  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(() => waitUntilReady(), { timeout: 3500 });
    return;
  }

  window.setTimeout(() => waitUntilReady(), 1200);
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
  window.ttq.track(eventName, params, { event_id: eventId });
}

function trackSnapchat(eventName: StandardEventName, params: Record<string, unknown>, eventId: string) {
  if (!PIXEL_IDS.snapchat || !window.snaptr) return;
  window.snaptr('track', SNAPCHAT_EVENT_NAMES[eventName], {
    ...params,
    client_dedup_id: eventId,
  });
}

function trackAll(
  eventName: StandardEventName,
  facebookParams: Record<string, unknown>,
  tiktokParams: Record<string, unknown>,
  snapParams: Record<string, unknown>,
  eventId: string,
  orderId?: number
) {
  void logTrackingEvent(eventId, eventName, facebookParams, orderId);
  whenPixelsReady(() => {
    trackFacebook(eventName, facebookParams, eventId);
    trackTikTok(eventName, tiktokParams, eventId);
    trackSnapchat(eventName, snapParams, eventId);
  });
}

export function trackPageView(path?: string) {
  const eventId = createEventId('pv');
  const params = {
    page_path: path || (typeof window !== 'undefined' ? window.location.pathname : '/'),
  };
  trackAll('PageView', params, params, buildSnapchatParams('PageView', [], 0, eventId), eventId);
}

export function trackViewContent(item: AnalyticsItem) {
  const eventId = createEventId('vc');
  trackAll(
    'ViewContent',
    buildFacebookParams([item], item.price, { content_name: item.name }),
    buildTikTokParams([item], item.price),
    buildSnapchatParams('ViewContent', [item], item.price, eventId),
    eventId
  );
}

export function trackAddToCart(item: AnalyticsItem) {
  const eventId = createEventId('atc');
  trackAll(
    'AddToCart',
    buildFacebookParams([item], item.price, { content_name: item.name }),
    buildTikTokParams([item], item.price),
    buildSnapchatParams('AddToCart', [item], item.price, eventId),
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
    buildSnapchatParams('InitiateCheckout', items, value, eventId, extra),
    eventId
  );
}

export function trackPurchase(payload: PurchasePayload) {
  const extra = {
    num_items: payload.items.reduce((sum, item) => sum + (item.quantity ?? 1), 0),
  };
  const facebookParams = buildFacebookParams(payload.items, payload.value, extra);
  const tiktokParams = buildTikTokParams(payload.items, payload.value, extra);
  const snapParams = buildSnapchatParams('Purchase', payload.items, payload.value, payload.eventId, extra);

  // Purchase is stored by POST /api/orders (order + order_items + tracking_events + CAPI).
  whenPixelsReady(() => {
    trackFacebook('Purchase', facebookParams, payload.eventId);
    trackTikTok('Purchase', tiktokParams, payload.eventId);
    trackSnapchat('Purchase', snapParams, payload.eventId);
  });
}

export { getFacebookCookies, createEventId };
