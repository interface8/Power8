<<<<<<< HEAD
=======
import { OrderStatus, PaymentType } from "@prisma/client";

>>>>>>> sprint-03
export type AdminStatsDto = {
  totalRegisteredUsers: number;
  activeCreditAccounts: number;
  overduePaymentSchedules: number;
<<<<<<< HEAD
  totalRevenue: number; // sum of SUCCESS payments
  lowStockProducts: {
    threshold: number;
    count: number;
  };
};

export type GetAdminStatsInput = {
  lowStockThreshold?: number; // default in service
};
=======
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
>>>>>>> sprint-03
