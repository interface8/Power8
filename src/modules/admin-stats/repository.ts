import { prisma } from "@/lib/prisma";
import type { AdminStatsDto } from "./types";

export async function getAdminStats(
  lowStockThreshold: number,
): Promise<AdminStatsDto> {
  const recentTake = 10;

  const now = new Date();
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  const [
    totalRegisteredUsers,
    activeCreditAccounts,
    overduePaymentSchedules,
    revenueAgg,
    prevMonthRevenueAgg,
    totalOrders,

    inStock,
    outOfStock,
    lowStock,

    recentOrders,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.creditAccount.count({ where: { status: "ACTIVE" } }),

    prisma.paymentSchedule.count({ where: { status: "OVERDUE" } }),

    prisma.payment.aggregate({
      where: { status: "SUCCESS" },
      _sum: { amount: true },
    }),

    prisma.payment.aggregate({
      where: {
        status: "SUCCESS",
        paidAt: {
          gte: prevMonthStart,
          lte: prevMonthEnd,
        },
      },
      _sum: { amount: true },
    }),

    prisma.order.count(),

    // Products buckets:
    // - outOfStock: <= 0
    // - lowStock: 1..threshold
    // - inStock: > threshold
    prisma.product.count({
      where: { isActive: true, stockQuantity: { gt: lowStockThreshold } },
    }),
    prisma.product.count({
      where: { isActive: true, stockQuantity: { lte: 0 } },
    }),
    prisma.product.count({
      where: {
        isActive: true,
        stockQuantity: { gt: 0, lte: lowStockThreshold },
      },
    }),

    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: recentTake,
      include: {
        user: { select: { name: true, email: true } },
      },
    }),
  ]);

  const totalRevenue = revenueAgg._sum.amount?.toNumber() ?? 0;
  const previousMonthRevenue = prevMonthRevenueAgg._sum.amount?.toNumber() ?? 0;

  return {
    totalRegisteredUsers,
    activeCreditAccounts,
    overduePaymentSchedules,
    totalRevenue,
    previousMonthRevenue,

    totalOrders,

    products: { inStock, outOfStock, lowStock },

    recentOrders: recentOrders.map((o) => ({
      id: o.id,
      customerName: o.user.name,
      customerEmail: o.user.email,
      totalAmount: o.totalAmount.toNumber(),
      paymentType: o.paymentType,
      installationAddress: o.installationAddress,
      city: o.city,
      state: o.state,
      orderStatus: o.status,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
    })),
  };
}
