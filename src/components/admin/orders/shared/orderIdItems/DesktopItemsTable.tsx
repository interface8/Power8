"use client";

import { Package2 } from "lucide-react";
import { OrderItem } from "@/types/order";
import { formatCurrency, getItemTypeLabel } from "./itemUtils";

interface DesktopItemsTableProps {
  items: OrderItem[];
  totalAmount: number;
}

function TableHeader() {
  return (
    <thead className="bg-gray-50">
      <tr className="border-b border-gray-200">
        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-600">Product</th>
        <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-gray-600">Quantity</th>
        <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-gray-600">Unit Price</th>
        <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-gray-600">Subtotal</th>
      </tr>
    </thead>
  );
}

function TableRow({ item }: { item: OrderItem }) {
  return (
    <tr className="border-b border-gray-100 transition-colors hover:bg-orange-50/40">
      <td className="px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gray-100">
            <Package2 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
          </div>
          <div>
            <p className="font-semibold text-sm sm:text-base text-gray-900">{item.name}</p>
            <p className="mt-0.5 text-xs text-gray-500">{getItemTypeLabel(item.itemType)}</p>
          </div>
        </div>
       </td>
      <td className="px-4 sm:px-6 py-4 sm:py-5 text-right">
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium text-gray-700">
          {item.quantity}
        </span>
       </td>
      <td className="px-4 sm:px-6 py-4 sm:py-5 text-right text-xs sm:text-sm text-gray-600">
        {formatCurrency(item.unitPrice)}
       </td>
      <td className="px-4 sm:px-6 py-4 sm:py-5 text-right">
        <span className="text-sm sm:text-base font-bold text-gray-900">{formatCurrency(item.subtotal)}</span>
       </td>
     </tr>
  );
}

function TotalRow({ totalAmount }: { totalAmount: number }) {
  return (
    <tr className="bg-linear-to-r from-orange-50/50 to-white">
      <td colSpan={3} className="px-4 sm:px-6 py-4 sm:py-5 text-right">
        <span className="text-sm sm:text-base font-semibold text-gray-900">Total Amount</span>
       </td>
      <td className="px-4 sm:px-6 py-4 sm:py-5 text-right">
        <span className="text-lg sm:text-2xl font-bold text-orange-500">{formatCurrency(totalAmount)}</span>
       </td>
     </tr>
  );
}

export function DesktopItemsTable({ items, totalAmount }: DesktopItemsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-125">
        <TableHeader />
        <tbody>
          {items.map((item) => (
            <TableRow key={item.id} item={item} />
          ))}
          <TotalRow totalAmount={totalAmount} />
        </tbody>
      </table>
    </div>
  );
}