"use client";

import { Package } from "lucide-react";

export default function MerchantProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your products</p>
      </div>

      <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl border border-gray-200">
        <Package className="h-12 w-12 text-gray-400 mb-3" />
        <p className="text-gray-500">No products yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Create your first product to get started
        </p>
      </div>
    </div>
  );
}
