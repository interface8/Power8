import { z } from "zod";
import { OrderPaymentStatus, OrderStatus, PaymentType, ShippingStatus } from "@prisma/client";

export const adminOrderListFiltersSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  paymentType: z.nativeEnum(PaymentType).optional(),
  paymentStatus: z.nativeEnum(OrderPaymentStatus).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const adminUpdateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

export const adminUpdateOrderPaymentStatusSchema = z.object({
  status: z.nativeEnum(OrderPaymentStatus),
});

export const adminUpdateOrderShippingStatusSchema = z.object({
  status: z.nativeEnum(ShippingStatus),
  trackingNumber: z.string().trim().min(1).optional(),
  shippingProvider: z.string().trim().min(1).optional(),
});