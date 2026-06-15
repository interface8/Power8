"use client";

import { PaymentStatus } from "@/types/order";
import { formatCurrency, getProgressPercentage } from "./paymentUtils";

interface PaymentProgressSectionProps {
  currentStatus: PaymentStatus;
  totalAmount: number;
  totalPaid: number;
}

export function PaymentProgressSection({
  currentStatus,
  totalAmount,
  totalPaid,
}: PaymentProgressSectionProps) {
  const progressPercent = getProgressPercentage(
    currentStatus,
    totalPaid,
    totalAmount,
  );

  const getProgressBarColor = () => {
    if (currentStatus === "PAID") return "bg-green-500";
    if (currentStatus === "PARTIALLY_PAID")
      return "bg-gradient-to-r from-orange-400 to-orange-600";
    return "bg-gray-300";
  };

  const getHintText = () => {
    switch (currentStatus) {
      case "PENDING":
        return "Awaiting payment";
      case "PARTIALLY_PAID":
        return ` ${formatCurrency(totalPaid)} received of ${formatCurrency(totalAmount)}`;
      case "PAID":
        return "Payment completed successfully";
      case "FAILED":
        return " Payment failed";
      case "REFUNDED":
        return "Payment has been refunded";
      default:
        return "";
    }
  };

  const getProgressText = () => {
    if (currentStatus === "PAID") return "100%";
    if (currentStatus === "PARTIALLY_PAID")
      return `${Math.round(progressPercent)}%`;
    return "0%";
  };

  return (
    <div>
      <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
        <span>Progress</span>
        <span className="font-medium">{getProgressText()}</span>
      </div>
      <div className="h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor()}`}
          style={{ width: `${Math.min(100, progressPercent)}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-2 text-center">{getHintText()}</p>
    </div>
  );
}
