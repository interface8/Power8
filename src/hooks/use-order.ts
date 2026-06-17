"use client";

import { useQuery } from "@tanstack/react-query";
import type { OrderDto } from "@/modules/orders/types";

export function useOrder(id: string) {
  return useQuery<OrderDto>({
    queryKey: ["orders", id],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${id}`);
      if (!res.ok) throw new Error("Failed to fetch order");
      const json = await res.json();
      return json.data;
    },
    enabled: !!id,
  });
}