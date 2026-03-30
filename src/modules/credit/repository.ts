import { prisma } from "@/lib/prisma";
import type { CreditAccountDto, PaymentScheduleDto, ApplyCreditInput } from "./types";

const creditWithSchedules = {
  include: {
    schedules: {
      orderBy: { dueDate: "asc" as const },
    },
  },
} as const;

function toCreditDto(credit: {
  id: string;
  orderId: string;
  totalAmount: { toNumber: () => number };
  balanceRemaining: { toNumber: () => number };
  durationMonths: number;
  status: string;
  schedules: {
    id: string;
    dueDate: Date;
    amountDue: { toNumber: () => number };
    status: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}): CreditAccountDto {
  return {
    id: credit.id,
    orderId: credit.orderId,
    totalAmount: credit.totalAmount.toNumber(),
    balanceRemaining: credit.balanceRemaining.toNumber(),
    durationMonths: credit.durationMonths,
    status: credit.status as CreditAccountDto["status"],
    schedules: credit.schedules.map(
      (s): PaymentScheduleDto => ({
        id: s.id,
        dueDate: s.dueDate,
        amountDue: s.amountDue.toNumber(),
        status: s.status as PaymentScheduleDto["status"],
      }),
    ),
    createdAt: credit.createdAt,
    updatedAt: credit.updatedAt,
  };
}

export async function findCreditByOrderId(orderId: string): Promise<CreditAccountDto | null> {
  const credit = await prisma.creditAccount.findUnique({
    where: { orderId },
    ...creditWithSchedules,
  });
  return credit ? toCreditDto(credit) : null;
}

export async function findCreditById(id: string): Promise<CreditAccountDto | null> {
  const credit = await prisma.creditAccount.findUnique({
    where: { id },
    ...creditWithSchedules,
  });
  return credit ? toCreditDto(credit) : null;
}

export async function createCredit(input: ApplyCreditInput, totalAmount: number): Promise<CreditAccountDto> {
  const monthlyAmount = totalAmount / input.durationMonths;

  // Generate payment schedules — one per month starting from next month
  const schedules = Array.from({ length: input.durationMonths }, (_, i) => {
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + i + 1);
    dueDate.setDate(1); // Due on the 1st of each month
    return {
      dueDate,
      amountDue: Math.round(monthlyAmount * 100) / 100,
    };
  });

  const credit = await prisma.creditAccount.create({
    data: {
      orderId: input.orderId,
      totalAmount,
      balanceRemaining: totalAmount,
      durationMonths: input.durationMonths,
      schedules: {
        create: schedules,
      },
    },
    ...creditWithSchedules,
  });

  return toCreditDto(credit);
}
