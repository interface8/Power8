"use client";

import { ReceiptText } from "lucide-react";
import { StatusBadge } from "../../orders-id/StatusBadge";
import { formatDate, truncateOrderId } from "./headerUtils";

interface HeaderInfoProps {
  orderId: string;
  orderStatus: string;
  createdAt: string;
}

export function HeaderInfo({
  orderId,
  orderStatus,
  createdAt,
}: HeaderInfoProps) {
  return (
    <div className="flex items-start gap-3 sm:gap-4">
      {/* Icon */}
      <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-linear-to-br from-orange-100 to-orange-50 shadow-sm">
        <ReceiptText className="h-6 w-6 sm:h-7 sm:w-7 text-orange-600" />
      </div>

      {/* Info */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h1 className="break-all text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            {truncateOrderId(orderId)}
          </h1>
          <StatusBadge status={orderStatus} />
        </div>

        <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500">
          <span>
            Order placed on{" "}
            <span className="font-medium text-gray-700">
              {formatDate(createdAt)}.
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
