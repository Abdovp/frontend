export function formatMad(amount: number): string {
  return `${amount.toLocaleString('fr-MA', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} د.م`;
}

export function formatPercent(value: number): string {
  return `${value.toLocaleString('fr-MA', { maximumFractionDigits: 2 })}%`;
}

export function formatDateTime(value: string): string {
  return new Date(value).toLocaleString('ar-MA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('ar-MA', { dateStyle: 'medium' });
}

export function toInputDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function defaultDateRange(): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 29);
  return { from: toInputDate(from), to: toInputDate(to) };
}
