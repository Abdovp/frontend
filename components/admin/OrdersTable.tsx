import type { AdminOrderSummary } from '../../lib/admin/types';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../../lib/admin/types';
import { formatDateTime, formatMad } from '../../lib/admin/format';

type Props = {
  orders: AdminOrderSummary[];
  onSelect: (orderId: number) => void;
};

export default function OrdersTable({ orders, onSelect }: Props) {
  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
        No orders in this date range
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Order</th>
              <th className="px-4 py-3 text-left font-semibold">Customer</th>
              <th className="px-4 py-3 text-left font-semibold">Phone</th>
              <th className="px-4 py-3 text-left font-semibold">Total</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Date</th>
              <th className="px-4 py-3 text-left font-semibold" />
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const status = order.status as keyof typeof ORDER_STATUS_LABELS;
              return (
                <tr key={order.id} className="border-t border-slate-100 hover:bg-slate-50/80">
                  <td className="px-4 py-3">
                    <p className="font-bold text-brand">{order.public_order_id}</p>
                    <p className="text-xs text-slate-400">{order.item_count} items</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-ink">{order.customer_name}</td>
                  <td className="px-4 py-3">
                    <a href={`tel:${order.phone}`} className="font-semibold text-brand">
                      {order.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3 font-bold text-ink">{formatMad(order.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ORDER_STATUS_COLORS[status] || 'bg-slate-100 text-slate-700'}`}>
                      {ORDER_STATUS_LABELS[status] || order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDateTime(order.created_at)}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onSelect(order.id)}
                      className="rounded-lg bg-brand px-3 py-2 text-xs font-bold text-white hover:bg-brand-dark"
                    >
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
