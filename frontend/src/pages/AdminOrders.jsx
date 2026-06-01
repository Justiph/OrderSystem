import { Eye, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { orderApi } from '../api/api.js';
import { EmptyState, ErrorBanner, LoadingState } from '../components/StatusMessage.jsx';
import { formatCurrency, formatDate } from '../utils/formatters.js';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await orderApi.getOrders();
      setOrders(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const viewOrder = async (orderId) => {
    setDetailLoading(true);
    setError('');
    try {
      const response = await orderApi.getOrder(orderId);
      setSelectedOrder(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load order details.');
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-indigo-500">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-neutral-950">Order management</h1>
        </div>
        <button
          type="button"
          onClick={loadOrders}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <ErrorBanner message={error} />

      {loading ? (
        <LoadingState label="Loading orders..." />
      ) : orders.length === 0 ? (
        <EmptyState title="No orders yet" message="Orders submitted from checkout will appear here." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-gray-200 bg-neutral-50 text-xs font-semibold uppercase tracking-normal text-neutral-500">
                  <tr>
                    <th className="px-5 py-4">Order</th>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Total</th>
                    <th className="px-5 py-4">Created</th>
                    <th className="px-5 py-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-50">
                      <td className="px-5 py-4 font-semibold text-neutral-950">#{order.id}</td>
                      <td className="px-5 py-4 text-neutral-700">{order.customerName}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">{order.status}</span>
                      </td>
                      <td className="px-5 py-4 font-medium text-neutral-900">{formatCurrency(order.totalPrice)}</td>
                      <td className="px-5 py-4 text-neutral-500">{formatDate(order.createdAt)}</td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => viewOrder(order.id)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950"
                            aria-label={`View order ${order.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="h-fit rounded-xl border border-gray-200 bg-neutral-50 p-5">
            <h2 className="text-lg font-semibold text-neutral-950">Order details</h2>
            {detailLoading ? (
              <p className="mt-4 text-sm text-neutral-500">Loading details...</p>
            ) : selectedOrder ? (
              <div className="mt-5 space-y-5">
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-neutral-950">#{selectedOrder.id}</p>
                  <p className="text-neutral-600">{selectedOrder.customerName}</p>
                  <p className="text-neutral-500">{formatDate(selectedOrder.createdAt)}</p>
                </div>
                <div className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
                  {(selectedOrder.items || []).map((item) => (
                    <div key={item.id} className="p-4">
                      <p className="font-medium text-neutral-950">{item.productName}</p>
                      <p className="mt-1 text-sm text-neutral-500">
                        {item.quantity} x {formatCurrency(item.price)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <span className="text-sm font-medium text-neutral-600">Total</span>
                  <span className="text-xl font-semibold text-neutral-950">{formatCurrency(selectedOrder.totalPrice)}</span>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-neutral-500">Select an order to inspect its line items.</p>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
