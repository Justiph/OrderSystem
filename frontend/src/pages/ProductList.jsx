import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { productApi } from '../api/api.js';
import Pagination from '../components/Pagination.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { EmptyState, ErrorBanner, LoadingState } from '../components/StatusMessage.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await productApi.getProducts({ page, size: 8, keyword });
        if (!active) return;
        setProducts(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);
      } catch (err) {
        if (active) setError(err.response?.data?.message || 'Unable to load products.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProducts();
    return () => {
      active = false;
    };
  }, [page, keyword]);

  const submitSearch = (event) => {
    event.preventDefault();
    setPage(0);
    setKeyword(search.trim());
  };

  const handleAdd = (product) => {
    const result = addToCart(product);
    setNotice(result.message);
    window.setTimeout(() => setNotice(''), 2200);
  };

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-indigo-500">Product catalog</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-neutral-950 sm:text-4xl">Simple ordering, cleanly done.</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600">
            Browse available products, add items to cart, and place a customer order in a few focused steps.
          </p>
        </div>
        <form onSubmit={submitSearch} className="flex w-full max-w-md items-center gap-2 rounded-xl border border-gray-200 bg-white p-2">
          <Search className="ml-2 h-5 w-5 text-neutral-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products"
            className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
          />
          <button
            type="submit"
            className="rounded-lg bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Search
          </button>
        </form>
      </section>

      <ErrorBanner message={error} />
      {notice && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-700">
          {notice}
        </div>
      )}

      {loading ? (
        <LoadingState label="Loading products..." />
      ) : products.length === 0 ? (
        <EmptyState title="No products found" message="Try a different keyword or add products from Admin Mode." />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={handleAdd} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
