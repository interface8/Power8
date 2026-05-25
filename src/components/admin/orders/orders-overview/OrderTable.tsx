"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { AdminOrder } from "@/types/order";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { formatCurrency, formatDate, truncateOrderId } from "./ordersUtils";

interface OrdersTableProps {
  orders: AdminOrder[];
}

const TableHeader = () => (
  <thead className="border-b border-gray-200 bg-gray-50">
    <tr>
      {["Customer", "Order ID", "Total Amount", "Payment Type", "Payment Status", "Order Status", "Shipping Status", "Date", "Actions"].map((header) => (
        <th key={header} className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-600">
          {header}
        </th>
      ))}
    </tr>
  </thead>
);

const TableRow = ({ order }: { order: AdminOrder }) => (
  <tr className="border-b border-gray-100 transition-colors hover:bg-orange-50/30">
    <td className="px-4 sm:px-6 py-4">
      <p className="text-sm font-medium text-gray-900 truncate max-w-37.5">{order.customerName}</p>
      <p className="mt-0.5 text-xs text-gray-500 truncate max-w-37.5">{order.customerEmail}</p>
    </td>
    <td className="px-4 sm:px-6 py-4 text-sm font-mono text-gray-500">{truncateOrderId(order.id)}</td>
    <td className="px-4 sm:px-6 py-4 text-sm font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</td>
    <td className="px-4 sm:px-6 py-4"><OrderStatusBadge status={order.paymentType} size="sm" /></td>
    <td className="px-4 sm:px-6 py-4"><OrderStatusBadge status={order.paymentStatus} size="sm" /></td>
    <td className="px-4 sm:px-6 py-4"><OrderStatusBadge status={order.orderStatus} size="sm" /></td>
    <td className="px-4 sm:px-6 py-4"><OrderStatusBadge status={order.shippingStatus} size="sm" /></td>
    <td className="px-4 sm:px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{formatDate(order.createdAt)}</td>
    <td className="px-4 sm:px-6 py-4">
      <Link
        href={`/admin/orders/${order.id}`}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-200 bg-orange-50 text-orange-600 transition-all hover:bg-orange-100 hover:scale-105 active:scale-95"
        aria-label="View order details"
      >
        <Eye className="h-4 w-4" />
      </Link>
    </td>
  </tr>
);

export default function OrdersTable({ orders }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-gray-100 p-3 mb-3">
            <PackageSearch className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-gray-500">No orders found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-225">
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

import { PackageSearch } from "lucide-react";