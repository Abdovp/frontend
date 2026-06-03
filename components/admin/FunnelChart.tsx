import type { FunnelStep } from '../../lib/admin/types';
import { formatPercent } from '../../lib/admin/format';
import AdminIcon from './AdminIcon';

type Props = {
  steps: FunnelStep[];
};

export default function FunnelChart({ steps }: Props) {
  const max = Math.max(...steps.map((step) => step.count), 1);

  return (
    <div className="admin-card p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-2">
        <AdminIcon name="chart" className="h-5 w-5 text-slate-400" />
        <h3 className="text-base font-semibold text-slate-900">Conversion funnel</h3>
      </div>
      <div className="space-y-4">
        {steps.map((step) => {
          const width = Math.max((step.count / max) * 100, step.count > 0 ? 6 : 2);
          return (
            <div key={step.event_name}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-slate-700">{step.label}</span>
                <span className="tabular-nums text-slate-500">
                  {step.count.toLocaleString('en-US')}
                  {step.rate_from_previous != null ? ` · ${formatPercent(step.rate_from_previous)}` : ''}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-brand transition-all duration-500"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
