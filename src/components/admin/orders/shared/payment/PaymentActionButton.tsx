"use client";

import {
  AlertCircle,
  Wallet,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { PaymentStatus } from "@/types/order";
import { allowedTransitions, buttonConfig } from "./paymentUtils";

const iconMap = {
  AlertCircle: <AlertCircle className="h-4 w-4" />,
  Wallet: <Wallet className="h-4 w-4" />,
  CheckCircle2: <CheckCircle2 className="h-4 w-4" />,
  XCircle: <XCircle className="h-4 w-4" />,
  RefreshCw: <RefreshCw className="h-4 w-4" />,
};

interface PaymentActionButtonsProps {
  currentStatus: PaymentStatus;
  onUpdateStatus: (status: PaymentStatus) => void;
  isLoading: boolean;
}

export function PaymentActionButtons({
  currentStatus,
  onUpdateStatus,
  isLoading,
}: PaymentActionButtonsProps) {
  const allowedNextStatuses = allowedTransitions[currentStatus] || [];

  if (allowedNextStatuses.length === 0) return null;

  return (
    <div className="mb-4 sm:mb-6">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 sm:mb-3">
        Update Status
      </p>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {allowedNextStatuses.map((status) => {
          const config = buttonConfig[status];
          const Icon = iconMap[config.iconName as keyof typeof iconMap];
          return (
            <button
              key={status}
              onClick={() => onUpdateStatus(status)}
              disabled={isLoading}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-white transition-all ${config.color} hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {Icon}
              <span className="hidden xs:inline">{config.label}</span>
              <span className="xs:hidden">{config.label.substring(0, 6)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
