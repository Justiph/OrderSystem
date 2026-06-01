import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addToCart = (product, quantity = 1) => {
    if (!product || product.stock <= 0) return { ok: false, message: 'This product is out of stock.' };

    let result = { ok: true, message: 'Added to cart.' };
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      const currentQuantity = existing?.quantity ?? 0;
      const nextQuantity = currentQuantity + quantity;

      if (nextQuantity > product.stock) {
        result = { ok: false, message: `Only ${product.stock} available in stock.` };
        return current;
      }

      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: nextQuantity, stock: product.stock } : item,
        );
      }

      return [...current, { ...product, quantity }];
    });

    return result;
  };

  const updateQuantity = (productId, quantity) => {
    setItems((current) =>
      current
        .map((item) => {
          if (item.id !== productId) return item;
          const safeQuantity = Math.max(1, Math.min(Number(quantity) || 1, item.stock));
          return { ...item, quantity: safeQuantity };
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (productId) => {
    setItems((current) => current.filter((item) => item.id !== productId));
  };

  const clearCart = () => setItems([]);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0),
    [items],
  );

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const value = {
    items,
    itemCount,
    total,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
