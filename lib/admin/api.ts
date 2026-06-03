import { apiUrl } from '../api/base-url';
import { clearAdminSession, getAdminToken } from './auth';
import type { AdminMetrics, AdminOrderDetail, AdminOrderList, OrderStatus } from './types';

class AdminApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function adminFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAdminToken();
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(apiUrl(path), { ...init, headers });
  if (response.status === 401) {
    clearAdminSession();
    throw new AdminApiError('Session expired', 401);
  }
  if (!response.ok) {
    let detail = 'Request failed';
    try {
      const body = await response.json();
      detail = body.detail || detail;
    } catch {
      // ignore
    }
    throw new AdminApiError(detail, response.status);
  }
  return response.json() as Promise<T>;
}

export async function adminLogin(username: string, password: string) {
  return adminFetch<{ token: string; expires_at: string; username: string }>('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function fetchAdminMetrics(fromDate: string, toDate: string) {
  const params = new URLSearchParams({ from: fromDate, to: toDate, morocco_only: 'true' });
  return adminFetch<AdminMetrics>(`/api/admin/metrics?${params}`);
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
  return adminFetch<AdminOrderList>(`/api/admin/orders?${query}`);
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
