import { Order } from "@/types/order";

export const mockOrders: Order[] = [
  {
    id: "ORD-2026-1001",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    totalAmount: 45000,
    paymentType: "FULL",
    paymentStatus: "PAID",
    orderStatus: "CONFIRMED",
    fulfillmentStatus: "PROCESSING",
    createdAt: "2026-05-20T10:00:00Z",
  },

  {
    id: "ORD-2026-1002",
    customerName: "Sarah Johnson",
    customerEmail: "sarah@example.com",
    totalAmount: 120000,
    paymentType: "CREDIT",
    paymentStatus: "PARTIALLY_PAID",
    orderStatus: "PROCESSING",
    fulfillmentStatus: "SHIPPED",
    createdAt: "2026-05-19T14:20:00Z",
  },

  {
    id: "ORD-2026-1003",
    customerName: "Michael Brown",
    customerEmail: "michael@example.com",
    totalAmount: 75000,
    paymentType: "FULL",
    paymentStatus: "FAILED",
    orderStatus: "CANCELLED",
    fulfillmentStatus: "PENDING",
    createdAt: "2026-05-18T08:45:00Z",
  },

  {
    id: "ORD-2026-1004",
    customerName: "Emily Wilson",
    customerEmail: "emily@example.com",
    totalAmount: 98000,
    paymentType: "CREDIT",
    paymentStatus: "PENDING",
    orderStatus: "PENDING",
    fulfillmentStatus: "PENDING",
    createdAt: "2026-05-17T12:10:00Z",
  },

  {
    id: "ORD-2026-1005",
    customerName: "David Lee",
    customerEmail: "david@example.com",
    totalAmount: 32000,
    paymentType: "FULL",
    paymentStatus: "PAID",
    orderStatus: "DELIVERED",
    fulfillmentStatus: "DELIVERED",
    createdAt: "2026-05-16T09:30:00Z",
  },
];
