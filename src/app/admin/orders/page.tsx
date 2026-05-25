"use client";

import { useMemo, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { useOrders } from "@/hooks/use-admin-order";
import { OrdersHeader } from "@/components/admin/orders/orders-overview/OrdersHeader";
import { OrdersFilters } from "@/components/admin/orders/orders-overview/OrdersFilter";
import { OrdersPagination } from "@/components/admin/orders/orders-overview/OrdersPagination";
import OrdersTable from "@/components/admin/orders/orders-overview/OrderTable";
import OrdersTableSkeleton from "@/components/admin/orders/orders-overview/OrdersTableSkeleton";
import {
  toOrderStatus,
  toPaymentType,
  toPaymentStatus,
} from "@/components/admin/orders/orders-overview/ordersUtils";

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounceValue(search, 500);
  const [status, setStatus] = useState<string>("");
  const [paymentType, setPaymentType] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");

  const filters = useMemo(
    () => ({
      page,
      limit: 20,
      search: debouncedSearch,
      status: toOrderStatus(status),
      paymentType: toPaymentType(paymentType),
      paymentStatus: toPaymentStatus(paymentStatus),
    }),
    [page, debouncedSearch, status, paymentType, paymentStatus],
  );

  const { data, isLoading } = useOrders(filters);

  return (
    <div className="space-y-4 sm:space-y-6 p-1 sm:p-2 max-w-500 mx-auto -mt-6">
      <OrdersHeader />

      <OrdersFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        paymentType={paymentType}
        onPaymentTypeChange={setPaymentType}
        paymentStatus={paymentStatus}
        onPaymentStatusChange={setPaymentStatus}
      />

      {isLoading ? (
        <OrdersTableSkeleton />
      ) : (
        <OrdersTable orders={data?.data ?? []} />
      )}

      <OrdersPagination
        currentPage={data?.pagination.page ?? 1}
        totalPages={data?.pagination.totalPages ?? 1}
        onPageChange={setPage}
      />
    </div>
  );
}
