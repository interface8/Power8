"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounceValue } from "usehooks-ts";
import { MerchantOrderFilters } from "@/components/merchant/orders/MerchantOrderFilters";
import { MerchantOrderTable } from "@/components/merchant/orders/MerchantOrderTable";
import { MerchantOrderStats } from "@/components/merchant/orders/MerchantOrderStats";
import { MerchantOrdersPagination } from "@/components/merchant/orders/MerchantOrdersPagination";
import type { MerchantOrder } from "@/types/merchant-order";
import { toast } from "sonner";

interface ApiOrder {
  orderId: string;
  customer: { firstName: string; lastName: string };
  orderDate: string;
  orderStatus: MerchantOrder["orderStatus"];
  items: { id: string; itemType: "PRODUCT" | "BUNDLE"; name: string; quantity: number; unitPrice: number }[];
}

function mapOrder(o: ApiOrder): MerchantOrder {
  return {
    id: o.orderId,
    customerFirstName: o.customer.firstName,
    customerLastName: o.customer.lastName,
    orderDate: o.orderDate,
    orderStatus: o.orderStatus,
    items: o.items,
  };
}

export default function MerchantOrdersPage() {
  const [allOrders, setAllOrders] = useState<MerchantOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounceValue(search, 400);
  const [status, setStatus] = useState<string>("");
  const limit = 10;

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: "1", limit: "200" });
      if (status) params.set("orderStatus", status);
      const res = await fetch(`/api/merchants/orders?${params}`);
      if (!res.ok) { toast.error("Failed to load orders"); return; }
      const json = await res.json();
      setAllOrders((json.data?.data ?? []).map(mapOrder));
    } catch { toast.error("Failed to load orders"); }
    finally { setLoading(false); }
  }, [status]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  useEffect(() => { setPage(1); }, [debouncedSearch, status]);

  const filteredOrders = allOrders.filter((o) => {
    if (!debouncedSearch) return true;
    const s = debouncedSearch.toLowerCase();
    return (
      o.id.toLowerCase().includes(s) ||
      o.customerFirstName.toLowerCase().includes(s) ||
      o.customerLastName.toLowerCase().includes(s)
    );
  });

  const totalPages = Math.ceil(filteredOrders.length / limit);
  const paginatedOrders = filteredOrders.slice((page - 1) * limit, page * limit);

  const stats = {
    totalOrders: allOrders.length,
    pendingOrders: allOrders.filter((o) => o.orderStatus === "PENDING").length,
    processingOrders: allOrders.filter((o) => o.orderStatus === "PROCESSING" || o.orderStatus === "CONFIRMED").length,
    completedOrders: allOrders.filter((o) => o.orderStatus === "COMPLETED" || o.orderStatus === "DELIVERED").length,
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">View orders containing your products</p>
      </div>

      <MerchantOrderStats stats={stats} />

      <MerchantOrderFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        paymentType=""
        onPaymentTypeChange={() => {}}
        paymentStatus=""
        onPaymentStatusChange={() => {}}
      />

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : (
        <MerchantOrderTable orders={paginatedOrders} />
      )}

      <MerchantOrdersPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

