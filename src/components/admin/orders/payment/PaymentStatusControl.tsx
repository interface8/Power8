"use client";

import { PaymentStatus, PaymentType } from "@/types/order";
import { PaymentHeader } from "../shared/payment/PaymentHeader";
import { PaymentActionButtons } from "../shared/payment/PaymentActionButton";
import { PaymentStatsCards } from "../shared/payment/PaymentStatsCards";
import { PaymentProgressSection } from "../shared/payment/PaymentProgressBar";
import { getDisplayValues } from "../shared/payment/paymentUtils";

interface PaymentStatusControlProps {
  currentStatus: PaymentStatus;
  paymentType: PaymentType;
  totalAmount: number;
  totalPaid: number;
  onUpdateStatus: (status: PaymentStatus) => void;
  isLoading: boolean;
}

export function PaymentStatusControl({
  currentStatus,
  paymentType,
  totalAmount,
  totalPaid,
  onUpdateStatus,
  isLoading,
}: PaymentStatusControlProps) {
  const { displayPaid, displayRemaining } = getDisplayValues(currentStatus, totalAmount, totalPaid);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <PaymentHeader currentStatus={currentStatus} paymentType={paymentType} />
      
      <div className="p-3 sm:p-4 md:p-6">
        <PaymentActionButtons
          currentStatus={currentStatus}
          onUpdateStatus={onUpdateStatus}
          isLoading={isLoading}
        />
        
        <PaymentStatsCards
          currentStatus={currentStatus}
          paymentType={paymentType}
          displayPaid={displayPaid}
          displayRemaining={displayRemaining}
        />
        
        <PaymentProgressSection
          currentStatus={currentStatus}
          totalAmount={totalAmount}
          totalPaid={totalPaid}
        />
      </div>
    </div>
  );
}