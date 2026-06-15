"use client";

import { toast } from "sonner";

interface UpdateOrderStatusPayload {
  orderId: string;
  status: string;
}

interface UpdatePaymentStatusPayload {
  orderId: string;
  status: string;
}

interface UpdateShippingStatusPayload {
  orderId: string;
  status: string;

  trackingNumber?: string;

  shippingProvider?: string;
}

export function useOrderActions() {
  const updateOrderStatus = async ({
    orderId,
    status,
  }: UpdateOrderStatusPayload) => {
    try {
      const response = await fetch(
        `/api/admin/orders/${orderId}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      toast.success("Order status updated");

      return true;
    } catch {
      toast.error("Failed to update order status");

      return false;
    }
  };

  const updatePaymentStatus = async ({
    orderId,
    status,
  }: UpdatePaymentStatusPayload) => {
    try {
      const response = await fetch(
        `/api/admin/orders/${orderId}/payment-status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update payment status");
      }

      toast.success("Payment status updated");

      return true;
    } catch {
      toast.error("Failed to update payment status");

      return false;
    }
  };

  const updateShippingStatus = async ({
    orderId,
    status,
    trackingNumber,
    shippingProvider,
  }: UpdateShippingStatusPayload) => {
    try {
      const response = await fetch(
        `/api/admin/orders/${orderId}/shipping-status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            status,
            trackingNumber,
            shippingProvider,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update shipping status");
      }

      toast.success("Shipping status updated");

      return true;
    } catch {
      toast.error("Failed to update shipping status");

      return false;
    }
  };

  return {
    updateOrderStatus,
    updatePaymentStatus,
    updateShippingStatus,
  };
}