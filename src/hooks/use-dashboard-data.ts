"use client";

import { useOrders } from "@/hooks/use-orders";
import { usePayments } from "@/hooks/use-payments";
import { useCredit } from "@/hooks/use-credit";
import { useSchedule } from "@/hooks/use-schedule";

import type { Payment, Schedule, Credit } from "@/types/payment";

export function useDashboardData() {
  // FETCH DATA
  const { data: orders = [], isLoading: ordersLoading } = useOrders();
  const orderId = orders[0]?.id;

  const { data: payments = [], isLoading: paymentsLoading } =
    usePayments(orderId);

  const { data: credit, isLoading: creditLoading } = useCredit(orderId);

  const creditId = credit?.id;

  const { data: schedules = [], isLoading: scheduleLoading } =
    useSchedule(creditId);

  // SAFE CASTING
  const safePayments = payments as Payment[];
  const safeSchedules = schedules as Schedule[];
  const safeCredit = credit as Credit | undefined;

  // Total Paid
  const totalPaid = safePayments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + p.amount, 0);

  // Total Cost
  const totalCost = safeCredit?.totalAmount ?? 0;

  // Remaining (never negative)
  const totalRemaining = Math.max(totalCost - totalPaid, 0);

  // Installment tracking (TRUE progress)
  const paidSchedules = safeSchedules.filter((s) => s.status === "PAID");

  const monthsPaid = paidSchedules.length;
  const totalMonths = safeSchedules.length;

  const remainingMonths = Math.max(totalMonths - monthsPaid, 0);
  const monthlyPayment =
    remainingMonths > 0 ? Math.ceil(totalRemaining / remainingMonths) : 0;

  // UPCOMING PAYMENTS
  const upcomingPayments = safeSchedules
    .filter((s) => s.status !== "PAID")
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    )
    .slice(0, 3);

  //NEXT PAYMENTS
  const nextPayment = safeSchedules
    .filter((s) => s.status !== "PAID")
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    )[0];
  const nextDueDate = nextPayment?.dueDate ?? null;

  const paymentProgress = {
    totalPaid,
    totalRemaining,
    totalCost,
    monthsPaid,
    totalMonths,
  };

  const isLoading =
    ordersLoading || paymentsLoading || creditLoading || scheduleLoading;

  return {
    orderId,
    paymentProgress,
    upcomingPayments,
    schedules: safeSchedules,

    monthlyPayment,
    nextDueDate,

    isLoading,
  };
}
