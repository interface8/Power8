"use client";

import StoreProvider from "./store-provider";
import { QueryProvider } from "./query-provider";
import { AuthProvider } from "./auth-provider";
import { CartProvider } from "./cart-providers";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <StoreProvider>
        <CartProvider>
          <QueryProvider>{children}</QueryProvider>
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  );
};
