import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../api/api.js';
import { formatCurrency } from '../utils/formatters.js';

export default function ProductCard({ product, onAdd }) {
  const outOfStock = Number(product.stock) <= 0;

  return (
    <article className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm shadow-neutral-950/5 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-neutral-950/10">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-[4/3] bg-neutral-100">
          {product.imageUrl ? (
            <img
              src={getImageUrl(product.imageUrl)}
              alt={product.name}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-medium text-neutral-400">
              No image
            </div>
          )}
        </div>
      </Link>
      <div className="space-y-4 p-5">
        <div>
          <Link to={`/product/${product.id}`} className="line-clamp-1 text-base font-semibold text-neutral-950">
            {product.name}
          </Link>
          <p className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-neutral-600">{product.description}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-neutral-950">{formatCurrency(product.price)}</p>
            <p className="text-xs font-medium text-neutral-500">{outOfStock ? 'Out of stock' : `${product.stock} in stock`}</p>
          </div>
          <button
            type="button"
            onClick={() => onAdd(product)}
            disabled={outOfStock}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-950 text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
