"use client";

import React, { createContext, useContext } from "react";
import { useCart as useCartHook } from "@/hooks/use-cart";

type CartContextType = ReturnType<typeof useCartHook>;

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cart = useCartHook(); 

  return (
    <CartContext.Provider value={cart}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
};