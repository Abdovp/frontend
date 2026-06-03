import type { FunnelStep } from '../../lib/admin/types';
import { formatPercent } from '../../lib/admin/format';

type Props = {
  steps: FunnelStep[];
};

export default function FunnelChart({ steps }: Props) {
  const max = Math.max(...steps.map((step) => step.count), 1);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <h3 className="font-heading text-lg font-bold text-ink">Conversion Funnel</h3>
      <div className="mt-5 space-y-4">
        {steps.map((step) => {
          const width = Math.max((step.count / max) * 100, step.count > 0 ? 8 : 2);
          return (
            <div key={step.event_name}>
              <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold text-ink">{step.label}</span>
                <span className="text-slate-500">
                  {step.count.toLocaleString('en-US')}
                  {step.rate_from_previous != null ? ` · ${formatPercent(step.rate_from_previous)}` : ''}
                </span>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-brand to-brand-light transition-all"
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
