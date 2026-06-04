export interface RecentOrder {
  id: string;
  customerName: string;
  customerEmail: string;

  totalAmount: number;

  paymentType: string;
  installationAddress: string | null;
  city: string | null;
  state: string | null;

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

  previousMonthRevenue: number;
  previousMonthUsers: number;
  previousMonthTotalOrder: number;
  previousMonthActiveCredits: number;
  previousMonthOverduePayment: number;
  previousMonthInStock: number;
  previousMonthOutOfStock: number;
  previousMonthLowStock: number;

  totalOrders: number;

  products: AdminProductsStats;

  recentOrders: RecentOrder[];
}
