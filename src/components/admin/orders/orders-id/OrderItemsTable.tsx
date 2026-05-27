"use client";

import { OrderItem } from "@/types/order";

import { ItemsHeader } from "../shared/orderIdItems/ItemsHeader";
import { MobileItemCard } from "../shared/orderIdItems/MobileItemCard";
import { DesktopItemsTable } from "../shared/orderIdItems/DesktopItemsTable";
import { formatCurrency } from "../shared/orderIdItems/itemUtils";

interface OrderItemsTableProps {
  items: OrderItem[];
  totalAmount: number;
}

export function OrderItemsTable({
  items,
  totalAmount,
}: OrderItemsTableProps) {
  if (items.length === 0) {
    return (
      <div className="mb-6 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <ItemsHeader />

        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 rounded-2xl bg-orange-50 p-4">
            <div className="h-10 w-10 rounded-xl bg-orange-100" />
          </div>

          <h3 className="text-lg font-semibold text-gray-900">
            No Items Found
          </h3>

          <p className="mt-1 max-w-sm text-sm text-gray-500">
            This order currently has no products attached to it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="mb-6 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      <ItemsHeader />

      {/* Mobile */}
      <div className="block lg:hidden">
        <div className="divide-y divide-gray-100">
          {items.map((item) => (
            <MobileItemCard key={item.id} item={item} />
          ))}
        </div>

        <div className="border-t border-gray-200 bg-linear-to-r from-orange-50/70 to-white px-5 py-5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-gray-700">
              Total Amount
            </span>

            <span className="text-2xl font-bold tracking-tight text-orange-600">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block">
        <DesktopItemsTable
          items={items}
          totalAmount={totalAmount}
        />
      </div>
    </section>
  );
}