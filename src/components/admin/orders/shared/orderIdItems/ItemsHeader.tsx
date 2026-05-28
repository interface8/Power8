"use client";

import { ShoppingBag } from "lucide-react";

export function ItemsHeader() {
  return (
    <div
      className="
        flex items-center justify-between
        border-b border-gray-100
        bg-linear-to-r from-orange-50/70 to-white
        px-5 py-5 sm:px-6
      "
    >
      <div className="flex min-w-0 items-center gap-4">
        <div
          className="
            flex h-11 w-11 shrink-0 items-center justify-center
            rounded-2xl bg-orange-100
          "
        >
          <ShoppingBag className="h-5 w-5 text-orange-600" />
        </div>

        <div className="min-w-0">
          <h2
            className="
              truncate text-base font-bold
              tracking-tight text-gray-900
              sm:text-lg
            "
          >
            Order Items
          </h2>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Products included in this order
          </p>
        </div>
      </div>
    </div>
  );
}
