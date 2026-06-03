type Props = {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
};

const presets = [
  { label: '7 days', days: 6 },
  { label: '30 days', days: 29 },
  { label: '90 days', days: 89 },
];

export default function DateRangePicker({ from, to, onChange }: Props) {
  function applyPreset(days: number) {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    onChange(start.toISOString().slice(0, 10), end.toISOString().slice(0, 10));
  }

  return (
    <div className="admin-panel">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h3 className="admin-panel__title">Date range</h3>
          <p className="mt-1 text-xs text-admin-muted">Metrics include Morocco IP traffic only</p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="from-date" className="admin-label">
              From
            </label>
            <input
              id="from-date"
              type="date"
              value={from}
              onChange={(event) => onChange(event.target.value, to)}
              className="admin-input w-auto min-w-[10rem]"
            />
          </div>
          <div>
            <label htmlFor="to-date" className="admin-label">
              To
            </label>
            <input
              id="to-date"
              type="date"
              value={to}
              onChange={(event) => onChange(from, event.target.value)}
              className="admin-input w-auto min-w-[10rem]"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyPreset(preset.days)}
                className="admin-btn-secondary !rounded-full !px-4 !py-2 !text-xs"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
