"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { OrderDto } from "@/modules/orders/types";

export function useOrder(id: string) {
  return useQuery<OrderDto>({
    queryKey: ["orders", id],
    queryFn: async () => {
      const order = await apiClient<OrderDto | { data: OrderDto }>(
        `/api/orders/${id}`,
      );
      return "data" in order ? order.data : order;
    },
    enabled: !!id,
  });
}
