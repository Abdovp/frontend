import { useEffect, useState } from 'react';
import { updateAdminOrder } from '../../lib/admin/api';
import { formatDateTime, formatMad } from '../../lib/admin/format';
import type { AdminOrderDetail, OrderStatus } from '../../lib/admin/types';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../../lib/admin/types';
import AdminIcon from './AdminIcon';

type Props = {
  order: AdminOrderDetail;
  onClose: () => void;
  onUpdated: (order: AdminOrderDetail) => void;
};

const statuses: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'];

export default function OrderPreview({ order, onClose, onUpdated }: Props) {
  const [status, setStatus] = useState<OrderStatus>(order.status as OrderStatus);
  const [notes, setNotes] = useState(order.admin_notes || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setStatus(order.status as OrderStatus);
    setNotes(order.admin_notes || '');
  }, [order]);

  async function save() {
    setSaving(true);
    setError('');
    try {
      const updated = await updateAdminOrder(order.id, { status, admin_notes: notes });
      onUpdated(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save changes');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} aria-label="Close" />
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-admin-bg px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-admin-muted">Order details</p>
            <h3 className="mt-1 text-2xl font-bold text-slate-900">{order.public_order_id}</h3>
            <p className="mt-1 text-sm text-admin-muted">{formatDateTime(order.created_at)}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-2xl p-2 text-admin-muted hover:bg-admin-bg hover:text-slate-600">
            <AdminIcon name="close" className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 px-6 py-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-admin-bg p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-admin-muted">Customer</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{order.customer_name}</p>
              <a href={`tel:${order.phone}`} className="mt-1 inline-block text-sm font-semibold text-admin-accent hover:underline">
                {order.phone}
              </a>
            </div>
            <div className="rounded-2xl bg-admin-bg p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-admin-muted">Total</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{formatMad(order.total)}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {order.has_upsell ? (
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">Upsell</span>
                ) : null}
                {order.sheet_sent ? (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Sheet sent</span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">Sheet pending</span>
                )}
                {order.country_code === 'MA' ? (
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">Morocco IP</span>
                ) : order.client_ip ? (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{order.client_ip}</span>
                ) : null}
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900">Line items</h4>
            <div className="overflow-hidden rounded-2xl bg-admin-bg">
              <table className="admin-table min-w-full">
                <thead className="bg-admin-bg/70">
                  <tr>
                    <th>Product</th>
                    <th>Offer</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white">
                  {order.items.map((item) => (
                    <tr key={`${item.product_id}-${item.offer}-${item.is_upsell}`}>
                      <td>
                        <p className="font-medium text-slate-900">{item.product_name}</p>
                        {item.is_upsell ? <span className="text-xs text-amber-600">Upsell</span> : null}
                      </td>
                      <td>{item.offer}</td>
                      <td>{item.quantity}</td>
                      <td className="font-semibold tabular-nums">{formatMad(item.line_total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {(order.capi_platforms ?? []).length > 0 ? (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">CAPI platforms</p>
              <div className="flex flex-wrap gap-2">
                {(order.capi_platforms ?? []).map((platform) => (
                  <span key={platform} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="order-status" className="admin-label">
                Status
              </label>
              <select
                id="order-status"
                value={status}
                onChange={(event) => setStatus(event.target.value as OrderStatus)}
                className="admin-input"
              >
                {statuses.map((value) => (
                  <option key={value} value={value}>
                    {ORDER_STATUS_LABELS[value]}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <span className={`rounded-full px-3 py-1.5 text-sm font-semibold ${ORDER_STATUS_COLORS[status]}`}>
                {ORDER_STATUS_LABELS[status]}
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="order-notes" className="admin-label">
              Internal notes
            </label>
            <textarea
              id="order-notes"
              rows={3}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Called customer, delivery confirmed..."
              className="admin-input resize-none"
            />
          </div>

          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

          <div className="flex flex-wrap gap-3 border-t border-admin-bg pt-4">
            <button type="button" onClick={save} disabled={saving} className="admin-btn-primary disabled:opacity-60">
              {saving ? 'Saving...' : 'Save changes'}
            </button>
            <a href={`tel:${order.phone}`} className="admin-btn-secondary">
              Call customer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
