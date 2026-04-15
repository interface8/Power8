// src/types/dashboard.ts

export interface SolarSystem {
  id: string;
  userId: string;
  orderId: string;
  bundleId: string;
  bundleName?: string;
  status: "ACTIVE" | "LIMITED" | "DISABLED";
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  status: string;
}

export interface PaymentSummary {
  totalPaid: number;
  totalRemaining: number;
  recentPayments: Payment[];
}

export interface DashboardOverview {
  totalSystems: number;
  activeSystems: number;
  limitedSystems: number;
  disabledSystems: number;
  totalOrders: number;
  pendingOrders: number;
  activeOrders: number;
  completedOrders: number;
}
