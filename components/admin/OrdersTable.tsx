import type { AdminOrderSummary } from '../../lib/admin/types';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../../lib/admin/types';
import { formatDateTime, formatMad } from '../../lib/admin/format';

const PLATFORM_STYLES: Record<string, string> = {
  meta: 'bg-blue-100 text-blue-800',
  tiktok: 'bg-slate-900 text-white',
  snap: 'bg-yellow-200 text-yellow-900',
};

const PLATFORM_LABELS: Record<string, string> = {
  meta: 'Meta',
  tiktok: 'TikTok',
  snap: 'Snap',
};

type Props = {
  orders: AdminOrderSummary[];
  onSelect: (orderId: number) => void;
};

export default function OrdersTable({ orders, onSelect }: Props) {
  if (orders.length === 0) {
    return (
      <div className="admin-panel text-center">
        <p className="text-sm font-medium text-admin-muted">No orders in this date range</p>
      </div>
    );
  }

  return (
    <div className="admin-panel overflow-hidden !p-0">
      <div className="overflow-x-auto">
        <table className="admin-table min-w-full">
          <thead className="border-b border-admin-bg bg-admin-bg/40">
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Source</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th />
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-bg">
            {orders.map((order) => {
              const status = order.status as keyof typeof ORDER_STATUS_LABELS;
              return (
                <tr key={order.id} className="hover:bg-admin-bg/30">
                  <td>
                    <p className="font-semibold text-admin-accent">{order.public_order_id}</p>
                    <p className="text-xs text-admin-muted">{order.item_count} items</p>
                  </td>
                  <td className="font-medium text-slate-900">{order.customer_name}</td>
                  <td>
                    <a href={`tel:${order.phone}`} className="font-medium text-admin-accent hover:underline">
                      {order.phone}
                    </a>
                  </td>
                  <td>
                    {order.capi_platforms.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {order.capi_platforms.map((p) => (
                          <span
                            key={p}
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${PLATFORM_STYLES[p.toLowerCase()] ?? 'bg-admin-bg text-slate-700'}`}
                          >
                            {PLATFORM_LABELS[p.toLowerCase()] ?? p}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-admin-muted text-xs">—</span>
                    )}
                  </td>
                  <td className="font-semibold tabular-nums text-slate-900">{formatMad(order.total)}</td>
                  <td>
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${ORDER_STATUS_COLORS[status] || 'bg-admin-bg text-slate-700'}`}>
                      {ORDER_STATUS_LABELS[status] || order.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap text-admin-muted">{formatDateTime(order.created_at)}</td>
                  <td>
                    <button type="button" onClick={() => onSelect(order.id)} className="admin-btn-primary !px-3 !py-2 !text-xs">
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
