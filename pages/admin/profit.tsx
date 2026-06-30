import { useMemo, useState, type ReactNode } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { formatPercent } from '../../lib/admin/format';

type CalculatorInputProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  min?: number;
  step?: number;
};

const CONFIRMED_LEAD_COST = 10;
const RETURN_COST = 10;
const CANCELED_LEAD_COST = 10;

function percent(value: number): number {
  return Math.max(0, Math.min(100, value)) / 100;
}

function safeNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function money(value: number, signed = false): string {
  const n = safeNumber(value);
  const formatted = `${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD`;
  if (!signed) return formatted;
  if (n > 0) return `+${formatted}`;
  if (n < 0) return `-${formatted}`;
  return formatted;
}

function moneyShort(value: number): string {
  return `${safeNumber(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD`;
}

function CalculatorInput({ label, value, onChange, suffix, min = 0, step = 1 }: CalculatorInputProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>
      <div className="relative">
        <input
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className={`admin-input ${suffix ? 'pr-12' : ''}`}
        />
        {suffix ? (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-medium text-admin-muted">
            {suffix}
          </span>
        ) : null}
      </div>
    </label>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#f3ede4] px-3 py-3 text-center">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-base font-bold tabular-nums text-slate-900">{value}</p>
    </div>
  );
}

function StatusCheck({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <p className={`mt-2 flex items-center gap-1.5 text-xs ${ok ? 'text-emerald-600' : 'text-amber-600'}`}>
      <span className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white ${ok ? 'bg-emerald-500' : 'bg-amber-400'}`}>
        {ok ? '✓' : '!'}
      </span>
      {children}
    </p>
  );
}

function ThresholdCard({
  label,
  value,
  children,
  highlight = false,
}: {
  label: string;
  value: string;
  children?: ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        highlight ? 'border-emerald-200 bg-emerald-50' : 'border-transparent bg-[#f3ede4]'
      }`}
    >
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className={`mt-2 text-3xl font-bold tabular-nums tracking-tight ${highlight ? 'text-emerald-700' : 'text-slate-900'}`}>
        {value}
      </p>
      {children}
    </div>
  );
}

function PlRow({ label, value, variant }: { label: string; value: string; variant: 'revenue' | 'cost' | 'total' }) {
  const valueClass =
    variant === 'revenue'
      ? 'font-bold text-emerald-700'
      : variant === 'cost'
        ? 'text-red-600'
        : 'font-bold text-slate-900';

  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-sm text-slate-700">{label}</span>
      <span className={`text-sm tabular-nums ${valueClass}`}>{value}</span>
    </div>
  );
}

export default function AdminProfitPage() {
  const [leads, setLeads] = useState(100);
  const [costPerLead, setCostPerLead] = useState(8);
  const [confirmationRate, setConfirmationRate] = useState(60);
  const [deliveryRate, setDeliveryRate] = useState(70);
  const [averageOrderValue, setAverageOrderValue] = useState(199);
  const [productCost, setProductCost] = useState(70);
  const [deliveryCost, setDeliveryCost] = useState(35);
  const [fixedOverhead, setFixedOverhead] = useState(0);

  const result = useMemo(() => {
    const confirmation = percent(confirmationRate);
    const delivery = percent(deliveryRate);
    const confirmed = leads * confirmation;
    const delivered = confirmed * delivery;
    const returns = Math.max(0, confirmed - delivered);
    const canceled = Math.max(0, leads - confirmed);
    const adSpend = leads * costPerLead;
    const revenue = delivered * averageOrderValue;
    const productSpend = delivered * productCost;
    const shippingSpend = delivered * deliveryCost;
    const confirmedFees = confirmed * CONFIRMED_LEAD_COST;
    const returnFees = returns * RETURN_COST;
    const cancelFees = canceled * CANCELED_LEAD_COST;
    const overhead = fixedOverhead;
    const totalCosts =
      adSpend + productSpend + shippingSpend + confirmedFees + returnFees + cancelFees + overhead;
    const profit = revenue - totalCosts;
    const profitPerLead = leads > 0 ? profit / leads : 0;
    const profitPerDelivered = delivered > 0 ? profit / delivered : 0;
    const roi = totalCosts > 0 ? (profit / totalCosts) * 100 : 0;

    const overheadPerLead = leads > 0 ? overhead / leads : 0;
    const unitMargin = averageOrderValue - productCost - deliveryCost + RETURN_COST;
    const confDenom = delivery * unitMargin;
    const delDenom = confirmation * unitMargin;

    const breakevenConfirmationRate =
      confDenom > 0 ? ((costPerLead + CONFIRMED_LEAD_COST + overheadPerLead) / confDenom) * 100 : null;
    const breakevenDeliveryRate =
      delDenom > 0 ? ((costPerLead + CONFIRMED_LEAD_COST + overheadPerLead) / delDenom) * 100 : null;

    const contributionBeforeAdsPerLead =
      confirmation * delivery * (averageOrderValue - productCost - deliveryCost) -
      confirmation * CONFIRMED_LEAD_COST -
      confirmation * (1 - delivery) * RETURN_COST -
      (1 - confirmation) * CANCELED_LEAD_COST -
      overheadPerLead;
    const maxAffordableCpl = contributionBeforeAdsPerLead;

    return {
      confirmed,
      delivered,
      returns,
      canceled,
      adSpend,
      revenue,
      productSpend,
      shippingSpend,
      confirmedFees,
      returnFees,
      cancelFees,
      totalCosts,
      profit,
      profitPerLead,
      profitPerDelivered,
      roi,
      breakevenConfirmationRate,
      breakevenDeliveryRate,
      maxAffordableCpl,
      isProfitable: profitPerLead > 0,
      cplOk: costPerLead <= maxAffordableCpl,
      deliveryOk: breakevenDeliveryRate != null ? deliveryRate >= breakevenDeliveryRate : true,
      confirmationOk: breakevenConfirmationRate != null ? confirmationRate >= breakevenConfirmationRate : true,
    };
  }, [
    averageOrderValue,
    confirmationRate,
    costPerLead,
    deliveryCost,
    deliveryRate,
    fixedOverhead,
    leads,
    productCost,
  ]);

  const costLines = [
    { label: 'Ad Spend', value: result.adSpend },
    { label: 'Product Costs', value: result.productSpend },
    { label: 'Confirmation Fees', value: result.confirmedFees },
    { label: 'Delivery Fees', value: result.shippingSpend },
    { label: 'Return Fees', value: result.returnFees },
    { label: 'Cancel Fees', value: result.cancelFees },
    ...(fixedOverhead > 0 ? [{ label: 'Fixed Overhead', value: fixedOverhead }] : []),
  ];

  return (
    <AdminLayout title="Profit Calculator">
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Breakeven & profit calculator</h1>
          <p className="mt-1 text-sm text-admin-muted">
            Fixed fees: {CONFIRMED_LEAD_COST}dh confirmed · {RETURN_COST}dh return · {CANCELED_LEAD_COST}dh canceled
          </p>
        </div>

        <section className="admin-panel">
          <h2 className="admin-panel__title">Inputs</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <CalculatorInput label="Leads" value={leads} onChange={setLeads} />
            <CalculatorInput label="Cost per lead" value={costPerLead} onChange={setCostPerLead} suffix="dh" />
            <CalculatorInput label="Confirmation rate" value={confirmationRate} onChange={setConfirmationRate} suffix="%" />
            <CalculatorInput label="Delivery rate" value={deliveryRate} onChange={setDeliveryRate} suffix="%" />
            <CalculatorInput label="Average order value" value={averageOrderValue} onChange={setAverageOrderValue} suffix="dh" step={0.01} />
            <CalculatorInput label="Product cost" value={productCost} onChange={setProductCost} suffix="dh" step={0.01} />
            <CalculatorInput label="Delivery cost" value={deliveryCost} onChange={setDeliveryCost} suffix="dh" />
            <CalculatorInput label="Fixed overhead" value={fixedOverhead} onChange={setFixedOverhead} suffix="dh" />
          </div>
        </section>

        <div className="grid gap-5 xl:grid-cols-2">
          {/* Section 1 — Breakeven Thresholds */}
          <section className="admin-panel">
            <h2 className="text-lg font-bold text-slate-900">Section 1 — Breakeven Thresholds</h2>
            <p className="mt-1 text-sm text-admin-muted">Minimum performance needed to hit 0 MAD profit.</p>

            <div className="mt-5 space-y-3">
              <ThresholdCard label="Current Profit Per Lead" value={money(result.profitPerLead, true)} highlight={result.isProfitable}>
                <StatusCheck ok={result.isProfitable}>
                  {result.isProfitable ? 'You are profitable at current CPL' : 'You are below breakeven at current CPL'}
                </StatusCheck>
              </ThresholdCard>

              <ThresholdCard
                label="Breakeven Delivery Rate"
                value={result.breakevenDeliveryRate != null ? formatPercent(result.breakevenDeliveryRate) : 'N/A'}
              >
                <StatusCheck ok={result.deliveryOk}>
                  Need: {result.breakevenDeliveryRate != null ? formatPercent(result.breakevenDeliveryRate) : 'N/A'} · Current:{' '}
                  {formatPercent(deliveryRate)}
                </StatusCheck>
              </ThresholdCard>

              <ThresholdCard label="Max Affordable CPL" value={moneyShort(result.maxAffordableCpl)}>
                <StatusCheck ok={result.cplOk}>
                  Need: Max {moneyShort(result.maxAffordableCpl)} · Current: {moneyShort(costPerLead)}
                </StatusCheck>
              </ThresholdCard>

              <ThresholdCard
                label="Breakeven Confirmation Rate"
                value={result.breakevenConfirmationRate != null ? formatPercent(result.breakevenConfirmationRate) : 'N/A'}
              >
                <StatusCheck ok={result.confirmationOk}>
                  Need: {result.breakevenConfirmationRate != null ? formatPercent(result.breakevenConfirmationRate) : 'N/A'} · Current:{' '}
                  {formatPercent(confirmationRate)}
                </StatusCheck>
              </ThresholdCard>
            </div>
          </section>

          {/* Section 2 — Profit at Scale */}
          <section className="admin-panel">
            <h2 className="text-lg font-bold text-slate-900">Section 2 — Profit at Scale</h2>
            <p className="mt-1 text-sm text-admin-muted">
              Full P&L projection for <span className="font-semibold text-slate-800">{leads.toLocaleString('en-US')}</span> leads.
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <MiniStat label="Leads" value={leads.toLocaleString('en-US')} />
              <MiniStat label="Confirmed" value={Math.round(result.confirmed).toLocaleString('en-US')} />
              <MiniStat label="Delivered" value={Math.round(result.delivered).toLocaleString('en-US')} />
            </div>

            <div className="mt-5">
              <PlRow label="Revenue" value={money(result.revenue)} variant="revenue" />
              <div className="my-1 border-t border-slate-200" />

              {costLines.map((line) => (
                <PlRow key={line.label} label={line.label} value={`-${moneyShort(line.value)}`} variant="cost" />
              ))}

              <div className="my-1 border-t border-slate-200" />
              <PlRow label="Total Costs" value={`-${moneyShort(result.totalCosts)}`} variant="total" />
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3.5">
              <span className="text-sm font-bold text-slate-900">Net Profit</span>
              <span className={`text-sm font-bold tabular-nums ${result.profit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                {money(result.profit, true)}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <MiniStat label="ROI" value={`${result.roi >= 0 ? '+' : ''}${result.roi.toFixed(1)}%`} />
              <MiniStat label="Per Lead" value={money(result.profitPerLead, true)} />
              <MiniStat label="Per Delivery" value={money(result.profitPerDelivered, true)} />
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
