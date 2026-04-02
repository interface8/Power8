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

  // Generate a unique payment reference
  const reference = `PAY-${randomUUID()}`;

  // Create a pending-style payment record (status FAILED until webhook confirms)
  const payment = await paymentRepo.createPayment({
    userId,
    orderId: input.orderId,
    amount: input.amount,
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
  // Find the payment by reference
  const existing = await paymentRepo.findPaymentByReference(reference);
  if (!existing) throw new Error("Payment not found");

  if (existing.status === "SUCCESS") {
    throw new Error("Payment already processed");
  }

  // Mark payment as successful
  const payment = await paymentRepo.markPaymentSuccess(reference);

  // If this order has a credit account, update the balance
  const credit = await prisma.creditAccount.findUnique({
    where: { orderId: payment.orderId },
  });

  if (credit) {
    const newBalance = credit.balanceRemaining.toNumber() - payment.amount;

    await prisma.creditAccount.update({
      where: { id: credit.id },
      data: {
        balanceRemaining: Math.max(newBalance, 0),
        status: newBalance <= 0 ? "COMPLETED" : "ACTIVE",
      },
    });

    // Mark the next PENDING schedule as PAID
    const nextSchedule = await prisma.paymentSchedule.findFirst({
      where: {
        creditAccountId: credit.id,
        status: "PENDING",
      },
      orderBy: { dueDate: "asc" },
    });

    if (nextSchedule) {
      await prisma.paymentSchedule.update({
        where: { id: nextSchedule.id },
        data: { status: "PAID" },
      });
    }
  }

  // Update order status
  if (credit) {
    // Credit order: activate it (stays ACTIVE until fully paid)
    await prisma.order.updateMany({
      where: { id: payment.orderId, status: "PENDING" },
      data: { status: "ACTIVE" },
    });
  } else {
    // Full payment: straight to COMPLETED
    await prisma.order.updateMany({
      where: { id: payment.orderId, status: "PENDING" },
      data: { status: "COMPLETED" },
    });
  }

  return payment;
}

export async function getPaymentsByOrderId(orderId: string, userId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });
  if (!order) throw new Error("Order not found");
  if (order.userId !== userId) throw new Error("Order not found");

  return paymentRepo.findPaymentsByOrderId(orderId);
}
