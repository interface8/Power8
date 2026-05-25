"use client";

import { ShippingStatus } from "@/types/order";
import { StatusBadge } from "../../orders-id/StatusBadge";

interface ShippingStatusCardProps {
  currentStatus: ShippingStatus;
  trackingNumber: string | null;
  shippingProvider: string | null;
}

export function ShippingStatusCard({ currentStatus, trackingNumber, shippingProvider }: ShippingStatusCardProps) {
  return (
    <div className="mt-5 sm:mt-6 rounded-xl sm:rounded-2xl border border-gray-100 bg-gray-50/50 p-4 sm:p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="mb-2 text-xs sm:text-sm font-medium text-gray-500">Current Shipping Status</p>
          <StatusBadge status={currentStatus} size="sm" />
        </div>
        
        {trackingNumber && (
          <div className="rounded-xl border border-orange-100 bg-white px-3 sm:px-4 py-2 sm:py-3 w-full md:w-auto">
            <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide text-gray-500">Tracking Number</p>
            <p className="mt-0.5 font-semibold text-sm sm:text-base text-gray-900 break-all">{trackingNumber}</p>
            {shippingProvider && (
              <p className="mt-0.5 text-xs sm:text-sm text-gray-500">{shippingProvider}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}