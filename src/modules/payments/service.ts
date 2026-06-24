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

  if (order.paymentType === "CREDIT" && !credit) {
    throw new Error("Credit account not found");
  }

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
  await paymentRepo.createPayment({
    userId,
    orderId: input.orderId,
    amount,
    reference,
    status: "FAILED",
  });

  // ─── TEMP: payment-gateway bypass (testing only) ───────────────────────────
  // No gateway provider wired up yet, so no webhook will ever fire. Auto-confirm
  // the payment immediately by running the same logic the real webhook would,
  // which advances the order (and credit schedules) just like a real payment.
  // DELETE this block and uncomment the return below once a provider is added.
  const confirmed = await handleWebhook(reference);
  return {
    payment: confirmed,
    reference,
  };
  // ───────────────────────────────────────────────────────────────────────────

  // In a real app, you'd call Paystack/Flutterwave here to initialize
  // and return their checkout URL. For now, return the reference.
  // (When restoring, capture the record above: `const payment = await paymentRepo.createPayment(...)`)
  // return {
  //   payment,
  //   reference,
  //   // checkoutUrl: "https://paystack.com/pay/..." ← would come from provider
  // };
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

    let newBalance = 0;

    if (credit) {
      newBalance = credit.balanceRemaining.toNumber() - amount;

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

    await tx.order.update({
      where: { id: payment.orderId },
      data: {
        paymentStatus: credit
          ? newBalance <= 0
            ? "PAID"
            : "PARTIALLY_PAID"
          : "PAID",
      },
    });

    // A successful payment confirms the order. Fulfillment completion remains
    // an admin-controlled step after processing, shipping, and delivery.
    await tx.order.updateMany({
      where: { id: payment.orderId, status: "PENDING" },
      data: { status: "CONFIRMED" },
    });

    // Provision a solar system for each bundle in the order. Runs for both full
    // and credit payments; for credit it fires on the first installment so the
    // customer gets a live (ACTIVE) system that admins can later limit/disable.
    // Idempotent: skips bundles that already have a system for this order, so
    // subsequent credit installments don't create duplicates.
    const bundleItems = await tx.orderItem.findMany({
      where: { orderId: payment.orderId, itemType: "BUNDLE", bundleId: { not: null } },
      select: { bundleId: true },
    });

    if (bundleItems.length > 0) {
      const existingSystems = await tx.solarSystem.findMany({
        where: { orderId: payment.orderId },
        select: { bundleId: true },
      });
      const provisioned = new Set(existingSystems.map((s) => s.bundleId));

      const systemsToCreate: Array<{
        userId: string;
        orderId: string;
        bundleId: string;
      }> = [];
      for (const item of bundleItems) {
        if (item.bundleId && !provisioned.has(item.bundleId)) {
          provisioned.add(item.bundleId);
          systemsToCreate.push({
            userId: payment.userId,
            orderId: payment.orderId,
            bundleId: item.bundleId,
          });
        }
      }

      if (systemsToCreate.length > 0) {
        await tx.solarSystem.createMany({ data: systemsToCreate });
      }
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
