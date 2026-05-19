import { OrderStatus, PaymentType } from "@prisma/client";

export type AdminStatsDto = {
  totalRegisteredUsers: number;
  activeCreditAccounts: number;
  overduePaymentSchedules: number;
  totalRevenue: number;

  totalOrders: number;

  products: {
    inStock: number;
    outOfStock: number;
    lowStock: number;
  };

  recentOrders: Array<{
    id: string;
    customerName: string;
    customerEmail: string;
    totalAmount: number;
    paymentType: PaymentType
    orderStatus: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
  }>;
};

export type GetAdminStatsInput = {
  lowStockThreshold?: number;
};