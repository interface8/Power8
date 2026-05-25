"use client";

import { Truck } from "lucide-react";

export function ShippingHeader() {
  return (
    <div className="border-b border-gray-100 bg-linear-to-r from-orange-50/50 to-white px-4 sm:px-6 py-4 sm:py-5">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-orange-100">
          <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Shipping & Fulfillment</h2>
          <p className="text-xs sm:text-sm text-gray-500">Track and manage delivery progress</p>
        </div>
      </div>
    </div>
  );
}