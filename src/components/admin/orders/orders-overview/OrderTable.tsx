"use client";

import Link from "next/link";
import { Eye, PackageSearch } from "lucide-react";
import { AdminOrder } from "@/types/order";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { formatCurrency, formatDate } from "./ordersUtils";


interface OrdersTableProps {
  orders: AdminOrder[];
}

const headers = [
  "Customer",
  "Order ID",
  "Amount",
  "Payment Type",
  "Payment Status",
  "Order Status",
  "Shipping",
  "Date",
  "Action",
];

function TableHeader() {
  return (
    <thead className="bg-gray-50">
      <tr className="border-b border-gray-200">
        {headers.map((header) => (
          <th
            key={header}
            className="whitespace-nowrap px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function TableRow({ order }: { order: AdminOrder }) {
  const formattedOrderId = `ORD-${String(order.id).slice(-3).toUpperCase()}`;

  return (
    <tr className="border-b border-gray-100 transition-all duration-200 hover:bg-orange-50/40">
      {/* Customer */}
      <td className="px-4 py-5">
        <div className="min-w-0">
          <p className="max-w-45 truncate text-sm font-semibold text-gray-900">
            {order.customerName}
          </p>

          {/* <p className="mt-1 hidden max-w-55 truncate text-xs text-gray-500 lg:block">
            {order.customerEmail}
          </p> */}
        </div>
      </td>

      {/* Order ID */}
      <td className="whitespace-nowrap px-4 py-5">
        <span className="rounded-lg  px-2.5 py-1 text-xs font-semibold tracking-wide text-gray-700">
          {formattedOrderId}
        </span>
      </td>

      {/* Amount */}
      <td className="whitespace-nowrap px-4 py-5 text-sm font-bold text-gray-900">
        {formatCurrency(order.totalAmount)}
      </td>

      {/* Payment Type */}
      <td className="px-4 py-5">
        <OrderStatusBadge status={order.paymentType} size="sm" />
      </td>

      {/* Payment Status */}
      <td className="px-4 py-5">
        <OrderStatusBadge status={order.paymentStatus} size="sm" />
      </td>

      {/* Order Status */}
      <td className="px-4 py-5">
        <OrderStatusBadge status={order.orderStatus} size="sm" />
      </td>

      {/* Shipping */}
      <td className="px-4 py-5">
        <OrderStatusBadge status={order.shippingStatus} size="sm" />
      </td>

      {/* Date */}
      <td className="whitespace-nowrap px-4 py-5 text-sm text-gray-500 font-medium">
        {formatDate(order.createdAt)}
      </td>

      {/* Actions */}
      <td className="px-4 py-5">
        <Link
          href={`/admin/orders/${order.id}`}
          className="
            flex h-9 w-9 items-center justify-center
            rounded-xl border border-orange-200
            bg-orange-50 text-orange-600
            transition-all duration-200
            hover:scale-105 hover:bg-orange-100
            active:scale-95
          "
        >
          <Eye className="h-4 w-4" />
        </Link>
      </td>
    </tr>
  );
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  if (!orders.length) {
    return (
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 rounded-full bg-gray-100 p-4">
            <PackageSearch className="h-7 w-7 text-gray-400" />
          </div>

          <h3 className="text-lg font-semibold text-gray-900">
            No orders found
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Try adjusting your filters or search query.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-275">
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
