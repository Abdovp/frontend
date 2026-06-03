type Props = {
  label: string;
  value: string;
  hint?: string;
  accent?: 'gold' | 'brand' | 'green' | 'blue';
};

const accents = {
  gold: 'border-accent/30 bg-gradient-to-br from-accent/10 to-white',
  brand: 'border-brand/20 bg-gradient-to-br from-brand-50 to-white',
  green: 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-white',
  blue: 'border-blue-200 bg-gradient-to-br from-blue-50 to-white',
};

export default function MetricCard({ label, value, hint, accent = 'brand' }: Props) {
  return (
    <div className={`rounded-2xl border p-5 shadow-soft ${accents[accent]}`}>
      <p className="text-sm font-semibold text-slate-600">{label}</p>
      <p className="mt-2 font-heading text-2xl font-bold text-ink sm:text-3xl">{value}</p>
      {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}
