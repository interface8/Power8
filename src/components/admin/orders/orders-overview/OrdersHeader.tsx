"use client";

import { PackageSearch } from "lucide-react";

export function OrdersHeader() {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-orange-100 to-orange-50">
        <PackageSearch className="h-5 w-5 text-orange-600" />
      </div>
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">View and manage all customer orders</p>
      </div>
    </div>
  );
}