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

    prevMonthUsers,
    prevMonthOrders,
    prevMonthActiveCredits,
    prevMonthOverdue,
    prevMonthInStock,
    prevMonthOutOfStock,
    prevMonthLowStock,

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

    prisma.user.count({ where: { createdAt: { gte: prevMonthStart, lte: prevMonthEnd } } }),
    prisma.order.count({ where: { createdAt: { gte: prevMonthStart, lte: prevMonthEnd } } }),
    prisma.creditAccount.count({
      where: { status: "ACTIVE", createdAt: { gte: prevMonthStart, lte: prevMonthEnd } },
    }),
    prisma.paymentSchedule.count({
      where: { status: "OVERDUE", createdAt: { gte: prevMonthStart, lte: prevMonthEnd } },
    }),

    // Previous Month Products snapshots (based on creation date)
    prisma.product.count({
      where: {
        isActive: true,
        stockQuantity: { gt: lowStockThreshold },
        createdAt: { gte: prevMonthStart, lte: prevMonthEnd },
      },
    }),
    prisma.product.count({
      where: {
        isActive: true,
        stockQuantity: { lte: 0 },
        createdAt: { gte: prevMonthStart, lte: prevMonthEnd },
      },
    }),
    prisma.product.count({
      where: {
        isActive: true,
        stockQuantity: { gt: 0, lte: lowStockThreshold },
        createdAt: { gte: prevMonthStart, lte: prevMonthEnd },
      },
    }),

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
      select: {
        id: true,
        totalAmount: true,
        paymentType: true,
        status: true,
        installationAddress: true,
        city: true,
        state: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { name: true, email: true } },
      }
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
    previousMonthUsers: prevMonthUsers,
    previousMonthTotalOrder: prevMonthOrders,
    previousMonthActiveCredits: prevMonthActiveCredits,
    previousMonthOverduePayment: prevMonthOverdue,
    previousMonthInStock: prevMonthInStock,
    previousMonthOutOfStock: prevMonthOutOfStock,
    previousMonthLowStock: prevMonthLowStock,

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
