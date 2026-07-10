"use client";

import Link from "next/link";
import { Eye, ShoppingBag, Package, Layers3 } from "lucide-react";
import { MerchantOrder } from "@/types/merchant-order";
import { OrderStatusBadge } from "@/components/admin/orders/orders-overview/OrderStatusBadge";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

function truncateId(id: string) {
  return id.length > 12 ? `${id.slice(0, 8)}…` : id;
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(n);
}

interface MerchantOrderTableProps {
  orders: MerchantOrder[];
}

const TableHeader = () => (
  <thead className="border-b border-gray-200 bg-gray-50">
    <tr>
      {["Order ID", "Customer", "Items", "Value (My Items)", "Status", "Order Date", "Actions"].map((h) => (
        <th key={h} className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">{h}</th>
      ))}
    </tr>
  </thead>
);

const TableRow = ({ order }: { order: MerchantOrder }) => {
  const myItemsTotal = order.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const itemSummary = order.items.slice(0, 2).map((i) => `${i.name} ×${i.quantity}`).join(", ");
  const extra = order.items.length > 2 ? ` +${order.items.length - 2} more` : "";

  return (
    <tr className="border-b border-gray-100 transition-colors hover:bg-orange-50/30">
      <td className="px-3 sm:px-4 py-4 text-sm font-mono text-gray-500 whitespace-nowrap">{truncateId(order.id)}</td>
      <td className="px-3 sm:px-4 py-4">
        <p className="text-sm font-medium text-gray-900">{order.customerFirstName} {order.customerLastName}</p>
      </td>
      <td className="px-3 sm:px-4 py-4">
        <p className="text-xs text-gray-600 max-w-48 truncate">{itemSummary}{extra}</p>
        <p className="text-xs text-gray-400 mt-0.5">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
      </td>
      <td className="px-3 sm:px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">{formatCurrency(myItemsTotal)}</td>
      <td className="px-3 sm:px-4 py-4"><OrderStatusBadge status={order.orderStatus} size="sm" /></td>
      <td className="px-3 sm:px-4 py-4 text-sm text-gray-500 whitespace-nowrap">{formatDate(order.orderDate)}</td>
      <td className="px-3 sm:px-4 py-4">
        <Link href={`/merchant/orders/${order.id}`} className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-200 bg-orange-50 text-orange-600 transition-all hover:bg-orange-100 hover:scale-105 active:scale-95" aria-label="View order">
          <Eye className="h-4 w-4" />
        </Link>
      </td>
    </tr>
  );
};

export function MerchantOrderTable({ orders }: MerchantOrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-gray-100 p-3 mb-3">
            <ShoppingBag className="h-6 w-6 text-gray-400" />
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
        <table className="min-w-[700px] w-full">
          <TableHeader />
          <tbody>
            {orders.map((order) => <TableRow key={order.id} order={order} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface MerchantOrderTableProps {
  orders: MerchantOrder[];
}

const TableHeader = () => (
  <thead className="border-b border-gray-200 bg-gray-50">
    <tr>
      {["Customer", "Order ID", "Total Amount", "Payment Type", "Payment Status", "Order Status", "Shipping Status", "Date", "Actions"].map((header) => (
        <th key={header} className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">
          {header}
        </th>
      ))}
    </tr>
  </thead>
);

const TableRow = ({ order }: { order: MerchantOrder }) => (
  <tr className="border-b border-gray-100 transition-colors hover:bg-orange-50/30">
    <td className="px-3 sm:px-4 py-4">
      <p className="text-sm font-medium text-gray-900 truncate max-w-37.5">{order.customerName}</p>
      <p className="mt-0.5 text-xs text-gray-500 truncate max-w-37.5">{order.customerEmail}</p>
    </td>
    <td className="px-3 sm:px-4 py-4 text-sm font-mono text-gray-500 whitespace-nowrap">{truncateOrderId(order.id)}</td>
    <td className="px-3 sm:px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">{formatCurrency(order.totalAmount)}</td>
    <td className="px-3 sm:px-4 py-4"><OrderStatusBadge status={order.paymentType} size="sm" /></td>
    <td className="px-3 sm:px-4 py-4"><OrderStatusBadge status={order.paymentStatus} size="sm" /></td>
    <td className="px-3 sm:px-4 py-4"><OrderStatusBadge status={order.orderStatus} size="sm" /></td>
    <td className="px-3 sm:px-4 py-4"><OrderStatusBadge status={order.shippingStatus} size="sm" /></td>
    <td className="px-3 sm:px-4 py-4 text-sm text-gray-500 whitespace-nowrap">{formatDate(order.createdAt)}</td>
    <td className="px-3 sm:px-4 py-4">
      <Link
        href={`/merchant/orders/${order.id}`}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-200 bg-orange-50 text-orange-600 transition-all hover:bg-orange-100 hover:scale-105 active:scale-95"
        aria-label="View order details"
      >
        <Eye className="h-4 w-4" />
      </Link>
    </td>
  </tr>
);

export function MerchantOrderTable({ orders }: MerchantOrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-gray-100 p-3 mb-3">
            <ShoppingBag className="h-6 w-6 text-gray-400" />
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
        <table className="min-w-225 w-full">
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

import { ShoppingBag } from "lucide-react";