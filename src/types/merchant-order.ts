export interface MerchantOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  paymentType: "FULL" | "CREDIT";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  orderStatus: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "COMPLETED" | "CANCELLED";
  shippingStatus: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED";
  createdAt: string;
  updatedAt: string;
}

export interface MerchantOrderStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
}

export interface MerchantOrderFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentType?: string;
  paymentStatus?: string;
}