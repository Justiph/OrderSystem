import { CheckCircle2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../api/api.js';
import { EmptyState, ErrorBanner } from '../components/StatusMessage.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatCurrency } from '../utils/formatters.js';

export default function Cart() {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submitOrder = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await orderApi.createOrder({
        customerName: customerName.trim(),
        items: items.map((item) => ({ productId: Number(item.id), quantity: Number(item.quantity) })),
      });
      clearCart();
      setCustomerName('');
      setSuccess('Order placed successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-normal text-indigo-500">Checkout</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-neutral-950">Shopping cart</h1>
      </div>

      <ErrorBanner message={error} />
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          {success}
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          message="Add products from the catalog before checkout."
          action={
            <Link to="/" className="inline-flex rounded-lg bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500">
              Browse products
            </Link>
          }
        />
      ) : (
        <form onSubmit={submitOrder} className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col gap-4 border-b border-gray-200 p-5 last:border-b-0 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-base font-semibold text-neutral-950">{item.name}</h2>
                  <p className="mt-1 text-sm text-neutral-500">{formatCurrency(item.price)} each</p>
                </div>
                <input
                  type="number"
                  min="1"
                  max={item.stock}
                  value={item.quantity}
                  onChange={(event) => updateQuantity(item.id, event.target.value)}
                  className="h-10 w-24 rounded-lg border border-gray-200 px-3 text-sm font-medium outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                />
                <p className="w-28 text-left text-base font-semibold text-neutral-950 sm:text-right">
                  {formatCurrency(Number(item.price) * item.quantity)}
                </p>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-neutral-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-xl border border-gray-200 bg-neutral-50 p-5">
            <h2 className="text-lg font-semibold text-neutral-950">Order summary</h2>
            <label className="mt-5 block text-sm font-medium text-neutral-700" htmlFor="customerName">
              Customer name
            </label>
            <input
              id="customerName"
              required
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              className="mt-2 h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              placeholder="Enter customer name"
            />
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-5">
              <span className="text-sm font-medium text-neutral-600">Total</span>
              <span className="text-2xl font-semibold text-neutral-950">{formatCurrency(total)}</span>
            </div>
            <button
              type="submit"
              disabled={loading || !customerName.trim()}
              className="mt-6 w-full rounded-lg bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-neutral-300"
            >
              {loading ? 'Placing order...' : 'Place order'}
            </button>
          </aside>
        </form>
      )}
    </div>
  );
}
