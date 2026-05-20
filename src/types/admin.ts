export interface RecentOrder {
  id: string;
  customerName: string;
  customerEmail: string;

  totalAmount: number;

  paymentType: string;

  orderStatus: string;

  createdAt: string;
  updatedAt: string;
}

export interface AdminProductsStats {
  inStock: number;
  outOfStock: number;
  lowStock: number;
}

export interface AdminStats {
  totalRegisteredUsers: number;

  activeCreditAccounts: number;

  overduePaymentSchedules: number;

  totalRevenue: number;

  totalOrders: number;

  products: AdminProductsStats;

  recentOrders: RecentOrder[];
}
