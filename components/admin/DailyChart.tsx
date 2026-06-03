import type { DailyMetric } from '../../lib/admin/types';
import { formatMad } from '../../lib/admin/format';

type Props = {
  daily: DailyMetric[];
};

export default function DailyChart({ daily }: Props) {
  const maxViews = Math.max(...daily.map((row) => row.page_views), 1);
  const maxRevenue = Math.max(...daily.map((row) => row.revenue), 1);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <h3 className="font-heading text-lg font-bold text-ink">Daily Performance</h3>
      <div className="mt-4 overflow-x-auto">
        <div className="flex min-w-[640px] items-end gap-2">
          {daily.map((row) => {
            const viewHeight = Math.max((row.page_views / maxViews) * 120, row.page_views > 0 ? 8 : 2);
            const revenueHeight = Math.max((row.revenue / maxRevenue) * 120, row.revenue > 0 ? 8 : 2);
            const label = new Date(row.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
            return (
              <div key={row.date} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-32 items-end gap-1">
                  <div
                    title={`${row.page_views} visits`}
                    className="w-3 rounded-t-md bg-brand/80"
                    style={{ height: `${viewHeight}px` }}
                  />
                  <div
                    title={formatMad(row.revenue)}
                    className="w-3 rounded-t-md bg-accent"
                    style={{ height: `${revenueHeight}px` }}
                  />
                </div>
                <p className="text-[10px] font-semibold text-slate-500">{label}</p>
                <p className="text-[10px] text-slate-400">{row.orders} orders</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-brand/80" /> Visits
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-accent" /> Revenue
        </span>
      </div>
    </div>
  );
}
