import { prisma } from "@/lib/prisma";
import type { Prisma, OrderStatus, OrderPaymentStatus, ShippingStatus } from "@prisma/client";
import type { AdminOrderListFilters, AdminOrdersListDto } from "./types";
import type { AdminOrderDetailsDto } from "./types";

export async function findOrders(filters: AdminOrderListFilters): Promise<AdminOrdersListDto> {
  const { page, limit, status, paymentType, paymentStatus, startDate, endDate, search } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.OrderWhereInput = {};

  if (status) where.status = status;
  if (paymentType) where.paymentType = paymentType;
  if (paymentStatus) where.paymentStatus = paymentStatus;

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = startDate;
    if (endDate) where.createdAt.lte = endDate;
  }

  if (search) {
    // partial order id OR partial customer name
    where.OR = [
      { id: { contains: search, mode: "insensitive" } },
      { user: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [total, rows] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  return {
    data: rows.map((o) => ({
      id: o.id,
      customerName: o.user.name,
      customerEmail: o.user.email,
      totalAmount: o.totalAmount.toNumber(),
      paymentType: o.paymentType,
      paymentStatus: o.paymentStatus,
      installationAddress: o.installationAddress,
      city: o.city,
      state: o.state,
      orderStatus: o.status,
      shippingStatus: o.shippingStatus,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function findOrderDetailsById(orderId: string): Promise<AdminOrderDetailsDto | null> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: {
        include: {
          product: { select: { name: true } },
          bundle: { select: { name: true } },
        },
      },
      payments: {
        orderBy: { createdAt: "desc" },
      },
      credit: {
        include: {
          schedules: { orderBy: { dueDate: "asc" } },
        },
      },
    },
  });

  if (!order) return null;

  const items = order.items.map((i) => {
    const name = i.itemType === "PRODUCT" ? (i.product?.name ?? "Unknown product") : (i.bundle?.name ?? "Unknown bundle");
    return {
      id: i.id,
      itemType: i.itemType,
      name,
      quantity: i.quantity,
      unitPrice: i.unitPrice.toNumber(),
      subtotal: i.totalPrice.toNumber(),
    };
  });

  const totalPaid = order.payments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + p.amount.toNumber(), 0);

  const remainingBalance =
    order.paymentType === "CREDIT"
      ? (order.credit?.balanceRemaining.toNumber() ?? Math.max(order.totalAmount.toNumber() - totalPaid, 0))
      : Math.max(order.totalAmount.toNumber() - totalPaid, 0);

  return {
    id: order.id,
    customer: {
      id: order.user.id,
      name: order.user.name,
      email: order.user.email,
    },
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    totalAmount: order.totalAmount.toNumber(),
    paymentType: order.paymentType,
    installationAddress: order.installationAddress,
    city: order.city,
    state: order.state,
    orderStatus: order.status,
    paymentStatus: order.paymentStatus,
    shipping: {
      status: order.shippingStatus,
      trackingNumber: order.trackingNumber ?? null,
      shippingProvider: order.shippingProvider ?? null,
    },
    items,
    payment: {
      totalPaid,
      remainingBalance,
      history: order.payments.map((p) => ({
        id: p.id,
        amount: p.amount.toNumber(),
        status: p.status,
        reference: p.reference,
        paidAt: p.paidAt,
        createdAt: p.createdAt,
      })),
    },
    credit: order.paymentType === "CREDIT" && order.credit
      ? {
          id: order.credit.id,
          totalAmount: order.credit.totalAmount.toNumber(),
          balanceRemaining: order.credit.balanceRemaining.toNumber(),
          durationMonths: order.credit.durationMonths,
          status: order.credit.status,
          schedules: order.credit.schedules.map((s) => ({
            id: s.id,
            dueDate: s.dueDate,
            amountDue: s.amountDue.toNumber(),
            status: s.status,
            createdAt: s.createdAt,
            updatedAt: s.updatedAt,
          })),
        }
      : null,
  };
}

export async function updateOrderStatusWithAudit(params: {
  orderId: string;
  adminId: string;
  newStatus: OrderStatus;
}) {
  const { orderId, adminId, newStatus } = params;

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      select: { id: true, status: true },
    });

    if (!order) throw new Error("Order not found");

    const previousStatus = order.status;

    const updated = await tx.order.update({
      where: { id: orderId },
      data: { status: newStatus },
      select: { id: true, status: true, updatedAt: true },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "ORDER_STATUS_UPDATED",
        adminId,
        orderId,
        metadata: {
          previousStatus,
          newStatus,
        } satisfies Prisma.JsonObject,
      },
    });

    return { previousStatus, ...updated };
  });
}

export async function updateOrderPaymentStatusWithAudit(params: {
  orderId: string;
  adminId: string;
  newStatus: OrderPaymentStatus;
}) {
  const { orderId, adminId, newStatus } = params;

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      select: { id: true, paymentStatus: true },
    });
    if (!order) throw new Error("Order not found");

    const previousStatus = order.paymentStatus;

    const updated = await tx.order.update({
      where: { id: orderId },
      data: { paymentStatus: newStatus },
      select: { id: true, paymentStatus: true, updatedAt: true },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "ORDER_PAYMENT_STATUS_UPDATED",
        adminId,
        orderId,
        metadata: {
          previousStatus,
          newStatus,
        } satisfies Prisma.JsonObject,
      },
    });

    return { previousStatus, ...updated };
  });
}

export async function updateOrderShippingStatusWithAudit(params: {
  orderId: string;
  adminId: string;
  newStatus: ShippingStatus;
  trackingNumber?: string;
  shippingProvider?: string;
}) {
  const { orderId, adminId, newStatus, trackingNumber, shippingProvider } = params;

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        shippingStatus: true,
        trackingNumber: true,
        shippingProvider: true,
      },
    });
    if (!order) throw new Error("Order not found");

    const previous = {
      status: order.shippingStatus,
      trackingNumber: order.trackingNumber,
      shippingProvider: order.shippingProvider,
    };

    const updated = await tx.order.update({
      where: { id: orderId },
      data: {
        shippingStatus: newStatus,
        trackingNumber: trackingNumber ?? order.trackingNumber,
        shippingProvider: shippingProvider ?? order.shippingProvider,
      },
      select: {
        id: true,
        shippingStatus: true,
        trackingNumber: true,
        shippingProvider: true,
        updatedAt: true,
      },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "ORDER_SHIPPING_STATUS_UPDATED",
        adminId,
        orderId,
        metadata: {
          previous,
          next: {
            status: newStatus,
            trackingNumber: updated.trackingNumber,
            shippingProvider: updated.shippingProvider,
          },
        } satisfies Prisma.JsonObject,
      },
    });

    return { previous, ...updated };
  });
}