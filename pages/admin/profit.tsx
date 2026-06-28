import { useMemo, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import MetricCard from '../../components/admin/MetricCard';
import { formatMad, formatPercent } from '../../lib/admin/format';

type CalculatorInputProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  min?: number;
  step?: number;
  hint?: string;
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

function CalculatorInput({
  label,
  value,
  onChange,
  suffix,
  min = 0,
  step = 1,
  hint,
}: CalculatorInputProps) {
  return (
    <label className="block">
      <span className="admin-label">{label}</span>
      <div className="relative">
        <input
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className={`admin-input ${suffix ? 'pr-14' : ''}`}
        />
        {suffix ? (
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs font-semibold text-admin-muted">
            {suffix}
          </span>
        ) : null}
      </div>
      {hint ? <span className="mt-1 block text-xs text-admin-muted">{hint}</span> : null}
    </label>
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
      <div className="space-y-6">
        <div className="admin-panel">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-admin-accent">Profit tools</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Breakeven & profit calculator</h1>
              <p className="mt-2 max-w-3xl text-sm text-admin-muted">
                Model your real COD economics from leads, confirmation rate, delivery rate, ad cost, product cost, and
                the fixed 10dh fees for confirmed, returned, and canceled leads.
              </p>
            </div>
            <div className="rounded-2xl bg-admin-bg px-4 py-3 text-sm text-admin-muted">
              Fixed fees: {CONFIRMED_LEAD_COST}dh confirmed · {RETURN_COST}dh return · {CANCELED_LEAD_COST}dh canceled
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Expected profit"
            value={money(result.profit)}
            hint={`${money(result.profitPerLead)} profit per lead`}
            icon="trending"
            primary={result.profit >= 0}
          />
          <MetricCard
            label="Breakeven CPL"
            value={money(result.maxBreakevenCpl)}
            hint={`Current CPL: ${money(costPerLead)}`}
            icon="barChart"
          />
          <MetricCard
            label="Required AOV"
            value={money(result.requiredAov)}
            hint="Minimum average order value to break even"
            icon="cart"
          />
          <MetricCard
            label="ROAS"
            value={`${result.roas.toFixed(2)}x`}
            hint={`Margin: ${formatPercent(result.margin)}`}
            icon="chart"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="admin-panel">
            <h2 className="admin-panel__title">1) Breakeven calculator</h2>
            <p className="mt-1 text-sm text-admin-muted">
              Use this to know your maximum CPL and minimum AOV before ads start losing money.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <CalculatorInput label="Cost per lead" value={costPerLead} onChange={setCostPerLead} suffix="dh" />
              <CalculatorInput label="Confirmation rate" value={confirmationRate} onChange={setConfirmationRate} suffix="%" />
              <CalculatorInput label="Delivery rate after confirmation" value={deliveryRate} onChange={setDeliveryRate} suffix="%" />
              <CalculatorInput label="Average order value" value={averageOrderValue} onChange={setAverageOrderValue} suffix="dh" />
              <CalculatorInput label="Product cost / delivered order" value={productCost} onChange={setProductCost} suffix="dh" />
              <CalculatorInput label="Shipping cost / delivered order" value={deliveryCost} onChange={setDeliveryCost} suffix="dh" />
              <CalculatorInput
                label="Fixed overhead"
                value={fixedOverhead}
                onChange={setFixedOverhead}
                suffix="dh"
                hint="Optional: rent, tools, salary, creatives, etc."
              />
              <CalculatorInput label="Leads used for overhead split" value={leads} onChange={setLeads} />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-admin-bg p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-admin-muted">Max CPL</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{money(result.maxBreakevenCpl)}</p>
              </div>
              <div className="rounded-2xl bg-admin-bg p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-admin-muted">CPL gap</p>
                <p className={`mt-2 text-2xl font-bold ${result.maxBreakevenCpl >= costPerLead ? 'text-emerald-600' : 'text-red-600'}`}>
                  {money(result.maxBreakevenCpl - costPerLead)}
                </p>
              </div>
              <div className="rounded-2xl bg-admin-bg p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-admin-muted">Breakeven leads</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {result.breakevenLeads ? Math.ceil(result.breakevenLeads).toLocaleString('en-US') : 'N/A'}
                </p>
              </div>
            </div>
          </section>

          <section className="admin-panel">
            <h2 className="admin-panel__title">2) Profit calculator</h2>
            <p className="mt-1 text-sm text-admin-muted">
              Forecast revenue, costs, profit, and operational volume for a campaign.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <CalculatorInput label="Leads" value={leads} onChange={setLeads} />
              <CalculatorInput label="Cost per lead" value={costPerLead} onChange={setCostPerLead} suffix="dh" />
              <CalculatorInput label="Confirmation rate" value={confirmationRate} onChange={setConfirmationRate} suffix="%" />
              <CalculatorInput label="Delivery rate" value={deliveryRate} onChange={setDeliveryRate} suffix="%" />
              <CalculatorInput label="Average order value" value={averageOrderValue} onChange={setAverageOrderValue} suffix="dh" />
              <CalculatorInput label="Product cost" value={productCost} onChange={setProductCost} suffix="dh" />
              <CalculatorInput label="Delivery cost" value={deliveryCost} onChange={setDeliveryCost} suffix="dh" />
              <CalculatorInput label="Fixed overhead" value={fixedOverhead} onChange={setFixedOverhead} suffix="dh" />
            </div>
          </section>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <section className="admin-panel xl:col-span-2">
            <h2 className="admin-panel__title">Forecast breakdown</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="admin-table min-w-full">
                <tbody className="divide-y divide-admin-bg">
                  <tr>
                    <td>Confirmed leads</td>
                    <td className="font-semibold tabular-nums">{result.confirmed.toFixed(1)}</td>
                    <td>{money(result.confirmedFees)} confirmed fees</td>
                  </tr>
                  <tr>
                    <td>Delivered orders</td>
                    <td className="font-semibold tabular-nums">{result.delivered.toFixed(1)}</td>
                    <td>{formatPercent(result.deliveredRateFromLeads)} delivered from total leads</td>
                  </tr>
                  <tr>
                    <td>Returns</td>
                    <td className="font-semibold tabular-nums">{result.returns.toFixed(1)}</td>
                    <td>{money(result.returnFees)} return fees</td>
                  </tr>
                  <tr>
                    <td>Canceled / unconfirmed leads</td>
                    <td className="font-semibold tabular-nums">{result.canceled.toFixed(1)}</td>
                    <td>{money(result.cancelFees)} cancel fees</td>
                  </tr>
                  <tr>
                    <td>Ad spend</td>
                    <td className="font-semibold tabular-nums">{money(result.adSpend)}</td>
                    <td>{leads.toLocaleString('en-US')} leads × {money(costPerLead)}</td>
                  </tr>
                  <tr>
                    <td>Product + shipping costs</td>
                    <td className="font-semibold tabular-nums">{money(result.productSpend + result.shippingSpend)}</td>
                    <td>{money(productCost)} product + {money(deliveryCost)} shipping per delivered order</td>
                  </tr>
                  <tr>
                    <td>Total costs</td>
                    <td className="font-semibold tabular-nums">{money(result.totalCosts)}</td>
                    <td>Ads + product + shipping + lead fees + overhead</td>
                  </tr>
                  <tr>
                    <td>Revenue</td>
                    <td className="font-semibold tabular-nums">{money(result.revenue)}</td>
                    <td>{result.delivered.toFixed(1)} delivered × {money(averageOrderValue)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="admin-panel">
            <h2 className="admin-panel__title">What to watch</h2>
            <ul className="mt-5 space-y-3 text-sm text-slate-700">
              <li>
                <span className="font-semibold text-slate-900">Profit per delivered order:</span>{' '}
                {money(result.profitPerDelivered)}
              </li>
              <li>
                <span className="font-semibold text-slate-900">Contribution after ads / lead:</span>{' '}
                {money(result.contributionAfterAdsPerLead)}
              </li>
              <li>
                <span className="font-semibold text-slate-900">Improve fastest by:</span> raising confirmation rate,
                delivery rate, AOV, or lowering product/shipping cost.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Add later if needed:</span> call-center salary, packaging,
                payment/COD fees, creative costs, refunds, and stock loss.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
