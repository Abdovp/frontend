import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import DailyChart from '../../components/admin/DailyChart';
import DateRangePicker from '../../components/admin/DateRangePicker';
import FunnelChart from '../../components/admin/FunnelChart';
import MetricCard from '../../components/admin/MetricCard';
import { fetchAdminMetrics } from '../../lib/admin/api';
import { defaultDateRange, formatMad, formatPercent } from '../../lib/admin/format';
import type { AdminMetrics } from '../../lib/admin/types';

export default function AdminDashboardPage() {
  const initial = defaultDateRange();
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    fetchAdminMetrics(from, to)
      .then((data) => {
        if (!cancelled) setMetrics(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load metrics');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [from, to]);

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        <DateRangePicker
          from={from}
          to={to}
          onChange={(nextFrom, nextTo) => {
            setFrom(nextFrom);
            setTo(nextTo);
          }}
        />

        {loading ? (
          <div className="admin-card p-12 text-center text-sm text-slate-500">Loading metrics...</div>
        ) : null}

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        {metrics ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Visits (MA)" value={metrics.page_views.toLocaleString('en-US')} hint="PageView events" accent="brand" />
              <MetricCard label="Orders" value={metrics.orders.toLocaleString('en-US')} hint={`Upsell: ${metrics.upsell_orders} (${formatPercent(metrics.upsell_rate)})`} accent="gold" />
              <MetricCard label="Revenue" value={formatMad(metrics.revenue)} hint={`AOV: ${formatMad(metrics.average_order_value)}`} accent="green" />
              <MetricCard label="Conversion" value={formatPercent(metrics.conversion_rate)} hint={`Checkout → Order: ${formatPercent(metrics.checkout_conversion_rate)}`} accent="blue" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <MetricCard label="View Product" value={metrics.view_content.toLocaleString('en-US')} />
              <MetricCard label="Add to Cart" value={metrics.add_to_cart.toLocaleString('en-US')} />
              <MetricCard label="Initiate Checkout" value={metrics.initiate_checkout.toLocaleString('en-US')} />
              <MetricCard label="New Orders" value={metrics.pending_orders.toLocaleString('en-US')} />
              <MetricCard label="Delivered" value={metrics.delivered_orders.toLocaleString('en-US')} />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <FunnelChart steps={metrics.funnel} />
              <DailyChart daily={metrics.daily} />
            </div>

            <div className="admin-card p-5 sm:p-6">
              <h3 className="text-base font-semibold text-slate-900">Top products</h3>
              <div className="mt-4 overflow-x-auto">
                <table className="admin-table min-w-full">
                  <thead className="border-b border-slate-100">
                    <tr>
                      <th>Product</th>
                      <th>Orders</th>
                      <th>Qty</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {metrics.top_products.map((product) => (
                      <tr key={product.product_id}>
                        <td className="font-medium text-slate-900">{product.product_name}</td>
                        <td>{product.orders}</td>
                        <td>{product.quantity}</td>
                        <td className="font-semibold tabular-nums text-slate-900">{formatMad(product.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard label="Confirmed" value={String(metrics.confirmed_orders)} />
              <MetricCard label="Shipped" value={String(metrics.shipped_orders)} />
              <MetricCard label="Cancelled" value={String(metrics.cancelled_orders)} />
              <MetricCard label="Upsell Rate" value={formatPercent(metrics.upsell_rate)} />
            </div>
          </>
        ) : null}
      </div>
    </AdminLayout>
  );
}
