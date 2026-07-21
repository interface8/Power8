"use client";

import React from "react";
import BundleCard from "./BundleCard";
import type { BundleDto } from "@/modules/bundles/types";
import { Loader2, BoxesIcon } from "lucide-react";

interface BundleListProps {
  bundles: BundleDto[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

const BundleList = ({ bundles, loading, error, onRetry }: BundleListProps) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-orange-500" size={48} />
        <p className="text-gray-500 mt-4 text-sm">Loading packages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-red-500 text-lg font-medium mb-2">
          Failed to load packages
        </div>
        <p className="text-gray-500 text-sm mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (bundles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <BoxesIcon className="w-16 h-16 text-gray-200 mb-4" />
        <p className="text-lg font-medium text-gray-500">
          No system packages available yet
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Check back soon for complete solar system packages
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {bundles.map((bundle) => (
          <div
            key={bundle.id}
            className="transform transition-transform duration-300 hover:scale-105"
          >
            <BundleCard bundle={bundle} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BundleList;