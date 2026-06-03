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
    <AdminLayout title="Overview">
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
          <div className="admin-panel text-center text-sm text-admin-muted">Loading metrics...</div>
        ) : null}

        {error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        {metrics ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Revenue" value={formatMad(metrics.revenue)} hint={`AOV: ${formatMad(metrics.average_order_value)}`} icon="trending" primary />
              <MetricCard label="Confirmed Orders" value={metrics.confirmed_orders.toLocaleString('en-US')} hint={`Total orders: ${metrics.orders.toLocaleString('en-US')}`} icon="clipboard" />
              <MetricCard label="Conversion Rate" value={formatPercent(metrics.conversion_rate)} hint={`${metrics.orders} orders / ${metrics.page_views} visits`} icon="barChart" />
              <MetricCard label="Checkout CVR" value={formatPercent(metrics.checkout_conversion_rate)} hint={`${metrics.initiate_checkout.toLocaleString('en-US')} checkouts`} icon="checkCircle" />
              <MetricCard label="Page Views" value={metrics.page_views.toLocaleString('en-US')} hint="Morocco traffic only" icon="eye" />
              <MetricCard label="Add to Cart" value={metrics.add_to_cart.toLocaleString('en-US')} hint={`View product: ${metrics.view_content.toLocaleString('en-US')}`} icon="cursor" />
              <MetricCard label="AOV" value={formatMad(metrics.average_order_value)} hint={`Revenue: ${formatMad(metrics.revenue)}`} icon="package" />
              <MetricCard label="Upsell Take Rate" value={formatPercent(metrics.upsell_rate)} hint={`${metrics.upsell_orders} upsell orders`} icon="shield" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Total Orders" value={metrics.orders.toLocaleString('en-US')} icon="clipboard" />
              <MetricCard label="View Product" value={metrics.view_content.toLocaleString('en-US')} icon="eye" />
              <MetricCard label="New Orders" value={metrics.pending_orders.toLocaleString('en-US')} icon="cart" />
              <MetricCard label="Delivered" value={metrics.delivered_orders.toLocaleString('en-US')} icon="truck" />
              <MetricCard label="Cancelled" value={metrics.cancelled_orders.toLocaleString('en-US')} icon="refresh" />
              <MetricCard label="Upsell Orders" value={metrics.upsell_orders.toLocaleString('en-US')} icon="shield" />
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <DailyChart daily={metrics.daily} />
              </div>
              <FunnelChart steps={metrics.funnel} />
            </div>

            <div className="admin-panel">
              <h3 className="admin-panel__title">Top Products</h3>
              {metrics.top_products.length === 0 ? (
                <div className="admin-empty mt-5">No data for this range yet.</div>
              ) : (
                <div className="mt-5 overflow-x-auto">
                  <table className="admin-table min-w-full">
                    <thead className="border-b border-admin-bg">
                      <tr>
                        <th>Product</th>
                        <th>Orders</th>
                        <th>Qty</th>
                        <th>Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-admin-bg">
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
              )}
            </div>
          </>
        ) : null}
      </div>
    </AdminLayout>
  );
}
