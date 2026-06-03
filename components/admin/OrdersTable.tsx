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
      <div className="admin-card p-12 text-center">
        <p className="text-sm font-medium text-slate-500">No orders in this date range</p>
      </div>
    );
  }

  return (
    <div className="admin-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="admin-table min-w-full">
          <thead className="border-b border-slate-100 bg-slate-50/80">
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => {
              const status = order.status as keyof typeof ORDER_STATUS_LABELS;
              return (
                <tr key={order.id} className="hover:bg-slate-50/60">
                  <td>
                    <p className="font-semibold text-brand">{order.public_order_id}</p>
                    <p className="text-xs text-slate-400">{order.item_count} items</p>
                  </td>
                  <td className="font-medium text-slate-900">{order.customer_name}</td>
                  <td>
                    <a href={`tel:${order.phone}`} className="font-medium text-brand hover:underline">
                      {order.phone}
                    </a>
                  </td>
                  <td className="font-semibold tabular-nums text-slate-900">{formatMad(order.total)}</td>
                  <td>
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${ORDER_STATUS_COLORS[status] || 'bg-slate-100 text-slate-700'}`}>
                      {ORDER_STATUS_LABELS[status] || order.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap text-slate-500">{formatDateTime(order.created_at)}</td>
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
