"use client";

import Link from "next/link";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";
import { useOrders } from "@/hooks/use-orders";
import type { OrderDto } from "@/modules/orders/types";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-teal-100 text-teal-700",
  DELIVERED: "bg-teal-100 text-teal-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function OrderCard({ order }: { order: OrderDto }) {
  const itemCount = order.items.length;
  const firstItem = order.items[0];
  const itemLabel =
    firstItem?.productName ?? firstItem?.bundleName ?? "Unknown item";
  const displayLabel =
    itemCount > 1 ? `${itemLabel} +${itemCount - 1} more` : itemLabel;

  return (
    <Link href={`/dashboard/orders/${order.id}`}>
      <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-green-200 hover:shadow-md sm:p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50">
            <Package className="h-5 w-5 text-green-700" />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              {displayLabel}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              {formatDate(order.createdAt)} ·{" "}
              {order.paymentType === "FULL" ? "Full Payment" : "Installment"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">
              {formatCurrency(order.totalAmount)}
            </p>
            <span
              className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-600"}`}
            >
              {order.status}
            </span>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </Link>
  );
}

export default function OrdersPage() {
  const { data, isLoading, isError } = useOrders();

  const orders: OrderDto[] = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6 px-4 md:px-0">
      <div>
        <h1 className="text-2xl font-bold text-green-950">My Orders</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track and manage your solar orders
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-2xl bg-gray-100"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-600">
            We could not load your orders right now.
          </p>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white py-16 text-center">
          <ShoppingBag className="h-10 w-10 text-gray-300" />
          <p className="mt-4 text-sm font-medium text-gray-500">
            No orders yet
          </p>
          <Link
            href="/products"
            className="mt-4 rounded-xl bg-green-700 px-5 py-2 text-sm font-semibold text-white hover:bg-green-800"
          >
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
