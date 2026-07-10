"use client";

import type { ProductApprovalStatus } from "@/types/merchant-product";

interface ProductStatusBadgeProps {
  status: ProductApprovalStatus | string;
  onViewReason?: () => void;
}

export function ProductStatusBadge({
  status,
  onViewReason,
}: ProductStatusBadgeProps) {
  const config: Record<ProductApprovalStatus, { label: string; className: string }> = {
    APPROVED: {
      label: "Approved",
      className: "bg-green-100 text-green-700",
    },
    PENDING: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-700",
    },
    REJECTED: {
      label: "Rejected",
      className: "bg-red-100 text-red-700",
    },
  };

  const normalizedStatus = status.toUpperCase() as ProductApprovalStatus;
  const { label, className } =
    config[normalizedStatus] ?? config.PENDING;

  return (
    <div className="flex flex-col items-start gap-0.5">
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
      >
        {label}
      </span>
      {normalizedStatus === "REJECTED" && onViewReason && (
        <button
          type="button"
          onClick={onViewReason}
          className="text-xs text-gray-500 hover:text-gray-700 hover:underline transition-colors"
        >
          View reason
        </button>
      )}
    </div>
  );
}