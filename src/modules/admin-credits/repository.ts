import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type {
  AdminCreditAccountFilters,
  AdminCreditAccountsListDto,
  AdminCreditAccountDetailsDto
} from "./types";

function getNextDueDate(
  schedules: Array<{ dueDate: Date; status: "PENDING" | "PAID" | "OVERDUE" }>,
) {
  const next = schedules
    .filter((schedule) => schedule.status !== "PAID")
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())[0];

  return next?.dueDate ?? null;
}

export async function findCreditAccounts(
  filters: AdminCreditAccountFilters,
): Promise<AdminCreditAccountsListDto> {
  const { status, search, page, limit } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.CreditAccountWhereInput = {};

  if (status) where.status = status;

  if (search) {
    where.OR = [
      { orderId: { contains: search, mode: "insensitive" } },
      { order: { user: { name: { contains: search, mode: "insensitive" } } } },
      { order: { user: { email: { contains: search, mode: "insensitive" } } } },
    ];
  }

  const [total, rows] = await Promise.all([
    prisma.creditAccount.count({ where }),
    prisma.creditAccount.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        order: {
          select: {
            id: true,
            createdAt: true,
            installationAddress: true,
            city: true,
            state: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        schedules: {
          select: {
            dueDate: true,
            status: true,
          },
        },
      },
    }),
  ]);

  return {
    data: rows.map((credit) => {
      const paidInstallments = credit.schedules.filter(
        (schedule) => schedule.status === "PAID",
      ).length;

      const overdueInstallments = credit.schedules.filter(
        (schedule) => schedule.status === "OVERDUE",
      ).length;

      const totalInstallments = credit.schedules.length;
      const remainingInstallments = totalInstallments - paidInstallments;

      return {
        id: credit.id,
        customer: {
          id: credit.order.user.id,
          name: credit.order.user.name,
          email: credit.order.user.email,
          phone: credit.order.user.phone,
        },
        orderId: credit.order.id,
        totalAmount: credit.totalAmount.toNumber(),
        balanceRemaining: credit.balanceRemaining.toNumber(),
        durationMonths: credit.durationMonths,
        status: credit.status,
        repayment: {
          paidInstallments,
          remainingInstallments,
          overdueInstallments,
          totalInstallments,
          nextDueDate: getNextDueDate(credit.schedules),
        },
        createdAt: credit.createdAt,
        installation: {
          address: credit.order.installationAddress ?? null,
          city: credit.order.city ?? null,
          state: credit.order.state ?? null,
        },
        orderCreatedAt: credit.order.createdAt,
      };
    }),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function findCreditAccountDetailsById(
  id: string,
): Promise<AdminCreditAccountDetailsDto | null> {
  const credit = await prisma.creditAccount.findUnique({
    where: { id },
    include: {
      order: {
        select: {
          id: true,
          createdAt: true,
          installationAddress: true,
          city: true,
          state: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      schedules: {
        orderBy: { dueDate: "asc" },
        select: {
          id: true,
          dueDate: true,
          amountDue: true,
          status: true,
        },
      },
    },
  });

  if (!credit) return null;

  const paidInstallments = credit.schedules.filter(
    (schedule) => schedule.status === "PAID",
  ).length;

  const overdueInstallments = credit.schedules.filter(
    (schedule) => schedule.status === "OVERDUE",
  ).length;

  const totalInstallments = credit.schedules.length;
  const remainingInstallments = totalInstallments - paidInstallments;

  return {
    id: credit.id,
    customer: {
      id: credit.order.user.id,
      name: credit.order.user.name,
      email: credit.order.user.email,
      phone: credit.order.user.phone,
    },
    order: {
      id: credit.order.id,
      createdAt: credit.order.createdAt,
    },
    installation: {
      address: credit.order.installationAddress ?? null,
      city: credit.order.city ?? null,
      state: credit.order.state ?? null,
    },
    totalAmount: credit.totalAmount.toNumber(),
    balanceRemaining: credit.balanceRemaining.toNumber(),
    durationMonths: credit.durationMonths,
    status: credit.status,
    repayment: {
      paidInstallments,
      remainingInstallments,
      overdueInstallments,
      totalInstallments,
      nextDueDate: getNextDueDate(credit.schedules),
    },
    schedules: credit.schedules.map((schedule, index) => ({
      id: schedule.id,
      installmentNumber: index + 1,
      dueDate: schedule.dueDate,
      amountDue: schedule.amountDue.toNumber(),
      status: schedule.status,
    })),
    createdAt: credit.createdAt,
  };
}
