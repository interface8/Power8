import { prisma } from "@/lib/prisma";
import * as paymentRepo from "./repository";
import type { InitiatePaymentInput } from "./types";
import { randomUUID } from "crypto";

export async function initiatePayment(
  userId: string,
  input: InitiatePaymentInput,
) {
  // Verify the order exists and belongs to the user
  const order = await prisma.order.findUnique({
    where: { id: input.orderId },
  });
  if (!order) throw new Error("Order not found");
  if (order.userId !== userId) throw new Error("Order not found");

  // Derive the payable amount server-side
  let amount: number;

  const credit = await prisma.creditAccount.findUnique({
    where: { orderId: input.orderId },
    include: {
      schedules: {
        where: { status: "PENDING" },
        orderBy: { dueDate: "asc" },
        take: 1,
      },
    },
  });

  if (credit && credit.schedules.length > 0) {
    // Credit order: use the next scheduled payment amount
    amount = credit.schedules[0].amountDue.toNumber();
  } else {
    // Full payment: use the order total
    amount = order.totalAmount.toNumber();
  }

  // Generate a unique payment reference
  const reference = `PAY-${randomUUID()}`;

  // Create a pending-style payment record (status FAILED until webhook confirms)
  const payment = await paymentRepo.createPayment({
    userId,
    orderId: input.orderId,
    amount,
    reference,
    status: "FAILED",
  });

  // In a real app, you'd call Paystack/Flutterwave here to initialize
  // and return their checkout URL. For now, return the reference.
  return {
    payment,
    reference,
    // checkoutUrl: "https://paystack.com/pay/..." ← would come from provider
  };
}

export async function handleWebhook(reference: string) {
  return prisma.$transaction(async (tx) => {
    // Atomically mark payment as SUCCESS only if it's currently FAILED
    const updated = await tx.payment.updateMany({
      where: { reference, status: "FAILED" },
      data: { status: "SUCCESS", paidAt: new Date() },
    });

    // If no rows updated, either not found or already processed
    if (updated.count === 0) {
      const existing = await tx.payment.findUnique({ where: { reference } });
      if (!existing) throw new Error("Payment not found");
      throw new Error("Payment already processed");
    }

    const payment = await tx.payment.findUnique({ where: { reference } });
    if (!payment) throw new Error("Payment not found");

    const amount = payment.amount.toNumber();

    // If this order has a credit account, update the balance
    const credit = await tx.creditAccount.findUnique({
      where: { orderId: payment.orderId },
    });

    if (credit) {
      const newBalance = credit.balanceRemaining.toNumber() - amount;

      await tx.creditAccount.update({
        where: { id: credit.id },
        data: {
          balanceRemaining: Math.max(newBalance, 0),
          status: newBalance <= 0 ? "COMPLETED" : "ACTIVE",
        },
      });

      // Mark the next PENDING schedule as PAID
      const nextSchedule = await tx.paymentSchedule.findFirst({
        where: {
          creditAccountId: credit.id,
          status: "PENDING",
        },
        orderBy: { dueDate: "asc" },
      });

      if (nextSchedule) {
        await tx.paymentSchedule.update({
          where: { id: nextSchedule.id },
          data: { status: "PAID" },
        });
      }
    }

    // Update order status
    if (credit) {
      await tx.order.updateMany({
        where: { id: payment.orderId, status: "PENDING" },
        data: { status: "ACTIVE" },
      });
    } else {
      await tx.order.updateMany({
        where: { id: payment.orderId, status: "PENDING" },
        data: { status: "COMPLETED" },
      });
    }

    return {
      id: payment.id,
      userId: payment.userId,
      orderId: payment.orderId,
      amount,
      status: "SUCCESS" as const,
      reference: payment.reference,
      paidAt: payment.paidAt,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  });
}

export async function getPaymentsByOrderId(orderId: string, userId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });
  if (!order) throw new Error("Order not found");
  if (order.userId !== userId) throw new Error("Order not found");

  return paymentRepo.findPaymentsByOrderId(orderId);
}
