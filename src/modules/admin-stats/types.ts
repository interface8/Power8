export type AdminStatsDto = {
  totalRegisteredUsers: number;
  activeCreditAccounts: number;
  overduePaymentSchedules: number;
  totalRevenue: number; // sum of SUCCESS payments
  lowStockProducts: {
    threshold: number;
    count: number;
  };
};

export type GetAdminStatsInput = {
  lowStockThreshold?: number; // default in service
};
