"use client";

import { useMemo, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { MerchantOrderFilters } from "@/components/merchant/orders/MerchantOrderFilters";
import { MerchantOrderTable } from "@/components/merchant/orders/MerchantOrderTable";
import { MerchantOrderStats } from "@/components/merchant/orders/MerchantOrderStats";
import { MerchantOrdersPagination } from "@/components/merchant/orders/MerchantOrdersPagination";
import { dummyMerchantOrders } from "@/data/merchant-order-data";


export default function MerchantOrdersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounceValue(search, 500);
  const [status, setStatus] = useState<string>("");
  const [paymentType, setPaymentType] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const limit = 10;

  // Filter orders based on search and filters
  const filteredOrders = useMemo(() => {
    let orders = dummyMerchantOrders;

    // Search filter
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      orders = orders.filter(
        (order) =>
          order.customerName.toLowerCase().includes(searchLower) ||
          order.id.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (status) {
      orders = orders.filter((order) => order.orderStatus === status);
    }

    // Payment type filter
    if (paymentType) {
      orders = orders.filter((order) => order.paymentType === paymentType);
    }

    // Payment status filter
    if (paymentStatus) {
      orders = orders.filter((order) => order.paymentStatus === paymentStatus);
    }

    return orders;
  }, [debouncedSearch, status, paymentType, paymentStatus]);

  // Pagination
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / limit);
  const paginatedOrders = filteredOrders.slice((page - 1) * limit, page * limit);

  const stats = {
    totalOrders: dummyMerchantOrders.length,
    pendingOrders: dummyMerchantOrders.filter((o) => o.orderStatus === "PENDING").length,
    processingOrders: dummyMerchantOrders.filter((o) => o.orderStatus === "PROCESSING").length,
    completedOrders: dummyMerchantOrders.filter((o) => o.orderStatus === "COMPLETED").length,
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage your orders</p>
        </div>
      </div>

      {/* Stats */}
      <MerchantOrderStats stats={stats} />

      {/* Filters */}
      <MerchantOrderFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        paymentType={paymentType}
        onPaymentTypeChange={setPaymentType}
        paymentStatus={paymentStatus}
        onPaymentStatusChange={setPaymentStatus}
      />

      {/* Table */}
      <MerchantOrderTable orders={paginatedOrders} />

      {/* Pagination */}
      <MerchantOrdersPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}