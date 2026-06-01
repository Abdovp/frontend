const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export type TrackingEventName =
  | 'PageView'
  | 'ViewContent'
  | 'AddToCart'
  | 'InitiateCheckout'
  | 'Purchase';

export async function logTrackingEvent(
  eventId: string,
  eventName: TrackingEventName,
  eventData?: Record<string, unknown>,
  orderId?: number
): Promise<void> {
  try {
    await fetch(`${API_URL}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_id: eventId,
        event_name: eventName,
        event_data: eventData ?? {},
        order_id: orderId ?? null,
      }),
      keepalive: true,
    });
  } catch {
    // Analytics must not block checkout UX.
  }
}
