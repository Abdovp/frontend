import { apiUrl } from '../api/base-url';
import type { AdminMetrics, AdminOrderDetail, AdminOrderList, OrderStatus } from './types';

class AdminApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const ADMIN_FETCH_TIMEOUT_MS = 15_000;

async function adminFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), ADMIN_FETCH_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(apiUrl(path), { ...init, headers, signal: controller.signal });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new AdminApiError(
        'API request timed out. Check that the backend is running and reachable.',
        0
      );
    }
    throw new AdminApiError(
      'Could not reach the API. If you are developing locally, start the backend or check Easypanel.',
      0
    );
  } finally {
    window.clearTimeout(timeoutId);
  }

  if (!response.ok) {
    let detail = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (typeof body?.detail === 'string' && body.detail.trim()) {
        detail = body.detail;
      }
    } catch {
      try {
        const text = (await response.text()).trim();
        if (text) {
          detail = text.length > 140 ? `${text.slice(0, 137)}...` : text;
        }
      } catch {
        // ignore
      }
    }

    if (response.status >= 500 && detail === `Request failed (${response.status})`) {
      detail = `Backend unavailable (${response.status}). Check API server.`;
    }
    throw new AdminApiError(detail, response.status);
  }
  return response.json() as Promise<T>;
}

export async function fetchAdminMetrics(fromDate: string, toDate: string) {
  const params = new URLSearchParams({ from: fromDate, to: toDate, morocco_only: 'true' });
  try {
    return await adminFetch<AdminMetrics>(`/api/admin/metrics?${params}`);
  } catch (err) {
    if (err instanceof AdminApiError && err.status >= 500) {
      return {
        from_date: fromDate,
        to_date: toDate,
        morocco_only: true,
        page_views: 0,
        view_content: 0,
        add_to_cart: 0,
        initiate_checkout: 0,
        orders: 0,
        revenue: 0,
        average_order_value: 0,
        conversion_rate: 0,
        checkout_conversion_rate: 0,
        upsell_orders: 0,
        upsell_rate: 0,
        pending_orders: 0,
        confirmed_orders: 0,
        shipped_orders: 0,
        delivered_orders: 0,
        cancelled_orders: 0,
        confirmation_rate: 0,
        delivery_rate: 0,
        cancellation_rate: 0,
        funnel: [],
        daily: [],
        top_products: [],
      };
    }
    throw err;
  }
}

type OrderListParams = {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  from?: string;
  to?: string;
};

export async function fetchAdminOrders(params: OrderListParams = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.status) query.set('status', params.status);
  if (params.search) query.set('search', params.search);
  if (params.from) query.set('from', params.from);
  if (params.to) query.set('to', params.to);
  try {
    return await adminFetch<AdminOrderList>(`/api/admin/orders?${query}`);
  } catch (err) {
    if (err instanceof AdminApiError && err.status >= 500) {
      return {
        items: [],
        total: 0,
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        pages: 1,
      };
    }
    throw err;
  }
}

export async function fetchAdminOrder(orderId: number) {
  return adminFetch<AdminOrderDetail>(`/api/admin/orders/${orderId}`);
}

export async function updateAdminOrder(
  orderId: number,
  payload: { status?: OrderStatus; admin_notes?: string }
) {
  return adminFetch<AdminOrderDetail>(`/api/admin/orders/${orderId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export { AdminApiError };
