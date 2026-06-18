import { useState, useCallback, useEffect, useRef } from "react";
import type { Cart } from "@/types/products";

const STORAGE_KEY = "guest_cart";

const emptyCart: Cart = {
  cartId: null,
  userId: "",
  items: [],
  total: 0,
};

type AddToCartInput =
  | {
      itemType: "PRODUCT";
      productId: string;
      productName: string;
      price: number;
      productImage: string | null;
    }
  | {
      itemType: "BUNDLE";
      bundleId: string;
      bundleName: string;
      price: number;
    };

export function useCart() {
  const [cart, setCart] = useState<Cart>(emptyCart);
  const [loading] = useState(false);
  const isAddingRef = useRef(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setCart(JSON.parse(stored));
  }, []);

  const persist = (data: Cart) => {
    setCart(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const addToCart = useCallback(async (input: AddToCartInput, quantity = 1) => {
    if (isAddingRef.current) return false;
    isAddingRef.current = true;

    try {
      setCart((prev) => {
        const existing = prev.items.find((i) =>
          input.itemType === "PRODUCT"
            ? i.productId === input.productId
            : i.bundleId === input.bundleId,
        );

        let updatedItems;

        if (existing) {
          updatedItems = prev.items.map((item) =>
            (input.itemType === "PRODUCT"
              ? item.productId === input.productId
              : item.bundleId === input.bundleId)
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                  subtotal: (item.quantity + quantity) * item.price,
                }
              : item,
          );
        } else {
          const newItem =
            input.itemType === "PRODUCT"
              ? {
                  id: input.productId,
                  itemType: "PRODUCT" as const,
                  productId: input.productId,
                  productName: input.productName,
                  productImage: input.productImage,
                  bundleId: null,
                  bundleName: null,
                  price: input.price,
                  quantity,
                  subtotal: input.price * quantity,
                }
              : {
                  id: input.bundleId,
                  itemType: "BUNDLE" as const,
                  productId: null,
                  productName: null,
                  productImage: null,
                  bundleId: input.bundleId,
                  bundleName: input.bundleName,
                  price: input.price,
                  quantity,
                  subtotal: input.price * quantity,
                };

          updatedItems = [...prev.items, newItem];
        }

        const total = updatedItems.reduce(
          (acc, item) => acc + item.quantity * item.price,
          0,
        );

        const newCart = { ...prev, items: updatedItems, total };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newCart));
        return newCart;
      });

      return true;
    } finally {
      isAddingRef.current = false;
    }
  }, []);

  const updateCartItem = useCallback(
    async (itemId: string, quantity: number) => {
      if (quantity < 1) return false;

      setCart((prev) => {
        const updatedItems = prev.items.map((item) =>
          item.id === itemId
            ? { ...item, quantity, subtotal: quantity * item.price }
            : item,
        );
        const total = updatedItems.reduce(
          (acc, item) => acc + item.quantity * item.price,
          0,
        );
        const newCart = { ...prev, items: updatedItems, total };
        persist(newCart);
        return newCart;
      });

      return true;
    },
    [],
  );

  const removeCartItem = useCallback(async (itemId: string) => {
    setCart((prev) => {
      const updatedItems = prev.items.filter((i) => i.id !== itemId);
      const total = updatedItems.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0,
      );
      const newCart = { ...prev, items: updatedItems, total };
      persist(newCart);
      return newCart;
    });
    return true;
  }, []);

  // ← new
  const clearCart = useCallback(() => {
    persist(emptyCart);
  }, []);

  const count = cart.items.reduce((acc, i) => acc + i.quantity, 0);

  return {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    count,
  };
}