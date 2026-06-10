"use client";
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
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-green-400 via-green-500 to-orange-600" />
        <div className="relative p-4 sm:p-6">
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
