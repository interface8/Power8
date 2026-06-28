"use client";

import { useMemo, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { Plus } from "lucide-react";
import Link from "next/link";
import { MerchantBundleStats } from "@/components/merchant/bundles/MerchantBundleStats";
import { MerchantBundleTable } from "@/components/merchant/bundles/MerchantBundleTable";
import { MerchantBundleFilters } from "@/components/merchant/bundles/MerchantBundleFilters";
import { dummyMerchantBundles,  } from "@/data/merchant-bundle-data";

export default function MerchantBundlesPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounceValue(search, 500);
  const [status, setStatus] = useState<string>("");

  // Filter bundles
  const filteredBundles = useMemo(() => {
    let bundles = dummyMerchantBundles;

    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      bundles = bundles.filter((bundle) =>
        bundle.name.toLowerCase().includes(searchLower)
      );
    }

    if (status) {
      bundles = bundles.filter((bundle) => bundle.status === status);
    }

    return bundles;
  }, [debouncedSearch, status]);

  const stats = {
    totalBundles: dummyMerchantBundles.length,
    approvedBundles: dummyMerchantBundles.filter((b) => b.status === "APPROVED").length,
    pendingBundles: dummyMerchantBundles.filter((b) => b.status === "PENDING").length,
  };

  const handleDelete = (id: string) => {
    // TODO: Implement delete API call
    console.log("Delete bundle:", id);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bundles</h1>
          <p className="text-sm text-gray-500 mt-1">
            Package your approved products into solar system bundles
          </p>
        </div>
        <Link
          href="/merchant/bundles/new"
          className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-orange-600 hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Create Bundle
        </Link>
      </div>

      {/* Stats */}
      <MerchantBundleStats stats={stats} />

      {/* Filters */}
      <MerchantBundleFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
      />

      {/* Table */}
      <MerchantBundleTable bundles={filteredBundles} onDelete={handleDelete} />
    </div>
  );
}