import { Edit3, Plus, Search, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { productApi } from '../api/api.js';
import Pagination from '../components/Pagination.jsx';
import ProductFormModal from '../components/ProductFormModal.jsx';
import { EmptyState, ErrorBanner, LoadingState } from '../components/StatusMessage.jsx';
import { formatCurrency } from '../utils/formatters.js';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await productApi.getProducts({ page, size: 10, keyword });
      setProducts(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load products.');
    } finally {
      setLoading(false);
    }
  }, [page, keyword]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const submitSearch = (event) => {
    event.preventDefault();
    setPage(0);
    setKeyword(search.trim());
  };

  const openCreate = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const deleteProduct = async (product) => {
    const confirmed = window.confirm(`Delete ${product.name}?`);
    if (!confirmed) return;

    setError('');
    try {
      await productApi.deleteProduct(product.id);
      await loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete product.');
    }
  };

  const handleSaved = async () => {
    setModalOpen(false);
    setEditingProduct(null);
    await loadProducts();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-indigo-500">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-neutral-950">Product management</h1>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" />
          Add product
        </button>
      </div>

      <form onSubmit={submitSearch} className="flex max-w-md items-center gap-2 rounded-xl border border-gray-200 bg-white p-2">
        <Search className="ml-2 h-5 w-5 text-neutral-400" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search products"
          className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
        />
        <button type="submit" className="rounded-lg bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500">
          Search
        </button>
      </form>

      <ErrorBanner message={error} />

      {loading ? (
        <LoadingState label="Loading products..." />
      ) : products.length === 0 ? (
        <EmptyState title="No products yet" message="Create your first product to start accepting orders." />
      ) : (
        <div className="space-y-5">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-gray-200 bg-neutral-50 text-xs font-semibold uppercase tracking-normal text-neutral-500">
                  <tr>
                    <th className="px-5 py-4">Product</th>
                    <th className="px-5 py-4">Price</th>
                    <th className="px-5 py-4">Stock</th>
                    <th className="px-5 py-4">Image URL</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-neutral-50">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-neutral-950">{product.name}</p>
                        <p className="mt-1 line-clamp-1 max-w-sm text-neutral-500">{product.description}</p>
                      </td>
                      <td className="px-5 py-4 font-medium text-neutral-800">{formatCurrency(product.price)}</td>
                      <td className="px-5 py-4 text-neutral-700">{product.stock}</td>
                      <td className="px-5 py-4 text-neutral-500">
                        <span className="block max-w-xs truncate">{product.imageUrl || 'None'}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(product)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950"
                            aria-label={`Edit ${product.name}`}
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteProduct(product)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-neutral-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            aria-label={`Delete ${product.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      <ProductFormModal product={editingProduct} open={modalOpen} onClose={() => setModalOpen(false)} onSaved={handleSaved} />
    </div>
  );
}
