import { ChevronDown, LayoutDashboard, Package, ShoppingCart, Store } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950'
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount } = useCart();
  const isAdmin = location.pathname.startsWith('/admin');

  const switchMode = (mode) => {
    setOpen(false);
    navigate(mode === 'admin' ? '/admin/products' : '/');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to={isAdmin ? '/admin/products' : '/'} className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-950 text-white">
            <Store className="h-5 w-5" />
          </span>
          <span className="text-base font-semibold tracking-normal text-neutral-950">OrderSystem</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {isAdmin ? (
            <>
              <NavLink to="/admin/products" className={linkClass}>
                Products
              </NavLink>
              <NavLink to="/admin/orders" className={linkClass}>
                Orders
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/" className={linkClass}>
                Products
              </NavLink>
              <NavLink to="/cart" className={linkClass}>
                Cart
              </NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {!isAdmin && (
            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-500 px-1 text-xs font-semibold text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          )}

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50"
            >
              {isAdmin ? <LayoutDashboard className="h-4 w-4" /> : <Package className="h-4 w-4" />}
              <span className="hidden sm:inline">{isAdmin ? 'Admin Mode' : 'User Mode'}</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl border border-gray-200 bg-white p-1 shadow-lg shadow-neutral-950/10">
                <button
                  type="button"
                  onClick={() => switchMode('user')}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-neutral-700 transition hover:bg-neutral-100"
                >
                  <Package className="h-4 w-4" />
                  User Mode
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('admin')}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-neutral-700 transition hover:bg-neutral-100"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Admin Mode
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
