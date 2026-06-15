"use client";

import { Package2 } from "lucide-react";

import { OrderItem } from "@/types/order";

import {
  formatCurrency,
  getItemTypeLabel,
} from "./itemUtils";

interface MobileItemCardProps {
  item: OrderItem;
}

export function MobileItemCard({
  item,
}: MobileItemCardProps) {
  return (
    <div className="p-5 transition-colors hover:bg-orange-50/40">
      <div className="flex items-start gap-4">
        <div
          className="
            flex h-11 w-11 shrink-0 items-center justify-center
            rounded-2xl bg-orange-50
          "
        >
          <Package2 className="h-5 w-5 text-orange-500" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-gray-900">
                {item.name}
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                {getItemTypeLabel(item.itemType)}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-sm font-bold text-gray-900">
                {formatCurrency(item.subtotal)}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {formatCurrency(item.unitPrice)} each
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">
              Quantity
            </span>

            <span
              className="
                inline-flex items-center justify-center
                rounded-full bg-gray-100
                px-3 py-1 text-xs font-semibold text-gray-700
              "
            >
              {item.quantity}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}