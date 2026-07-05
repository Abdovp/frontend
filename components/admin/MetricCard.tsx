import AdminIcon, { type AdminIconName } from './AdminIcon';

type Props = {
  label: string;
  value: string;
  hint?: string;
  icon: AdminIconName;
  primary?: boolean;
};

export default function MetricCard({ label, value, hint, icon, primary = false }: Props) {
  return (
    <div className={`admin-metric ${primary ? 'admin-metric--primary' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <p className={`admin-metric__label ${primary ? 'text-white/70' : ''}`}>{label}</p>
        <span className={`admin-metric__icon ${primary ? 'text-white/80' : ''}`}>
          <AdminIcon name={icon} className="h-5 w-5" />
        </span>
      </div>
      <p className={`admin-metric__value ${primary ? 'text-white' : ''}`}>{value}</p>
      {hint ? <p className={`admin-metric__hint ${primary ? 'text-white/55' : ''}`}>{hint}</p> : null}
    </div>
  );
}
