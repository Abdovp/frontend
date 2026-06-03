type Props = {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
};

const presets = [
  { label: '7 أيام', days: 6 },
  { label: '30 يوم', days: 29 },
  { label: '90 يوم', days: 89 },
];

export default function DateRangePicker({ from, to, onChange }: Props) {
  function applyPreset(days: number) {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    onChange(start.toISOString().slice(0, 10), end.toISOString().slice(0, 10));
  }

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
      <div>
        <label htmlFor="from-date" className="mb-1 block text-xs font-semibold text-slate-500">
          من
        </label>
        <input
          id="from-date"
          type="date"
          value={from}
          onChange={(event) => onChange(event.target.value, to)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="to-date" className="mb-1 block text-xs font-semibold text-slate-500">
          إلى
        </label>
        <input
          id="to-date"
          type="date"
          value={to}
          onChange={(event) => onChange(from, event.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => applyPreset(preset.days)}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-brand hover:text-brand"
          >
            {preset.label}
          </button>
        ))}
      </div>
      <p className="w-full text-xs text-slate-500">الإحصائيات تُحسب فقط من عناوين IP مغربية صالحة 🇲🇦</p>
    </div>
  );
}
