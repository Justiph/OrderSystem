import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getImageUrl, productApi } from '../api/api.js';
import { ErrorBanner, LoadingState } from '../components/StatusMessage.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatCurrency } from '../utils/formatters.js';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await productApi.getProduct(id);
        setProduct(response.data);
        setQuantity(response.data.stock > 0 ? 1 : 0);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load this product.');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const addSelected = () => {
    const result = addToCart(product, quantity);
    setNotice(result.message);
  };

  if (loading) return <LoadingState label="Loading product..." />;

  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition hover:text-neutral-950">
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>
      <ErrorBanner message={error} />

      {product && (
        <section className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-neutral-100">
            {product.imageUrl ? (
              <img src={getImageUrl(product.imageUrl)} alt={product.name} className="aspect-[4/3] w-full object-cover" />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center text-sm font-medium text-neutral-400">No image</div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-normal text-indigo-500">
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-normal text-neutral-950 sm:text-4xl">{product.name}</h1>
              <p className="mt-4 text-base leading-7 text-neutral-600">{product.description}</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-3xl font-semibold text-neutral-950">{formatCurrency(product.price)}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="flex h-11 items-center rounded-lg border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    disabled={quantity <= 1}
                    className="flex h-10 w-10 items-center justify-center text-neutral-600 transition hover:text-neutral-950 disabled:opacity-30"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-semibold text-neutral-950">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))}
                    disabled={quantity >= product.stock}
                    className="flex h-10 w-10 items-center justify-center text-neutral-600 transition hover:text-neutral-950 disabled:opacity-30"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={addSelected}
                  disabled={product.stock <= 0}
                  className="inline-flex h-11 items-center gap-2 rounded-lg bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to cart
                </button>
              </div>
              {notice && <p className="mt-4 text-sm font-medium text-indigo-600">{notice}</p>}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
