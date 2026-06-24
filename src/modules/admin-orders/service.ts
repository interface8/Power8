import * as repo from "./repository";
import { prisma } from "@/lib/prisma";
import type { AdminOrderListFilters } from "./types";
import type {
  OrderPaymentStatus,
  OrderStatus,
  PaymentType,
  ShippingStatus,
} from "@prisma/client";

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
  PROCESSING: ["CANCELLED"],
  SHIPPED: [],
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

function assertOrderStatusRequirements(params: {
  to: OrderStatus;
  paymentType: PaymentType;
  paymentStatus: OrderPaymentStatus;
  shippingStatus: ShippingStatus;
}) {
  const { to, paymentType, paymentStatus, shippingStatus } = params;

  if (to === "CONFIRMED") {
    const hasRequiredPayment =
      paymentType === "CREDIT"
        ? paymentStatus === "PARTIALLY_PAID" || paymentStatus === "PAID"
        : paymentStatus === "PAID";

    if (!hasRequiredPayment) {
      throw new Error("Order must be paid before it can be confirmed");
    }
  }

  if (to === "SHIPPED" && shippingStatus !== "SHIPPED") {
    throw new Error("Shipping must be marked as shipped first");
  }

  if (to === "DELIVERED" && shippingStatus !== "DELIVERED") {
    throw new Error("Shipping must be marked as delivered first");
  }

  if (to === "COMPLETED") {
    if (paymentStatus !== "PAID") {
      throw new Error("Order must be fully paid before completion");
    }

    if (shippingStatus !== "DELIVERED") {
      throw new Error("Order must be delivered before completion");
    }
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
    select: {
      status: true,
      paymentType: true,
      paymentStatus: true,
      shippingStatus: true,
    },
  });

  // Step 2 — if order doesn't exist, stop here
  if (!current) throw new Error("Order not found");

  // Step 3 — validate transition BEFORE calling repo
  assertValidTransition(current.status, params.status);
  assertOrderStatusRequirements({
    to: params.status,
    paymentType: current.paymentType,
    paymentStatus: current.paymentStatus,
    shippingStatus: current.shippingStatus,
  });

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
    select: {
      status: true,
      paymentStatus: true,
      shippingStatus: true,
    },
  });
  if (!current) throw new Error("Order not found");

  assertValidShippingTransition(current.shippingStatus, params.status);

  if (current.status === "CANCELLED" || current.status === "COMPLETED") {
    throw new Error("Shipping cannot be updated for a final order");
  }

  if (
    current.paymentStatus !== "PAID" &&
    current.paymentStatus !== "PARTIALLY_PAID"
  ) {
    throw new Error("Order must have a successful payment before shipping");
  }

  if (
    params.status === "DELIVERED" &&
    current.status !== "SHIPPED"
  ) {
    throw new Error("Order must be shipped before it can be delivered");
  }

  return repo.updateOrderShippingStatusWithAudit({
    orderId: params.orderId,
    adminId: params.adminId,
    newStatus: params.status,
    trackingNumber: params.trackingNumber,
    shippingProvider: params.shippingProvider,
  });
}