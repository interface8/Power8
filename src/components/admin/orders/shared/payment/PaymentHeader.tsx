"use client";

import {
  CreditCard,
  AlertCircle,
  Wallet,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { PaymentStatus, PaymentType } from "@/types/order";
import { statusConfig } from "./paymentUtils";

const iconMap = {
  AlertCircle: <AlertCircle className="h-4 w-4" />,
  Wallet: <Wallet className="h-4 w-4" />,
  CheckCircle2: <CheckCircle2 className="h-4 w-4" />,
  XCircle: <XCircle className="h-4 w-4" />,
  RefreshCw: <RefreshCw className="h-4 w-4" />,
};

interface PaymentHeaderProps {
  currentStatus: PaymentStatus;
  paymentType: PaymentType;
}

export function PaymentHeader({
  currentStatus,
  paymentType,
}: PaymentHeaderProps) {
  const isCreditOrder = paymentType === "CREDIT";
  const config = statusConfig[currentStatus];
  const Icon = iconMap[config.iconName as keyof typeof iconMap];

  return (
    <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-gray-100 bg-gray-50/50">
      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 rounded-xl bg-orange-100">
            <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-gray-900">
              Payment Management
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              {isCreditOrder ? "Credit Order" : "Full Payment"}
            </p>
          </div>
        </div>
        <div
          className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${config.color}`}
        >
          <span className="flex items-center gap-1 sm:gap-1.5">
            {Icon}
            <span className="hidden xs:inline">{config.label}</span>
            <span className="xs:hidden">{config.label}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
