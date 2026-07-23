"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounceValue } from "usehooks-ts";
import { Plus } from "lucide-react";
import Link from "next/link";
import { MerchantBundleStats } from "@/components/merchant/bundles/MerchantBundleStats";
import { MerchantBundleTable } from "@/components/merchant/bundles/MerchantBundleTable";
import { MerchantBundleFilters } from "@/components/merchant/bundles/MerchantBundleFilters";
import { toast } from "sonner";
import type { MerchantBundle } from "@/types/merchant-bundles";

interface ApiBundle {
  id: string;
  name: string;
  totalPrice: string | number;
  systemCapacityKw: string | number | null;
  description: string | null;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  isActive: boolean;
  items: { id: string; quantity: number; merchantProduct: { id: string; name: string } }[];
  createdAt: string;
  updatedAt: string;
}

function mapBundle(b: ApiBundle): MerchantBundle {
  return {
    id: b.id,
    name: b.name,
    totalPrice: Number(b.totalPrice),
    capacity: b.systemCapacityKw ? `${Number(b.systemCapacityKw)} kW` : "—",
    itemsCount: b.items?.length ?? 0,
    status: b.approvalStatus,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
  };
}

export default function MerchantBundlesPage() {
  const [bundles, setBundles] = useState<MerchantBundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounceValue(search, 400);
  const [status, setStatus] = useState<string>("");

  const fetchBundles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/merchants/bundles");
      if (!res.ok) { toast.error("Failed to load bundles"); return; }
      const json = await res.json();
      setBundles((json.data ?? []).map(mapBundle));
    } catch { toast.error("Failed to load bundles"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchBundles(); }, [fetchBundles]);

  const filteredBundles = bundles.filter((b) => {
    const matchSearch = !debouncedSearch || b.name.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchStatus = !status || b.status === status;
    return matchSearch && matchStatus;
  });

  const stats = {
    totalBundles: bundles.length,
    approvedBundles: bundles.filter((b) => b.status === "APPROVED").length,
    pendingBundles: bundles.filter((b) => b.status === "PENDING").length,
  };

  const handleDelete = async (id: string) => {
    const prev = bundles;
    setBundles((b) => b.filter((x) => x.id !== id));
    try {
      const res = await fetch(`/api/merchants/bundles/${id}`, { method: "DELETE" });
      if (!res.ok) { setBundles(prev); toast.error("Failed to delete bundle"); return; }
      toast.success("Bundle deactivated");
    } catch { setBundles(prev); toast.error("Failed to delete bundle"); }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bundles</h1>
          <p className="text-sm text-gray-500 mt-1">Package your approved products into solar system bundles</p>
        </div>
        <Link href="/merchant/bundles/new" className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-orange-600 hover:shadow-md">
          <Plus className="h-4 w-4" />
          Create Bundle
        </Link>
      </div>
      <MerchantBundleStats stats={stats} />
      <MerchantBundleFilters search={search} onSearchChange={setSearch} status={status} onStatusChange={setStatus} />
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <MerchantBundleTable bundles={filteredBundles} onDelete={handleDelete} />
      )}
    </div>
  );
}
