"use client";

import { useMemo, useState } from "react";

import { mockOrders } from "@/data/mock-orders";

import OrdersFilters from "@/components/admin/orders/OrdersFilters";
import OrdersTable from "@/components/admin/orders/OrderTable";
export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState("ALL");
  const [paymentType, setPaymentType] = useState("ALL");
  const [paymentStatus, setPaymentStatus] = useState("ALL");

  const filteredOrders = useMemo(() => {
    return mockOrders.filter((order) => {
      const matchesSearch =
        order.customerName.toLowerCase().includes(search.toLowerCase()) ||
        order.id.toLowerCase().includes(search.toLowerCase());

      const matchesOrderStatus =
        orderStatus === "ALL" || order.orderStatus === orderStatus;

      const matchesPaymentType =
        paymentType === "ALL" || order.paymentType === paymentType;

      const matchesPaymentStatus =
        paymentStatus === "ALL" || order.paymentStatus === paymentStatus;

      return (
        matchesSearch &&
        matchesOrderStatus &&
        matchesPaymentType &&
        matchesPaymentStatus
      );
    });
  }, [search, orderStatus, paymentType, paymentStatus]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>

        <p className="text-gray-500 mt-1">
          Monitor and manage all customer orders.
        </p>
      </div>

      <OrdersFilters
        search={search}
        setSearch={setSearch}
        orderStatus={orderStatus}
        setOrderStatus={setOrderStatus}
        paymentType={paymentType}
        setPaymentType={setPaymentType}
        paymentStatus={paymentStatus}
        setPaymentStatus={setPaymentStatus}
      />

      <OrdersTable orders={filteredOrders} />
    </div>
  );
}
