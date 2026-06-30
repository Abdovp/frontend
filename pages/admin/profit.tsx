import { useMemo, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { formatMad, formatPercent } from '../../lib/admin/format';

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

function money(value: number): string {
  return formatMad(safeNumber(value));
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

function BreakdownCard({
  label,
  value,
  detail,
  highlight,
  tone = 'default',
}: {
  label: string;
  value: string;
  detail?: string;
  highlight?: boolean;
  tone?: 'default' | 'positive' | 'negative';
}) {
  const toneClass =
    tone === 'positive'
      ? 'bg-emerald-50 ring-1 ring-emerald-100'
      : tone === 'negative'
        ? 'bg-red-50 ring-1 ring-red-100'
        : highlight
          ? 'bg-admin-accent text-white ring-1 ring-admin-accent'
          : 'bg-admin-bg';

  const labelClass = highlight ? 'text-white/70' : 'text-admin-muted';
  const valueClass = highlight
    ? 'text-white'
    : tone === 'positive'
      ? 'text-emerald-700'
      : tone === 'negative'
        ? 'text-red-700'
        : 'text-slate-900';
  const detailClass = highlight ? 'text-white/65' : 'text-admin-muted';

  return (
    <div className={`rounded-2xl p-4 ${toneClass}`}>
      <p className={`text-xs font-semibold uppercase tracking-wide ${labelClass}`}>{label}</p>
      <p className={`mt-2 text-2xl font-bold tabular-nums tracking-tight ${valueClass}`}>{value}</p>
      {detail ? <p className={`mt-1 text-xs ${detailClass}`}>{detail}</p> : null}
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
    const totalCosts =
      adSpend + productSpend + shippingSpend + confirmedFees + returnFees + cancelFees + fixedOverhead;
    const profit = revenue - totalCosts;
    const deliveredRateFromLeads = leads > 0 ? delivered / leads : 0;
    const profitPerDelivered = delivered > 0 ? profit / delivered : 0;
    const profitPerLead = leads > 0 ? profit / leads : 0;
    const roas = adSpend > 0 ? revenue / adSpend : 0;
    const margin = revenue > 0 ? profit / revenue : 0;
    const contributionBeforeAdsPerLead =
      confirmation * delivery * (averageOrderValue - productCost - deliveryCost) -
      confirmation * CONFIRMED_LEAD_COST -
      confirmation * (1 - delivery) * RETURN_COST -
      (1 - confirmation) * CANCELED_LEAD_COST;
    const maxBreakevenCpl = contributionBeforeAdsPerLead;
    const requiredAov =
      confirmation * delivery > 0
        ? (costPerLead +
            confirmation * CONFIRMED_LEAD_COST +
            confirmation * (1 - delivery) * RETURN_COST +
            (1 - confirmation) * CANCELED_LEAD_COST +
            confirmation * delivery * (productCost + deliveryCost) +
            (leads > 0 ? fixedOverhead / leads : 0)) /
          (confirmation * delivery)
        : 0;
    const contributionAfterAdsPerLead = contributionBeforeAdsPerLead - costPerLead;
    const breakevenLeads =
      fixedOverhead > 0 && contributionAfterAdsPerLead > 0
        ? fixedOverhead / contributionAfterAdsPerLead
        : null;
    const cplGap = maxBreakevenCpl - costPerLead;
    const cplHealthy = cplGap >= 0;

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
      deliveredRateFromLeads,
      profitPerDelivered,
      profitPerLead,
      roas,
      margin,
      maxBreakevenCpl,
      requiredAov,
      contributionAfterAdsPerLead,
      breakevenLeads,
      cplGap,
      cplHealthy,
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

  return (
    <AdminLayout title="Profit Calculator">
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Breakeven & profit calculator</h1>
          <p className="mt-1 text-sm text-admin-muted">
            Fixed fees: {CONFIRMED_LEAD_COST}dh confirmed · {RETURN_COST}dh return · {CANCELED_LEAD_COST}dh canceled
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="admin-panel">
            <h2 className="admin-panel__title">Inputs</h2>
            <div className="mt-5 space-y-6">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-admin-muted">Campaign</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <CalculatorInput label="Leads" value={leads} onChange={setLeads} />
                  <CalculatorInput label="Cost per lead" value={costPerLead} onChange={setCostPerLead} suffix="dh" />
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-admin-muted">Rates</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <CalculatorInput label="Confirmation rate" value={confirmationRate} onChange={setConfirmationRate} suffix="%" />
                  <CalculatorInput label="Delivery rate" value={deliveryRate} onChange={setDeliveryRate} suffix="%" />
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-admin-muted">Unit economics</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <CalculatorInput label="Average order value" value={averageOrderValue} onChange={setAverageOrderValue} suffix="dh" />
                  <CalculatorInput label="Product cost" value={productCost} onChange={setProductCost} suffix="dh" />
                  <CalculatorInput label="Delivery cost" value={deliveryCost} onChange={setDeliveryCost} suffix="dh" />
                  <CalculatorInput label="Fixed overhead" value={fixedOverhead} onChange={setFixedOverhead} suffix="dh" />
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <BreakdownCard
              label="Expected profit"
              value={money(result.profit)}
              detail={`${money(result.profitPerLead)} per lead`}
              tone={result.profit >= 0 ? 'positive' : 'negative'}
            />

            <div className="grid gap-3">
              <BreakdownCard label="Breakeven CPL" value={money(result.maxBreakevenCpl)} />
              <BreakdownCard
                label="CPL gap"
                value={money(result.cplGap)}
                detail={result.cplHealthy ? 'Under breakeven CPL' : 'Above breakeven CPL'}
                tone={result.cplHealthy ? 'positive' : 'negative'}
              />
              <BreakdownCard label="Required AOV" value={money(result.requiredAov)} />
              <BreakdownCard label="ROAS" value={`${result.roas.toFixed(2)}x`} detail={`Margin ${formatPercent(result.margin)}`} />
              <BreakdownCard
                label="Breakeven leads"
                value={result.breakevenLeads ? Math.ceil(result.breakevenLeads).toLocaleString('en-US') : 'N/A'}
              />
            </div>
          </aside>
        </div>

        <section className="admin-panel">
          <h2 className="admin-panel__title">Forecast breakdown</h2>
          <p className="mt-1 text-sm text-admin-muted">Volume, fees, costs, and revenue from your current inputs.</p>

          <div className="mt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-admin-muted">Volume</p>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <BreakdownCard label="Confirmed leads" value={result.confirmed.toFixed(1)} detail={`${money(result.confirmedFees)} fees`} />
              <BreakdownCard label="Delivered orders" value={result.delivered.toFixed(1)} detail={`${formatPercent(result.deliveredRateFromLeads)} from leads`} />
              <BreakdownCard label="Returns" value={result.returns.toFixed(1)} detail={`${money(result.returnFees)} fees`} />
              <BreakdownCard label="Canceled leads" value={result.canceled.toFixed(1)} detail={`${money(result.cancelFees)} fees`} />
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-admin-muted">Money</p>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <BreakdownCard label="Ad spend" value={money(result.adSpend)} detail={`${leads} leads × ${money(costPerLead)}`} />
              <BreakdownCard label="Product + shipping" value={money(result.productSpend + result.shippingSpend)} />
              <BreakdownCard label="Total costs" value={money(result.totalCosts)} />
              <BreakdownCard label="Revenue" value={money(result.revenue)} detail={`${result.delivered.toFixed(1)} delivered × ${money(averageOrderValue)}`} />
              <BreakdownCard label="Profit per delivered" value={money(result.profitPerDelivered)} />
              <BreakdownCard
                label="Net profit"
                value={money(result.profit)}
                tone={result.profit >= 0 ? 'positive' : 'negative'}
              />
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
