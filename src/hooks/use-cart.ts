import { useState, useCallback } from "react";
import type { Cart } from "@/types/products";
import { toast } from "sonner";

const emptyCart: Cart = { cartId: null, userId: "", items: [], total: 0 };

export function useCart() {
  const [cart, setCart] = useState<Cart>(emptyCart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/cart");
      const json = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setCart(emptyCart);
          return;
        }
        setError(json.message ?? "Failed to fetch cart");
        return;
      }

      setCart(json.data ?? emptyCart);
    } catch {
      setError("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (productId: string, quantity: number = 1) => {
    setError("");

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      const json = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Please login to add items to cart");
          return false;
        }
        toast.error(json.message ?? "Failed to add to cart");
        return false;
      }

      setCart(json.data ?? emptyCart);
      toast.success("Product added to cart");
      return true;
    } catch {
      toast.error("Failed to add to cart");
      return false;
    }
  }, []);

  const updateCartItem = useCallback(async (itemId: string, quantity: number) => {
    setError("");

    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.message ?? "Failed to update cart");
        return false;
      }

      setCart(json.data ?? emptyCart);
      return true;
    } catch {
      toast.error("Failed to update cart");
      return false;
    }
  }, []);

  const removeCartItem = useCallback(async (itemId: string) => {
    setError("");

    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.message ?? "Failed to remove item");
        return false;
      }

      setCart(json.data ?? emptyCart);
      toast.success("Item removed from cart");
      return true;
    } catch {
      toast.error("Failed to remove item");
      return false;
    }
  }, []);

  return { cart, loading, error, fetchCart, addToCart, updateCartItem, removeCartItem };
}
