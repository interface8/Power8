"use client";

import Link from "next/link";
import { Eye, ShoppingBag } from "lucide-react";
import { MerchantOrder } from "@/types/merchant-order";
import { OrderStatusBadge } from "@/components/admin/orders/orders-overview/OrderStatusBadge";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function truncateId(id: string) {
  return id.length > 12 ? `${id.slice(0, 8)}…` : id;
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(n);
}

interface MerchantOrderTableProps {
  orders: MerchantOrder[];
}

const TableHeader = () => (
  <thead className="border-b border-gray-200 bg-gray-50">
    <tr>
      {[
        "Order ID",
        "Customer",
        "Items",
        "Value (My Items)",
        "Status",
        "Order Date",
        "Actions",
      ].map((header) => (
        <th
          key={header}
          className="whitespace-nowrap px-3 py-3 text-left text-xs font-semibold text-gray-600 sm:px-4"
        >
          {header}
        </th>
      ))}
    </tr>
  </thead>
);

const TableRow = ({ order }: { order: MerchantOrder }) => {
  const myItemsTotal = order.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const itemSummary = order.items
    .slice(0, 2)
    .map((item) => `${item.name} ×${item.quantity}`)
    .join(", ");

  const extra =
    order.items.length > 2
      ? ` +${order.items.length - 2} more`
      : "";

  return (
    <tr className="border-b border-gray-100 transition-colors hover:bg-orange-50/30">
      <td className="whitespace-nowrap px-3 py-4 font-mono text-sm text-gray-500 sm:px-4">
        {truncateId(order.id)}
      </td>

      <td className="px-3 py-4 sm:px-4">
        <p className="text-sm font-medium text-gray-900">
          {order.customerFirstName} {order.customerLastName}
        </p>
      </td>

      <td className="px-3 py-4 sm:px-4">
        <p className="max-w-48 truncate text-xs text-gray-600">
          {itemSummary}
          {extra}
        </p>

        <p className="mt-0.5 text-xs text-gray-400">
          {order.items.length} item
          {order.items.length !== 1 ? "s" : ""}
        </p>
      </td>

      <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-gray-900 sm:px-4">
        {formatCurrency(myItemsTotal)}
      </td>

      <td className="px-3 py-4 sm:px-4">
        <OrderStatusBadge status={order.orderStatus} size="sm" />
      </td>

      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:px-4">
        {formatDate(order.orderDate)}
      </td>

      <td className="px-3 py-4 sm:px-4">
        <Link
          href={`/merchant/orders/${order.id}`}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-200 bg-orange-50 text-orange-600 transition-all hover:scale-105 hover:bg-orange-100 active:scale-95"
          aria-label="View order"
        >
          <Eye className="h-4 w-4" />
        </Link>
      </td>
    </tr>
  );
};

export function MerchantOrderTable({
  orders,
}: MerchantOrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-3 rounded-full bg-gray-100 p-3">
            <ShoppingBag className="h-6 w-6 text-gray-400" />
          </div>

          <p className="text-gray-500">No orders found</p>

          <p className="mt-1 text-sm text-gray-400">
            Try adjusting your filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm sm:rounded-2xl">
      <div className="overflow-x-auto">
        <table className="min-w-[700px] w-full">
          <TableHeader />

          <tbody>
            {orders.map((order) => (
              <TableRow key={order.id} order={order} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}