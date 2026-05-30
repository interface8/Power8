export type OrderStatus = 
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus = 
  | "PENDING"
  | "PARTIALLY_PAID"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

export type PaymentType = "FULL" | "CREDIT";

export type ShippingStatus = 
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "RETURNED";

export type ScheduleStatus = "PENDING" | "PAID" | "OVERDUE";

export type CreditStatus = "ACTIVE" | "COMPLETED" | "DEFAULTED";

// Order item from API
export interface OrderItem {
  id: string;
  itemType: "PRODUCT" | "BUNDLE";
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

// Payment history item
export interface PaymentHistoryItem {
  id: string;
  amount: number;
  status: PaymentStatus;
  reference: string;
  paidAt: string | null;
  createdAt: string;
}

// Credit schedule item
export interface CreditScheduleItem {
  id: string;
  dueDate: string;
  amountDue: number;
  status: ScheduleStatus;
  createdAt: string;
  updatedAt: string;
}

// Credit account
export interface CreditAccount {
  id: string;
  totalAmount: number;
  balanceRemaining: number;
  durationMonths: number;
  status: CreditStatus;
  schedules: CreditScheduleItem[];
}

// Full order detail (matches backend response)
export interface AdminOrderDetail {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  totalAmount: number;
  paymentType: PaymentType;
  installationAddress: string | null;
  city: string | null;
  state: string | null;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  shipping: {
    status: ShippingStatus;
    trackingNumber: string | null;
    shippingProvider: string | null;
  };
  items: OrderItem[];
  payment: {
    totalPaid: number;
    remainingBalance: number;
    history: PaymentHistoryItem[];
  };
  credit: CreditAccount | null;
}

// List row (simplified for table)
export interface AdminOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  paymentType: PaymentType;
  installationAddress: string | null;
  city: string | null;
  state: string | null;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingStatus: ShippingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  data: AdminOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus | "";
  paymentType?: PaymentType | "";
  paymentStatus?: PaymentStatus | "";
}