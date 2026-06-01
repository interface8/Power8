"use client";

import { cn } from "@/components/ui/utils";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
  PAID: "bg-green-100 text-green-700",
  PARTIALLY_PAID: "bg-orange-100 text-orange-700",
  FAILED: "bg-red-100 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-700",
  FULL: "bg-emerald-100 text-emerald-700",
  CREDIT: "bg-orange-100 text-amber-700",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-xs sm:text-sm",
};

export function OrderStatusBadge({ status, size = "md" }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        sizeStyles[size],
        statusStyles[status] ?? "bg-gray-100 text-gray-700"
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

// Re-export for backward compatibility
export const PaymentStatusBadge = OrderStatusBadge;
export const PaymentTypeBadge = OrderStatusBadge;
export const ShippingStatusBadge = OrderStatusBadge;