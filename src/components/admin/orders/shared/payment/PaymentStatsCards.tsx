"use client";

import { PaymentStatus, PaymentType } from "@/types/order";
import { formatCurrency } from "./paymentUtils";

interface PaymentStatsCardsProps {
  currentStatus: PaymentStatus;
  paymentType: PaymentType;
  displayPaid: number;
  displayRemaining: number;
}

export function PaymentStatsCards({ currentStatus, paymentType, displayPaid, displayRemaining }: PaymentStatsCardsProps) {
  const isCreditOrder = paymentType === "CREDIT";
  const isPaid = currentStatus === "PAID";

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 mb-4">
      {/* Paid Card */}
      <div className={`rounded-lg sm:rounded-xl p-3 sm:p-4 border ${isPaid ? "bg-green-50 border-green-200" : "bg-green-50/50 border-green-100"}`}>
        <p className="text-xs sm:text-sm text-gray-600">
          {isPaid ? "Total Paid" : "Amount Received"}
        </p>
        <p className={`text-lg sm:text-2xl font-bold ${isPaid ? "text-green-600" : "text-green-600"}`}>
          {formatCurrency(displayPaid)}
        </p>
      </div>

      {/* Remaining Card */}
      <div className={`rounded-lg sm:rounded-xl p-3 sm:p-4 border ${
        displayRemaining === 0 ? "bg-green-50/30 border-green-100" : "bg-red-50/50 border-red-100"
      }`}>
        <p className="text-xs sm:text-sm text-gray-600">
          {isPaid ? "Balance" : isCreditOrder ? "Outstanding" : "Remaining"}
        </p>
        <p className={`text-lg sm:text-2xl font-bold ${
          displayRemaining === 0 ? "text-green-500" : "text-red-500"
        }`}>
          {formatCurrency(displayRemaining)}
        </p>
        {isPaid && displayRemaining === 0 && (
          <p className="text-xs text-green-600 mt-1">✓ Fully settled</p>
        )}
      </div>
    </div>
  );
}