"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  updateShippingStatus,
} from "@/lib/api/admin-orders";
import {
  OrderFilters,
  OrderStatus,
  PaymentStatus,
  ShippingStatus,
} from "@/types/order";

export function useOrders(filters: OrderFilters) {
  return useQuery({
    queryKey: ["admin-orders", filters],
    queryFn: () => getOrders(filters),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["admin-order", id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-order", variables.id] });
    },
  });
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: PaymentStatus }) =>
      updatePaymentStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-order", variables.id] });
    },
  });
}

export function useUpdateShippingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      trackingNumber,
      shippingProvider,
    }: {
      id: string;
      status: ShippingStatus;
      trackingNumber?: string;
      shippingProvider?: string;
    }) => updateShippingStatus(id, { status, trackingNumber, shippingProvider }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-order", variables.id] });
    },
  });
}