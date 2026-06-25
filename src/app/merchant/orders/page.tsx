"use client";

export default function MerchantOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your orders</p>
      </div>

      <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl border border-gray-200">
        <ShoppingBag className="h-12 w-12 text-gray-400 mb-3" />
        <p className="text-gray-500">No orders yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Orders will appear here once customers place them
        </p>
      </div>
    </div>
  );
}

import { ShoppingBag } from "lucide-react";
