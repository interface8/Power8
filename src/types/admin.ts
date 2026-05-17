export interface RecentOrder {
  id: string;
  customerName: string;
  amount: number;
  paymentType: string;
  status: string;
  createdAt: string;
}

export interface AdminStats {
  totalRevenue: number;
  activeUsers: number;
  overduePaymentSchedules: number;
  totalOrders: number;

  inStockProducts: number;
  outOfStockProducts: number;

  lowStockProduct?: number;

  recentOrders: RecentOrder[];
}
