import { OrderStatus, PaymentStatus, PaymentType } from "@/types/order";

export interface FilterOption {
  value: string;
  label: string;
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const truncateOrderId = (id: string, length: number = 8) => {
  return id.slice(0, length);
};

export const orderStatusOptions: FilterOption[] = [
  { value: "", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const paymentTypeOptions: FilterOption[] = [
  { value: "", label: "All Payment Types" },
  { value: "FULL", label: "Full Payment" },
  { value: "CREDIT", label: "Credit" },
];

export const paymentStatusOptions: FilterOption[] = [
  { value: "", label: "All Payment Status" },
  { value: "PENDING", label: "Pending" },
  { value: "PARTIALLY_PAID", label: "Partially Paid" },
  { value: "PAID", label: "Paid" },
  { value: "FAILED", label: "Failed" },
  { value: "REFUNDED", label: "Refunded" },
];

// Helper to convert string to proper type
export const toOrderStatus = (value: string): OrderStatus | undefined => {
  if (!value) return undefined;
  return value as OrderStatus;
};

export const toPaymentType = (value: string): PaymentType | undefined => {
  if (!value) return undefined;
  return value as PaymentType;
};

export const toPaymentStatus = (value: string): PaymentStatus | undefined => {
  if (!value) return undefined;
  return value as PaymentStatus;
};
