"use client";

import { Layers3 } from "lucide-react";

export default function MerchantBundlesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Bundles</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your bundles</p>
      </div>
      
      <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl border border-gray-200">
        <Layers3 className="h-12 w-12 text-gray-400 mb-3" />
        <p className="text-gray-500">No bundles yet</p>
        <p className="text-sm text-gray-400 mt-1">Create your first bundle to get started</p>
      </div>
    </div>
  );
}