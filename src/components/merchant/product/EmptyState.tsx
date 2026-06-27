"use client";

import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

interface EmptyStateProps {
  onAdd: () => void;
}

export function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4">
        <Package className="w-10 h-10 text-orange-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No products yet
      </h3>
      <p className="text-gray-500 max-w-sm mb-6">
        Create your first product to start selling on the platform
      </p>
      <Button
        onClick={onAdd}
        className="bg-orange-500 hover:bg-orange-600 text-white"
      >
        Add your first product
      </Button>
    </div>
  );
}