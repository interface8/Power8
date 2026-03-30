import { prisma } from "@/lib/prisma";
import * as creditRepo from "./repository";
import type { ApplyCreditInput } from "./types";

export async function applyCredit(userId: string, input: ApplyCreditInput) {
  // Verify the order exists and belongs to the user
  const order = await prisma.order.findUnique({
    where: { id: input.orderId },
  });
  if (!order) throw new Error("Order not found");
  if (order.userId !== userId) throw new Error("Order not found");

  // Verify the order is CREDIT type
  if (order.paymentType !== "CREDIT") {
    throw new Error("Order is not a credit order");
  }

  // Check if credit already exists for this order
  const existing = await creditRepo.findCreditByOrderId(input.orderId);
  if (existing) throw new Error("Credit already exists for this order");

  return creditRepo.createCredit(input, order.totalAmount.toNumber());
}

export async function getCreditByOrderId(orderId: string, userId: string) {
  // Verify the order belongs to the user
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });
  if (!order) throw new Error("Order not found");
  if (order.userId !== userId) throw new Error("Order not found");

  const credit = await creditRepo.findCreditByOrderId(orderId);
  if (!credit) throw new Error("Credit not found");
  return credit;
}

export async function getCreditSchedule(creditId: string, userId: string) {
  const credit = await creditRepo.findCreditById(creditId);
  if (!credit) throw new Error("Credit not found");

  // Verify the order belongs to the user
  const order = await prisma.order.findUnique({
    where: { id: credit.orderId },
  });
  if (!order) throw new Error("Order not found");
  if (order.userId !== userId) throw new Error("Order not found");

  return credit.schedules;
}
