"use client";

interface ProductStatusBadgeProps {
  status: "approved" | "pending" | "rejected";
  onViewReason?: () => void;
}

export function ProductStatusBadge({
  status,
  onViewReason,
}: ProductStatusBadgeProps) {
  const config = {
    approved: {
      label: "Approved",
      className: "bg-green-100 text-green-700",
    },
    pending: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-700",
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-100 text-red-700",
    },
  };

  const { label, className } = config[status];

  return (
    <div className="flex flex-col items-start gap-0.5">
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
      >
        {label}
      </span>
      {status === "rejected" && onViewReason && (
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