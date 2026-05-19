import { prisma } from "@/lib/prisma";
import type { AdminStatsDto } from "./types";

export async function getAdminStats(lowStockThreshold: number): Promise<AdminStatsDto> {
  const [
    totalRegisteredUsers,
    activeCreditAccounts,
    overduePaymentSchedules,
    revenueAgg,
    lowStockCount,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.creditAccount.count({
      where: { status: "ACTIVE" },
    }),

    prisma.paymentSchedule.count({
      where: { status: "OVERDUE" },
    }),

    prisma.payment.aggregate({
      where: { status: "SUCCESS" },
      _sum: { amount: true },
    }),

    prisma.product.count({
      where: {
        stockQuantity: { lte: lowStockThreshold },
        isActive: true, 
      },
    }),
  ]);

  const totalRevenue = revenueAgg._sum.amount?.toNumber() ?? 0;

  return {
    totalRegisteredUsers,
    activeCreditAccounts,
    overduePaymentSchedules,
    totalRevenue,
    lowStockProducts: {
      threshold: lowStockThreshold,
      count: lowStockCount,
    },
  };
}
