type Props = {
  label: string;
  value: string;
  hint?: string;
  accent?: 'default' | 'brand' | 'gold' | 'green' | 'blue';
};

const valueColors = {
  default: 'text-slate-900',
  brand: 'text-brand',
  gold: 'text-amber-600',
  green: 'text-emerald-600',
  blue: 'text-blue-600',
};

export default function MetricCard({ label, value, hint, accent = 'default' }: Props) {
  return (
    <div className="admin-metric">
      <p className="admin-metric__label">{label}</p>
      <p className={`admin-metric__value ${valueColors[accent]}`}>{value}</p>
      {hint ? <p className="admin-metric__hint">{hint}</p> : null}
    </div>
  );
}
