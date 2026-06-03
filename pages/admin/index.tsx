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
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">Loading...</div>
        ) : null}

        {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div> : null}

        {metrics ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Visits (🇲🇦)" value={metrics.page_views.toLocaleString('en-US')} hint="PageView" accent="brand" />
              <MetricCard label="Orders" value={metrics.orders.toLocaleString('en-US')} hint={`Upsell: ${metrics.upsell_orders} (${formatPercent(metrics.upsell_rate)})`} accent="gold" />
              <MetricCard label="Revenue" value={formatMad(metrics.revenue)} hint={`AOV: ${formatMad(metrics.average_order_value)}`} accent="green" />
              <MetricCard label="Conversion Rate" value={formatPercent(metrics.conversion_rate)} hint={`Checkout → Order: ${formatPercent(metrics.checkout_conversion_rate)}`} accent="blue" />
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

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <h3 className="font-heading text-lg font-bold text-ink">Top Products</h3>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="text-slate-500">
                    <tr>
                      <th className="py-2 text-left font-semibold">Product</th>
                      <th className="py-2 text-left font-semibold">Orders</th>
                      <th className="py-2 text-left font-semibold">Quantity</th>
                      <th className="py-2 text-left font-semibold">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.top_products.map((product) => (
                      <tr key={product.product_id} className="border-t border-slate-100">
                        <td className="py-3 font-semibold text-ink">{product.product_name}</td>
                        <td className="py-3">{product.orders}</td>
                        <td className="py-3">{product.quantity}</td>
                        <td className="py-3 font-bold text-accent-dark">{formatMad(product.revenue)}</td>
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
