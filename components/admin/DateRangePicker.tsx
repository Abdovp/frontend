import AdminIcon from './AdminIcon';

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
    <div className="admin-card p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <AdminIcon name="calendar" className="h-5 w-5 text-slate-400" />
        <h3 className="text-sm font-semibold text-slate-900">Date range</h3>
      </div>
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor="from-date" className="admin-label">
            From
          </label>
          <input
            id="from-date"
            type="date"
            value={from}
            onChange={(event) => onChange(event.target.value, to)}
            className="admin-input w-auto"
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
            className="admin-input w-auto"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset.days)}
              className="admin-btn-secondary !rounded-full !px-3.5 !py-2 !text-xs"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-400">Metrics include Morocco IP traffic only</p>
    </div>
  );
}
