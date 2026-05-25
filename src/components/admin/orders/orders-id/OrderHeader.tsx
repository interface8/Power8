"use client";

import { BackButton } from "../shared/order/BackButton";
import { HeaderInfo } from "../shared/order/HeaderInfo";

interface OrderHeaderProps {
  orderId: string;
  orderStatus: string;
  createdAt: string;
}

export function OrderHeader({
  orderId,
  orderStatus,
  createdAt,
}: OrderHeaderProps) {
  return (
    <div className="mb-4 sm:mb-6">
      <BackButton href="/admin/orders" />

      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Gradient Accent Bar */}
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-green-400 via-green-500 to-orange-600" />
        <div className="relative flex flex-col gap-5 p-4 sm:p-6 md:flex-row md:items-center md:justify-between">
          <HeaderInfo
            orderId={orderId}
            orderStatus={orderStatus}
            createdAt={createdAt}
          />
        </div>
      </div>
    </div>
  );
}
