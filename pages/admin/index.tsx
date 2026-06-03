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
        if (!cancelled) setError(err instanceof Error ? err.message : 'تعذّر تحميل الإحصائيات');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [from, to]);

  return (
    <AdminLayout title="لوحة التحكم">
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
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">جاري التحميل...</div>
        ) : null}

        {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div> : null}

        {metrics ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="زيارات (🇲🇦)" value={metrics.page_views.toLocaleString('fr-MA')} hint="PageView" accent="brand" />
              <MetricCard label="الطلبات" value={metrics.orders.toLocaleString('fr-MA')} hint={`Upsell: ${metrics.upsell_orders} (${formatPercent(metrics.upsell_rate)})`} accent="gold" />
              <MetricCard label="الإيرادات" value={formatMad(metrics.revenue)} hint={`AOV: ${formatMad(metrics.average_order_value)}`} accent="green" />
              <MetricCard label="معدل التحويل" value={formatPercent(metrics.conversion_rate)} hint={`Checkout → Order: ${formatPercent(metrics.checkout_conversion_rate)}`} accent="blue" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <MetricCard label="عرض المنتج" value={metrics.view_content.toLocaleString('fr-MA')} />
              <MetricCard label="إضافة للسلة" value={metrics.add_to_cart.toLocaleString('fr-MA')} />
              <MetricCard label="بدء الشراء" value={metrics.initiate_checkout.toLocaleString('fr-MA')} />
              <MetricCard label="طلبات جديدة" value={metrics.pending_orders.toLocaleString('fr-MA')} />
              <MetricCard label="تم التسليم" value={metrics.delivered_orders.toLocaleString('fr-MA')} />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <FunnelChart steps={metrics.funnel} />
              <DailyChart daily={metrics.daily} />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <h3 className="font-heading text-lg font-bold text-ink">أفضل المنتجات</h3>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="text-slate-500">
                    <tr>
                      <th className="py-2 text-right font-semibold">المنتج</th>
                      <th className="py-2 text-right font-semibold">الطلبات</th>
                      <th className="py-2 text-right font-semibold">الكمية</th>
                      <th className="py-2 text-right font-semibold">الإيرادات</th>
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
              <MetricCard label="مؤكّدة" value={String(metrics.confirmed_orders)} />
              <MetricCard label="تم الشحن" value={String(metrics.shipped_orders)} />
              <MetricCard label="ملغاة" value={String(metrics.cancelled_orders)} />
              <MetricCard label="Upsell Rate" value={formatPercent(metrics.upsell_rate)} />
            </div>
          </>
        ) : null}
      </div>
    </AdminLayout>
  );
}
