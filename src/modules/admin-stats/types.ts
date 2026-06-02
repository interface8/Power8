import { OrderStatus, PaymentType } from "@prisma/client";

export type AdminStatsDto = {
  totalRegisteredUsers: number;
  activeCreditAccounts: number;
  overduePaymentSchedules: number;
  totalRevenue: number;
  previousMonthRevenue: number;
  previousMonthUsers: number;
  previousMonthTotalOrder: number;
  previousMonthActiveCredits: number;
  previousMonthOverduePayment: number;
  previousMonthInStock: number;
  previousMonthOutOfStock: number;
  previousMonthLowStock: number;

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
    installationAddress: string | null;
    city: string | null;
    state: string | null;
    orderStatus: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
  }>;
};

export type GetAdminStatsInput = {
  lowStockThreshold?: number;
};
