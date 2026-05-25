"use client";

import { Package2 } from "lucide-react";
import { OrderItem } from "@/types/order";
import { formatCurrency } from "./itemUtils";

interface MobileItemCardProps {
  item: OrderItem;
}

export function MobileItemCard({ item }: MobileItemCardProps) {
  return (
    <div className="p-4 sm:p-5 transition-colors hover:bg-orange-50/40">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100">
              <Package2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h3>
              <p className="mt-0.5 text-xs text-gray-500">Qty: {item.quantity}</p>
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-gray-900">{formatCurrency(item.subtotal)}</p>
          <p className="mt-0.5 text-xs text-gray-500">{formatCurrency(item.unitPrice)} each</p>
        </div>
      </div>
    </div>
  );
}