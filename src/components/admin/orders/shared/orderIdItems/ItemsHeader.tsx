"use client";

import { ShoppingBag } from "lucide-react";

export function ItemsHeader() {
  return (
    <div className="flex items-center gap-3 border-b border-gray-100 bg-linear-to-r from-orange-50/50 to-white px-4 sm:px-6 py-4 sm:py-5">
      <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl bg-orange-100">
        <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
      </div>
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Order Items</h2>
        <p className="text-xs sm:text-sm text-gray-500">Products included in this order</p>
      </div>
    </div>
  );
}