export type FunnelStep = {
  event_name: string;
  label: string;
  count: number;
  rate_from_previous: number | null;
};

export type DailyMetric = {
  date: string;
  page_views: number;
  orders: number;
  revenue: number;
};

export type ProductMetric = {
  product_id: string;
  product_name: string;
  orders: number;
  quantity: number;
  revenue: number;
};

export type AdminMetrics = {
  from_date: string;
  to_date: string;
  morocco_only: boolean;
  page_views: number;
  view_content: number;
  add_to_cart: number;
  initiate_checkout: number;
  orders: number;
  revenue: number;
  average_order_value: number;
  conversion_rate: number;
  checkout_conversion_rate: number;
  upsell_orders: number;
  upsell_rate: number;
  pending_orders: number;
  confirmed_orders: number;
  shipped_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  confirmation_rate: number;
  delivery_rate: number;
  funnel: FunnelStep[];
  daily: DailyMetric[];
  top_products: ProductMetric[];
};

export type AdminOrderItem = {
  product_id: string;
  product_name: string;
  offer: number;
  quantity: number;
  unit_price: number;
  line_total: number;
  is_upsell: boolean;
};

export type AdminOrderSummary = {
  id: number;
  public_order_id: string;
  event_id: string;
  customer_name: string;
  phone: string;
  total: number;
  status: string;
  client_ip: string | null;
  country_code: string | null;
  has_upsell: boolean;
  sheet_sent: boolean;
  created_at: string;
  item_count: number;
};

export type AdminOrderDetail = AdminOrderSummary & {
  admin_notes: string | null;
  updated_at: string | null;
  items: AdminOrderItem[];
  capi_platforms: string[];
};

export type AdminOrderList = {
  items: AdminOrderSummary[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'New',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  returned: 'Returned',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
  returned: 'bg-gray-100 text-gray-700',
};
