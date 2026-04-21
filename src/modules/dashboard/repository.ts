import { prisma } from "@/lib/prisma";
import type { DashboardOverviewDto, DashboardPaymentDto, UserSavingDto } from "./types";

export async function getOverview(userId: string): Promise<DashboardOverviewDto> {
  const [systems, orders] = await Promise.all([
    prisma.solarSystem.groupBy({
      by: ["status"],
      where: { userId },
      _count: true,
    }),
    prisma.order.groupBy({
      by: ["status"],
      where: { userId },
      _count: true,
    }),
  ]);

  const systemCounts = { ACTIVE: 0, LIMITED: 0, DISABLED: 0 };
  for (const s of systems) {
    systemCounts[s.status as keyof typeof systemCounts] = s._count;
  }

  const orderCounts = { PENDING: 0, ACTIVE: 0, COMPLETED: 0, CANCELLED: 0 };
  for (const o of orders) {
    orderCounts[o.status as keyof typeof orderCounts] = o._count;
  }

  return {
    totalSystems: systemCounts.ACTIVE + systemCounts.LIMITED + systemCounts.DISABLED,
    activeSystems: systemCounts.ACTIVE,
    limitedSystems: systemCounts.LIMITED,
    disabledSystems: systemCounts.DISABLED,
    totalOrders: orderCounts.PENDING + orderCounts.ACTIVE + orderCounts.COMPLETED + orderCounts.CANCELLED,
    pendingOrders: orderCounts.PENDING,
    activeOrders: orderCounts.ACTIVE,
    completedOrders: orderCounts.COMPLETED,
  };
}

export async function getSavings(userId: string): Promise<UserSavingDto[]> {
  const savings = await prisma.userSaving.findMany({
    where: { userId },
    include: {
      system: {
        include: {
          bundle: { select: { name: true } },
        },
      },
    },
  });

  return savings.map((s) => ({
    id: s.id,
    systemId: s.systemId,
    bundleName: s.system.bundle.name,
    estimatedAnnualSavings: s.estimatedAnnualSavings?.toNumber() ?? null,
  }));
}

export async function getPaymentSummary(userId: string): Promise<DashboardPaymentDto> {
  const [payments, credits] = await Promise.all([
    prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.creditAccount.findMany({
      where: { order: { userId } },
    }),
  ]);

  const totalPaid = payments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + p.amount.toNumber(), 0);

  const totalRemaining = credits.reduce(
    (sum, c) => sum + c.balanceRemaining.toNumber(),
    0,
  );

  return {
    totalPaid,
    totalRemaining,
    recentPayments: payments.map((p) => ({
      id: p.id,
      amount: p.amount.toNumber(),
      status: p.status as "SUCCESS" | "FAILED",
      paidAt: p.paidAt,
      createdAt: p.createdAt,
    })),
  };
}
