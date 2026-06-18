"use client";

import { CheckCircle2, PackageCheck } from "lucide-react";
import { ShippingStatus } from "@/types/order";

interface ShippingActionButtonsProps {
  currentStatus: ShippingStatus;
  canUpdate: boolean;
  isLoading: boolean;
  onStatusClick: (status: ShippingStatus) => void;
}

const shippingStatuses: ShippingStatus[] = ["PROCESSING", "SHIPPED", "DELIVERED"];

const allowedTransitions: Record<ShippingStatus, ShippingStatus[]> = {
  PENDING: ["PROCESSING", "SHIPPED"],
  PROCESSING: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  RETURNED: [],
};

function ActionButton({ 
  status, 
  isActive, 
  disabled, 
  onClick 
}: { 
  status: ShippingStatus; 
  isActive: boolean; 
  disabled: boolean; 
  onClick: () => void;
}) {
  const getStyles = () => {
    if (isActive) {
      switch (status) {
        case "PROCESSING": 
          return "border-blue-500 bg-blue-500 text-white shadow-blue-100";
        case "SHIPPED": 
          return "border-orange-500 bg-orange-500 text-white shadow-orange-100";
        case "DELIVERED": 
          return "border-green-500 bg-green-500 text-white shadow-green-100";
        default: 
          return "border-orange-500 bg-orange-500 text-white shadow-orange-100";
      }
    }
    return "border-gray-200 bg-white text-gray-700 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700";
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex shrink-0 items-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl border px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 ${getStyles()} ${
        disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-md active:scale-95"
      }`}
    >
      {status === "DELIVERED" ? <CheckCircle2 className="h-4 w-4" /> : <PackageCheck className="h-4 w-4" />}
      <span className="whitespace-nowrap">{status}</span>
    </button>
  );
}

export function ShippingActionButtons({ currentStatus, canUpdate, isLoading, onStatusClick }: ShippingActionButtonsProps) {
  const availableStatuses = allowedTransitions[currentStatus] ?? [];

  return (
    <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible">
      {shippingStatuses.map((status) => (
        <ActionButton
          key={status}
          status={status}
          isActive={currentStatus === status}
          disabled={
            !canUpdate ||
            currentStatus === status ||
            !availableStatuses.includes(status) ||
            isLoading
          }
          onClick={() => onStatusClick(status)}
        />
      ))}
    </div>
  );
}
