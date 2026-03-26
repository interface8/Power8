"use client";

import Cart from "@/components/cart/Cart";
import { useCart } from "@/hooks/use-cart";
import { useEffect } from "react";

export default function CartPage() {
  const { cart, loading, fetchCart, updateCartItem, removeCartItem } = useCart();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <Cart
      cart={cart}
      loading={loading}
      onUpdateItem={updateCartItem}
      onRemoveItem={removeCartItem}
    />
  );
}
