import type { DailyMetric } from '../../lib/admin/types';
import { formatMad } from '../../lib/admin/format';

type Props = {
  daily: DailyMetric[];
};

export default function DailyChart({ daily }: Props) {
  const maxViews = Math.max(...daily.map((row) => row.page_views), 1);
  const maxRevenue = Math.max(...daily.map((row) => row.revenue), 1);

  return (
    <div className="admin-card p-5 sm:p-6">
      <h3 className="text-base font-semibold text-slate-900">Daily performance</h3>
      <p className="mt-1 text-xs text-slate-400">Visits (blue) · Revenue (gold)</p>
      <div className="mt-5 overflow-x-auto">
        <div className="flex min-w-[640px] items-end gap-1.5">
          {daily.map((row) => {
            const viewHeight = Math.max((row.page_views / maxViews) * 100, row.page_views > 0 ? 6 : 2);
            const revenueHeight = Math.max((row.revenue / maxRevenue) * 100, row.revenue > 0 ? 6 : 2);
            const label = new Date(row.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
            return (
              <div key={row.date} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex h-28 w-full items-end justify-center gap-0.5">
                  <div
                    title={`${row.page_views} visits`}
                    className="w-2 rounded-t bg-brand/70 sm:w-2.5"
                    style={{ height: `${viewHeight}%` }}
                  />
                  <div
                    title={formatMad(row.revenue)}
                    className="w-2 rounded-t bg-accent sm:w-2.5"
                    style={{ height: `${revenueHeight}%` }}
                  />
                </div>
                <p className="text-[10px] font-medium text-slate-500">{label}</p>
                <p className="text-[10px] text-slate-400">{row.orders} ord.</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
