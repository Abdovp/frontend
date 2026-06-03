import { useEffect, useState } from 'react';
import { updateAdminOrder } from '../../lib/admin/api';
import { formatDateTime, formatMad } from '../../lib/admin/format';
import type { AdminOrderDetail, OrderStatus } from '../../lib/admin/types';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../../lib/admin/types';

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
      const updated = await updateAdminOrder(order.id, {
        status,
        admin_notes: notes,
      });
      onUpdated(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save changes');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} aria-label="Close" />
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-lift">
        <div className="border-b border-slate-100 bg-gradient-to-r from-brand to-brand-dark px-6 py-5 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest2 text-accent">Order Preview</p>
              <h3 className="mt-1 font-heading text-2xl font-bold">{order.public_order_id}</h3>
              <p className="mt-1 text-sm text-white/75">{formatDateTime(order.created_at)}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold hover:bg-white/20"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="space-y-6 px-6 py-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">Customer</p>
              <p className="mt-1 font-heading text-lg font-bold text-ink">{order.customer_name}</p>
              <a href={`tel:${order.phone}`} className="mt-2 inline-block font-semibold text-brand">
                {order.phone}
              </a>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">Order Total</p>
              <p className="mt-1 font-heading text-2xl font-bold text-accent-dark">{formatMad(order.total)}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {order.has_upsell ? (
                  <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent-dark">Upsell ✓</span>
                ) : null}
                {order.sheet_sent ? (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Google Sheet ✓</span>
                ) : (
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">Sheet pending</span>
                )}
                {order.country_code === 'MA' ? (
                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">🇲🇦 Morocco IP</span>
                ) : order.client_ip ? (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{order.client_ip}</span>
                ) : null}
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-heading text-lg font-bold text-ink">Products</h4>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Product</th>
                    <th className="px-4 py-3 text-left font-semibold">Offer</th>
                    <th className="px-4 py-3 text-left font-semibold">Qty</th>
                    <th className="px-4 py-3 text-left font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={`${item.product_id}-${item.offer}-${item.is_upsell}`} className="border-t border-slate-100">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-ink">{item.product_name}</p>
                        {item.is_upsell ? <span className="text-xs text-accent-dark">Upsell</span> : null}
                      </td>
                      <td className="px-4 py-3">{item.offer}</td>
                      <td className="px-4 py-3">{item.quantity}</td>
                      <td className="px-4 py-3 font-semibold">{formatMad(item.line_total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {order.capi_platforms.length > 0 ? (
            <div>
              <p className="text-xs font-semibold text-slate-500">CAPI Platforms</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {order.capi_platforms.map((platform) => (
                  <span key={platform} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand">
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="order-status" className="mb-2 block text-sm font-semibold text-ink">
                Order Status
              </label>
              <select
                id="order-status"
                value={status}
                onChange={(event) => setStatus(event.target.value as OrderStatus)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              >
                {statuses.map((value) => (
                  <option key={value} value={value}>
                    {ORDER_STATUS_LABELS[value]}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <span className={`rounded-full px-3 py-2 text-sm font-semibold ${ORDER_STATUS_COLORS[status]}`}>
                {ORDER_STATUS_LABELS[status]}
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="order-notes" className="mb-2 block text-sm font-semibold text-ink">
              Internal Notes
            </label>
            <textarea
              id="order-notes"
              rows={3}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="e.g. Called customer, delivery confirmed for tomorrow..."
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            />
          </div>

          {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}

          <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white shadow-brand transition hover:bg-brand-dark disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <a
              href={`tel:${order.phone}`}
              className="rounded-xl border border-brand px-5 py-3 text-sm font-bold text-brand transition hover:bg-brand-50"
            >
              Call Customer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
