import { useState, useCallback, useEffect, useRef } from "react";
import type { Cart } from "@/types/products";

const STORAGE_KEY = "guest_cart";

const emptyCart: Cart = {
  cartId: null,
  userId: "",
  items: [],
  total: 0,
};

type AddToCartInput = {
  productId: string;
  productName: string;
  price: number;
  productImage: string;
};

export function useCart() {
  const [cart, setCart] = useState<Cart>(emptyCart);
  const [loading] = useState(false);

  const isAddingRef = useRef(false); // prevent multiple calls

  //Load cart
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setCart(JSON.parse(stored));
    }
  }, []);

  const persist = (data: Cart) => {
    setCart(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  // ADD TO CART
  const addToCart = useCallback(
    async (product: AddToCartInput, quantity = 1) => {
      if (isAddingRef.current) return false;
      isAddingRef.current = true;

      try {
        setCart((prev) => {
          const existing = prev.items.find(
            (i) => i.productId === product.productId,
          );

          let updatedItems;

          if (existing) {
            updatedItems = prev.items.map((item) =>
              item.productId === product.productId
                ? {
                    ...item,
                    quantity: item.quantity + quantity,
                    subtotal: (item.quantity + quantity) * item.price,
                  }
                : item,
            );
          } else {
            updatedItems = [
              ...prev.items,
              {
                id: product.productId,
                productId: product.productId,
                productName: product.productName,
                productImage: product.productImage,
                price: product.price,
                quantity,
                subtotal: product.price * quantity,
              },
            ];
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
    },
    [],
  );

  // UPDATE CART ITEM
  const updateCartItem = useCallback(
    async (itemId: string, quantity: number) => {
      if (quantity < 1) return false;

      setCart((prev) => {
        const updatedItems = prev.items.map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity,
                subtotal: quantity * item.price,
              }
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

  //  REMOVE CART ITEM
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

  const count = cart.items.reduce((acc, i) => acc + i.quantity, 0);

  return {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeCartItem,
    count,
  };
}
