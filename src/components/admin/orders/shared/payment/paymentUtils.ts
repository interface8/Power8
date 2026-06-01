import { PaymentStatus } from "@/types/order";

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Backend allowed transitions
export const allowedTransitions: Record<PaymentStatus, PaymentStatus[]> = {
  PENDING: ["PARTIALLY_PAID", "PAID", "FAILED"],
  PARTIALLY_PAID: ["PAID", "FAILED"],
  PAID: ["REFUNDED"],
  FAILED: ["PENDING"],
  REFUNDED: [],
};

export const buttonConfig: Record<
  PaymentStatus,
  { label: string; iconName: string; color: string }
> = {
  PENDING: {
    label: "Pending",
    iconName: "AlertCircle",
    color: "bg-yellow-500 hover:bg-yellow-600",
  },
  PARTIALLY_PAID: {
    label: "Partially Paid",
    iconName: "Wallet",
    color: "bg-orange-500 hover:bg-orange-600",
  },
  PAID: {
    label: "Paid",
    iconName: "CheckCircle2",
    color: "bg-green-500 hover:bg-green-600",
  },
  FAILED: {
    label: "Failed",
    iconName: "XCircle",
    color: "bg-red-500 hover:bg-red-600",
  },
  REFUNDED: {
    label: "Refunded",
    iconName: "RefreshCw",
    color: "bg-gray-500 hover:bg-gray-600",
  },
};

export const statusConfig: Record<
  PaymentStatus,
  { label: string; iconName: string; color: string }
> = {
  PENDING: {
    label: "Pending",
    iconName: "AlertCircle",
    color: "bg-yellow-100 text-yellow-700",
  },
  PARTIALLY_PAID: {
    label: "Partially Paid",
    iconName: "Wallet",
    color: "bg-orange-100 text-orange-700",
  },
  PAID: {
    label: "Paid",
    iconName: "CheckCircle2",
    color: "bg-green-100 text-green-700",
  },
  FAILED: {
    label: "Failed",
    iconName: "XCircle",
    color: "bg-red-100 text-red-700",
  },
  REFUNDED: {
    label: "Refunded",
    iconName: "RefreshCw",
    color: "bg-gray-100 text-gray-700",
  },
};

export const getDisplayValues = (
  status: PaymentStatus,
  totalAmount: number,
  totalPaid: number,
): { displayPaid: number; displayRemaining: number } => {
  switch (status) {
    case "PAID":
      return { displayPaid: totalAmount, displayRemaining: 0 };
    case "PARTIALLY_PAID":
      return {
        displayPaid: totalPaid,
        displayRemaining: Math.max(0, totalAmount - totalPaid),
      };
    case "PENDING":
      return { displayPaid: 0, displayRemaining: totalAmount };
    case "FAILED":
      return {
        displayPaid: totalPaid,
        displayRemaining: Math.max(0, totalAmount - totalPaid),
      };
    case "REFUNDED":
      return { displayPaid: 0, displayRemaining: totalAmount };
    default:
      return {
        displayPaid: totalPaid,
        displayRemaining: Math.max(0, totalAmount - totalPaid),
      };
  }
};

export const getProgressPercentage = (
  status: PaymentStatus,
  totalPaid: number,
  totalAmount: number,
): number => {
  switch (status) {
    case "PAID":
      return 100;
    case "PARTIALLY_PAID":
      return totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0;
    default:
      return 0;
  }
};
