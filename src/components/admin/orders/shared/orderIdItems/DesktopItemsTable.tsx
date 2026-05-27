"use client";

import { Package2 } from "lucide-react";

import { OrderItem } from "@/types/order";

import {
  formatCurrency,
  getItemTypeLabel,
} from "./itemUtils";

interface DesktopItemsTableProps {
  items: OrderItem[];
  totalAmount: number;
}

function TableHeader() {
  return (
    <thead className="bg-gray-50">
      <tr className="border-b border-gray-200">
        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
          Product
        </th>

        <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">
          Quantity
        </th>

        <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">
          Unit Price
        </th>

        <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">
          Subtotal
        </th>
      </tr>
    </thead>
  );
}

function TableRow({ item }: { item: OrderItem }) {
  return (
    <tr className="border-b border-gray-100 transition-colors hover:bg-orange-50/40">
      <td className="px-6 py-5">
        <div className="flex items-center gap-4">
          <div
            className="
              flex h-12 w-12 shrink-0 items-center justify-center
              rounded-2xl bg-orange-50
            "
          >
            <Package2 className="h-5 w-5 text-orange-500" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">
              {item.name}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {getItemTypeLabel(item.itemType)}
            </p>
          </div>
        </div>
      </td>

      <td className="px-6 py-5 text-center">
        <span
          className="
            inline-flex min-w-10.5 items-center justify-center
            rounded-full bg-gray-100
            px-3 py-1 text-xs font-semibold text-gray-700
          "
        >
          {item.quantity}
        </span>
      </td>

      <td className="px-6 py-5 text-right">
        <span className="text-sm font-medium text-gray-700">
          {formatCurrency(item.unitPrice)}
        </span>
      </td>

      <td className="px-6 py-5 text-right">
        <span className="text-sm font-bold text-gray-900">
          {formatCurrency(item.subtotal)}
        </span>
      </td>
    </tr>
  );
}

function TotalRow({
  totalAmount,
}: {
  totalAmount: number;
}) {
  return (
    <tr className="bg-linear-to-r from-orange-50/70 to-white">
      <td
        colSpan={3}
        className="px-6 py-5 text-right"
      >
        <span className="text-sm font-semibold text-gray-700">
          Total Amount
        </span>
      </td>

      <td className="px-6 py-5 text-right">
        <span className="text-2xl font-bold tracking-tight text-orange-600">
          {formatCurrency(totalAmount)}
        </span>
      </td>
    </tr>
  );
}

export function DesktopItemsTable({
  items,
  totalAmount,
}: DesktopItemsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-190">
        <TableHeader />

        <tbody>
          {items.map((item) => (
            <TableRow
              key={item.id}
              item={item}
            />
          ))}

          <TotalRow totalAmount={totalAmount} />
        </tbody>
      </table>
    </div>
  );
}