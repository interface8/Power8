"use client";

import {
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Truck,
  CreditCard,
  AlertCircle,
} from "lucide-react";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

const statusConfig: Record<string, { color: string; icon: JSX.Element }> = {
  PENDING: {
    color: "bg-yellow-100 text-yellow-800",
    icon: <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />,
  },
  CONFIRMED: {
    color: "bg-blue-100 text-blue-800",
    icon: <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />,
  },
  PROCESSING: {
    color: "bg-purple-100 text-purple-800",
    icon: <RefreshCw className="w-2.5 h-2.5 sm:w-3 sm:h-3" />,
  },
  SHIPPED: {
    color: "bg-indigo-100 text-indigo-800",
    icon: <Truck className="w-2.5 h-2.5 sm:w-3 sm:h-3" />,
  },
  DELIVERED: {
    color: "bg-green-100 text-green-800",
    icon: <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />,
  },
  COMPLETED: {
    color: "bg-emerald-100 text-emerald-800",
    icon: <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />,
  },
  CANCELLED: {
    color: "bg-red-100 text-red-800",
    icon: <XCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />,
  },
  PAID: {
    color: "bg-green-100 text-green-800",
    icon: <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />,
  },
  PARTIALLY_PAID: {
    color: "bg-orange-100 text-orange-800",
    icon: <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />,
  },
  FAILED: {
    color: "bg-red-100 text-red-800",
    icon: <XCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />,
  },
  REFUNDED: {
    color: "bg-gray-100 text-gray-800",
    icon: <RefreshCw className="w-2.5 h-2.5 sm:w-3 sm:h-3" />,
  },
  ACTIVE: {
    color: "bg-green-100 text-green-800",
    icon: <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />,
  },
  FULL: {
    color: "bg-emerald-100 text-emerald-800",
    icon: <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />,
  },
  CREDIT: {
    color: "bg-orange-100 text-orange-800",
    icon: <CreditCard className="w-2.5 h-2.5 sm:w-3 sm:h-3" />,
  },
  OVERDUE: {
    color: "bg-red-100 text-red-800",
    icon: <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />,
  },
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.PENDING;
  const padding =
    size === "sm" ? "px-1.5 py-0.5" : "px-2 py-1 sm:px-2.5 sm:py-1";
  const textSize = size === "sm" ? "text-[10px]" : "text-[11px] sm:text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${padding} ${textSize} ${config.color}`}
    >
      {config.icon}
      <span className="hidden xs:inline">{status.replace(/_/g, " ")}</span>
      <span className="xs:hidden">
        {status.replace(/_/g, " ").substring(0, 7)}
      </span>
    </span>
  );
}
