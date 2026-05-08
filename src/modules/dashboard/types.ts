export interface UserSavingDto {
  id: string;
  systemId: string;
  bundleName: string;
  estimatedAnnualSavings: number | null;
}

export interface DashboardOverviewDto {
  totalSystems: number;
  activeSystems: number;
  limitedSystems: number;
  disabledSystems: number;
  totalOrders: number;
  pendingOrders: number;
  activeOrders: number;
  completedOrders: number;
}

export interface DashboardPaymentDto {
  totalPaid: number;
  totalRemaining: number;
  recentPayments: {
    id: string;
    amount: number;
    status: "SUCCESS" | "FAILED";
    paidAt: Date | null;
    createdAt: Date;
  }[];
}
