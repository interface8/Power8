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

export function OrderItemsTable({ items, totalAmount }: OrderItemsTableProps) {
  if (items.length === 0) {
    return (
      <div className="mb-6 overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200 bg-white shadow-sm">
        <ItemsHeader />
        <div className="p-8 sm:p-12 text-center">
          <p className="text-gray-500">No items in this order</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200 bg-white shadow-sm">
      <ItemsHeader />

      {/* Mobile View */}
      <div className="block md:hidden divide-y divide-gray-100">
        {items.map((item) => (
          <MobileItemCard key={item.id} item={item} />
        ))}

        {/* Mobile Total */}
        <div className="border-t border-gray-100 bg-linear-to-r from-orange-50/50 to-white p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base font-semibold text-gray-900">
              Total Amount
            </span>
            <span className="text-xl sm:text-2xl font-bold text-orange-500">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <DesktopItemsTable items={items} totalAmount={totalAmount} />
      </div>
    </div>
  );
}
