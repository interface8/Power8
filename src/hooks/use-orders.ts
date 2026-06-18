"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { OrderDto } from "@/modules/orders/types";

export function useOrders() {
  return useQuery<OrderDto[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const orders = await apiClient<OrderDto[] | { data: OrderDto[] }>(
        "/api/orders",
      );
      return Array.isArray(orders) ? orders : orders.data;
    },
  });
}
