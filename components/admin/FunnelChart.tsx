import type { FunnelStep } from '../../lib/admin/types';
import { formatPercent } from '../../lib/admin/format';

type Props = {
  steps: FunnelStep[];
};

function hasFunnelData(steps: FunnelStep[]) {
  return steps.some((step) => step.count > 0);
}

export default function FunnelChart({ steps }: Props) {
  const max = Math.max(...steps.map((step) => step.count), 1);
  const empty = steps.length === 0 || !hasFunnelData(steps);

  return (
    <div className="admin-panel h-full">
      <h3 className="admin-panel__title">Conversion Funnel</h3>
      {empty ? (
        <div className="admin-empty mt-5">No data for this range yet.</div>
      ) : (
        <div className="mt-5 space-y-4">
          {steps.map((step) => {
            const width = Math.max((step.count / max) * 100, step.count > 0 ? 6 : 2);
            return (
              <div key={step.event_name}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-slate-700">{step.label}</span>
                  <span className="tabular-nums text-admin-muted">
                    {step.count.toLocaleString('en-US')}
                    {step.rate_from_previous != null ? ` · ${formatPercent(step.rate_from_previous)}` : ''}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-admin-bg">
                  <div
                    className="h-2 rounded-full bg-admin-accent transition-all duration-500"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
