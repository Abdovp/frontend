import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import DateRangePicker from '../../components/admin/DateRangePicker';
import OrderPreview from '../../components/admin/OrderPreview';
import OrdersTable from '../../components/admin/OrdersTable';
import { fetchAdminOrder, fetchAdminOrders } from '../../lib/admin/api';
import { defaultDateRange } from '../../lib/admin/format';
import type { AdminOrderDetail, AdminOrderSummary, OrderStatus } from '../../lib/admin/types';
import { ORDER_STATUS_LABELS } from '../../lib/admin/types';

export default function AdminOrdersPage() {
  const initial = defaultDateRange();
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState<AdminOrderSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderDetail | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    fetchAdminOrders({
      page,
      limit: 20,
      status: status || undefined,
      search: search.trim() || undefined,
      from,
      to,
    })
      .then((data) => {
        if (cancelled) return;
        setOrders(data.items);
        setTotal(data.total);
        setPages(data.pages);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load orders');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, status, search, from, to]);

  async function openOrder(orderId: number) {
    try {
      const order = await fetchAdminOrder(orderId);
      setSelectedOrder(order);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load order');
    }
  }

  function handleOrderUpdated(order: AdminOrderDetail) {
    setSelectedOrder(order);
    setOrders((current) => current.map((row) => (row.id === order.id ? { ...row, status: order.status, total: order.total } : row)));
  }

  return (
    <AdminLayout title="Orders">
      <div className="space-y-6">
        <DateRangePicker from={from} to={to} onChange={(nextFrom, nextTo) => { setFrom(nextFrom); setTo(nextTo); setPage(1); }} />

        <div className="admin-panel grid gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-center">
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by name, phone, or event id..."
            className="admin-input"
          />
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            className="admin-input lg:w-44"
          >
            <option value="">All statuses</option>
            {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((value) => (
              <option key={value} value={value}>
                {ORDER_STATUS_LABELS[value]}
              </option>
            ))}
          </select>
          <p className="text-sm font-medium text-admin-muted">{total.toLocaleString('en-US')} orders</p>
        </div>

        {loading ? <div className="admin-panel p-12 text-center text-sm text-admin-muted">Loading orders...</div> : null}
        {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        {!loading ? <OrdersTable orders={orders} onSelect={openOrder} /> : null}

        {pages > 1 ? (
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
              className="admin-btn-secondary disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-admin-muted">
              {page} / {pages}
            </span>
            <button
              type="button"
              disabled={page >= pages}
              onClick={() => setPage((current) => current + 1)}
              className="admin-btn-secondary disabled:opacity-40"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>

      {selectedOrder ? (
        <OrderPreview
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdated={handleOrderUpdated}
        />
      ) : null}
    </AdminLayout>
  );
}
