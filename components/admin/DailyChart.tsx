import type { DailyMetric } from '../../lib/admin/types';
import { formatMad } from '../../lib/admin/format';

type Props = {
  daily: DailyMetric[];
};

function hasDailyData(daily: DailyMetric[]) {
  return daily.some((row) => row.page_views > 0 || row.orders > 0 || row.revenue > 0);
}

export default function DailyChart({ daily }: Props) {
  const maxViews = Math.max(...daily.map((row) => row.page_views), 1);
  const maxRevenue = Math.max(...daily.map((row) => row.revenue), 1);
  const empty = daily.length === 0 || !hasDailyData(daily);

  return (
    <div className="admin-panel h-full">
      <h3 className="admin-panel__title">Daily Trend</h3>
      {empty ? (
        <div className="admin-empty mt-5">No data for this range yet.</div>
      ) : (
        <>
          <p className="mt-1 text-xs text-admin-muted">Visits · Revenue</p>
          <div className="mt-5 overflow-x-auto">
            <div className="flex min-w-[640px] items-end gap-1.5">
              {daily.map((row) => {
                const viewHeight = Math.max((row.page_views / maxViews) * 100, row.page_views > 0 ? 6 : 2);
                const revenueHeight = Math.max((row.revenue / maxRevenue) * 100, row.revenue > 0 ? 6 : 2);
                const label = new Date(row.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                return (
                  <div key={row.date} className="flex flex-1 flex-col items-center gap-1.5">
                    <div className="flex h-32 w-full items-end justify-center gap-1">
                      <div
                        title={`${row.page_views} visits`}
                        className="w-2.5 rounded-t bg-admin-accent/35 sm:w-3"
                        style={{ height: `${viewHeight}%` }}
                      />
                      <div
                        title={formatMad(row.revenue)}
                        className="w-2.5 rounded-t bg-admin-accent sm:w-3"
                        style={{ height: `${revenueHeight}%` }}
                      />
                    </div>
                    <p className="text-[10px] font-medium text-admin-muted">{label}</p>
                    <p className="text-[10px] text-admin-muted/80">{row.orders} ord.</p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
