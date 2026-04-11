import { prisma } from "@/lib/prisma";
import type { PaymentDto } from "./types";

function toPaymentDto(payment: {
  id: string;
  userId: string;
  orderId: string;
  amount: { toNumber: () => number };
  status: string;
  reference: string;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): PaymentDto {
  return {
    id: payment.id,
    userId: payment.userId,
    orderId: payment.orderId,
    amount: payment.amount.toNumber(),
    status: payment.status as PaymentDto["status"],
    reference: payment.reference,
    paidAt: payment.paidAt,
    createdAt: payment.createdAt,
    updatedAt: payment.updatedAt,
  };
}

export async function findPaymentsByOrderId(orderId: string): Promise<PaymentDto[]> {
  const payments = await prisma.payment.findMany({
    where: { orderId },
    orderBy: { createdAt: "desc" },
  });
  return payments.map(toPaymentDto);
}

export async function findPaymentByReference(reference: string): Promise<PaymentDto | null> {
  const payment = await prisma.payment.findUnique({
    where: { reference },
  });
  return payment ? toPaymentDto(payment) : null;
}

export async function createPayment(data: {
  userId: string;
  orderId: string;
  amount: number;
  reference: string;
  status: "SUCCESS" | "FAILED";
}): Promise<PaymentDto> {
  const payment = await prisma.payment.create({
    data: {
      userId: data.userId,
      orderId: data.orderId,
      amount: data.amount,
      reference: data.reference,
      status: data.status,
    },
  });
  return toPaymentDto(payment);
}

export async function markPaymentSuccess(reference: string): Promise<PaymentDto> {
  const payment = await prisma.payment.update({
    where: { reference },
    data: {
      status: "SUCCESS",
      paidAt: new Date(),
    },
  });
  return toPaymentDto(payment);
}
