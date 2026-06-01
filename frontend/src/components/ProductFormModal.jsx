import { ImagePlus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getApiErrorMessage, getImageUrl, productApi } from '../api/api.js';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  stock: '',
  imageUrl: '',
};

export default function ProductFormModal({ product, open, onClose, onSaved }) {
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const previewUrl = filePreview || (form.imageUrl ? getImageUrl(form.imageUrl) : '');

  useEffect(() => {
    if (!file) {
      setFilePreview('');
      return undefined;
    }

    const objectUrl = URL.createObjectURL(file);
    setFilePreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  useEffect(() => {
    if (!open) return;
    setForm(
      product
        ? {
            name: product.name || '',
            description: product.description || '',
            price: product.price || '',
            stock: product.stock || '',
            imageUrl: product.imageUrl || '',
          }
        : emptyForm,
    );
    setFile(null);
    setError('');
  }, [open, product]);

  if (!open) return null;

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      let imageUrl = form.imageUrl;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadResponse = await productApi.uploadImage(formData);
        imageUrl = uploadResponse.data.imageUrl;
      }

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        imageUrl,
      };

      if (product?.id) {
        await productApi.updateProduct(product.id, payload);
      } else {
        await productApi.createProduct(payload);
      }

      onSaved();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to save product.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/40 px-4 py-6">
      <div className="max-h-full w-full max-w-2xl overflow-auto rounded-xl bg-white shadow-2xl shadow-neutral-950/20">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-neutral-950">{product ? 'Edit product' : 'Add product'}</h2>
            <p className="mt-1 text-sm text-neutral-500">Choose a product image and fill in the product details.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-5 p-6">
          {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

          <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
            <div>
              <label className="text-sm font-medium text-neutral-700" htmlFor="image">
                Product image
              </label>
              <label
                htmlFor="image"
                className="mt-2 flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-300 bg-neutral-50 transition hover:border-indigo-300 hover:bg-indigo-50"
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-neutral-400">
                    <ImagePlus className="h-9 w-9" />
                    <span className="text-sm font-medium">Upload image</span>
                  </div>
                )}
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={(event) => setFile(event.target.files?.[0] || null)}
                className="sr-only"
              />
              <p className="mt-3 text-xs leading-5 text-neutral-500">
                {file ? file.name : product?.imageUrl ? 'Current image will be kept unless you choose a new file.' : 'JPG, PNG, or WebP image.'}
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-neutral-700" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  required
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-neutral-700" htmlFor="price">
                    Price
                  </label>
                  <input
                    id="price"
                    required
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.price}
                    onChange={(event) => updateField('price', event.target.value)}
                    className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700" htmlFor="stock">
                    Stock
                  </label>
                  <input
                    id="stock"
                    required
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(event) => updateField('stock', event.target.value)}
                    className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  required
                  rows="5"
                  value={form.description}
                  onChange={(event) => updateField('description', event.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-neutral-300"
            >
              {loading ? 'Saving...' : 'Save product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
