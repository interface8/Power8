import * as repo from "./repository";
import { prisma } from "@/lib/prisma";
import type { AdminOrderListFilters } from "./types";
import type { OrderStatus, OrderPaymentStatus, ShippingStatus } from "@prisma/client";

export async function listOrders(filters: AdminOrderListFilters) {
  return repo.findOrders(filters);
}

export async function getOrderDetailsById(orderId: string) {
  const order = await repo.findOrderDetailsById(orderId);
  if (!order) throw new Error("Order not found");
  return order;
}

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

function assertValidTransition(from: OrderStatus, to: OrderStatus) {
  if (from === to) return;
  if (!allowedTransitions[from]?.includes(to)) {
    throw new Error(`Invalid status transition: ${from} -> ${to}`);
  }
}


const allowedPaymentTransitions: Record<OrderPaymentStatus, OrderPaymentStatus[]> = {
  PENDING: ["PARTIALLY_PAID", "PAID", "FAILED"],
  PARTIALLY_PAID: ["PAID", "FAILED"],
  PAID: ["REFUNDED"],
  FAILED: ["PENDING"],
  REFUNDED: [],
};

function assertValidPaymentTransition(from: OrderPaymentStatus, to: OrderPaymentStatus) {
  if (from === to) return;
  if (!allowedPaymentTransitions[from]?.includes(to)) {
    throw new Error(`Invalid payment status transition: ${from} -> ${to}`);
  }
}

const allowedShippingTransitions: Record<ShippingStatus, ShippingStatus[]> = {
  PENDING: ["PROCESSING", "SHIPPED"],
  PROCESSING: ["SHIPPED"],
  SHIPPED: ["DELIVERED", "RETURNED"],
  DELIVERED: ["RETURNED"],
  RETURNED: [],
};

function assertValidShippingTransition(from: ShippingStatus, to: ShippingStatus) {
  if (from === to) return;
  if (!allowedShippingTransitions[from]?.includes(to)) {
    throw new Error(`Invalid shipping status transition: ${from} -> ${to}`);
  }
}


export async function updateOrderStatus(params: {
  orderId: string;
  adminId: string;
  status: OrderStatus;
}) {
  // Step 1 — fetch current status BEFORE touching anything
  const current = await prisma.order.findUnique({
    where: { id: params.orderId },
    select: { status: true },
  });

  // Step 2 — if order doesn't exist, stop here
  if (!current) throw new Error("Order not found");

  // Step 3 — validate transition BEFORE calling repo
  assertValidTransition(current.status, params.status);

  // Step 4 — only NOW call the repo to update + audit log
  const result = await repo.updateOrderStatusWithAudit({
    orderId: params.orderId,
    adminId: params.adminId,
    newStatus: params.status,
  });

  return result;
}


export async function updateOrderPaymentStatus(params: {
  orderId: string;
  adminId: string;
  status: OrderPaymentStatus;
}) {
  const current = await prisma.order.findUnique({
    where: { id: params.orderId },
    select: { paymentStatus: true },
  });

  if (!current) throw new Error("Order not found");

  assertValidPaymentTransition(current.paymentStatus, params.status);

  return repo.updateOrderPaymentStatusWithAudit({
    orderId: params.orderId,
    adminId: params.adminId,
    newStatus: params.status,
  });
}


export async function updateOrderShippingStatus(params: {
  orderId: string;
  adminId: string;
  status: ShippingStatus;
  trackingNumber?: string;
  shippingProvider?: string;
}) {
  const current = await prisma.order.findUnique({
    where: { id: params.orderId },
    select: { shippingStatus: true },
  });
  if (!current) throw new Error("Order not found");

  assertValidShippingTransition(current.shippingStatus, params.status);

  return repo.updateOrderShippingStatusWithAudit({
    orderId: params.orderId,
    adminId: params.adminId,
    newStatus: params.status,
    trackingNumber: params.trackingNumber,
    shippingProvider: params.shippingProvider,
  });
}