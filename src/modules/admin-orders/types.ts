import type {
  CreditStatus,
  OrderPaymentStatus,
  OrderStatus,
  PaymentStatus,
  PaymentType,
  ScheduleStatus,
  ShippingStatus,
} from "@prisma/client";

export type AdminOrderListRowDto = {
  id: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  paymentType: PaymentType;
  paymentStatus: OrderPaymentStatus;
  orderStatus: OrderStatus;
  installationAddress: string | null;
  city: string | null;
  state: string | null;
  deliveryAddress: string | null;
  deliveryCity: string | null;
  deliveryState: string | null;
  shippingStatus: ShippingStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminOrdersListDto = {
  data: AdminOrderListRowDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type AdminOrderListFilters = {
  status?: OrderStatus;
  paymentType?: PaymentType;
  paymentStatus?: OrderPaymentStatus;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  page: number;
  limit: number;
};

export type AdminOrderPaymentHistoryItemDto = {
  id: string;
  amount: number;
  status: PaymentStatus;
  reference: string;
  paidAt: Date | null;
  createdAt: Date;
};

export type AdminOrderScheduleItemDto = {
  id: string;
  dueDate: Date;
  amountDue: number;
  status: ScheduleStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminOrderCreditAccountDto = {
  id: string;
  totalAmount: number;
  balanceRemaining: number;
  durationMonths: number;
  status: CreditStatus;
  schedules: AdminOrderScheduleItemDto[];
};

export type AdminOrderItemDetailDto = {
  id: string;
  itemType: "PRODUCT" | "BUNDLE";
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type AdminOrderDetailsDto = {
  id: string;

  customer: {
    id: string;
    name: string;
    email: string;
  };

  createdAt: Date;
  updatedAt: Date;

  totalAmount: number;
  paymentType: PaymentType;

  installationAddress: string | null;
  city: string | null;
  state: string | null;

  deliveryAddress: string | null;
  deliveryCity: string | null;
  deliveryState: string | null;

  orderStatus: OrderStatus;
  paymentStatus: OrderPaymentStatus;

  shipping: {
    status: ShippingStatus;
    trackingNumber: string | null;
    shippingProvider: string | null;
  };

  items: AdminOrderItemDetailDto[];

  payment: {
    totalPaid: number;
    remainingBalance: number;
    history: AdminOrderPaymentHistoryItemDto[];
  };

  credit: AdminOrderCreditAccountDto | null;
};

export type UpdateOrderStatusInput = {
  status: OrderStatus;
};