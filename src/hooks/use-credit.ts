"use client";

import { useQuery } from "@tanstack/react-query";

export function useCredit(orderId: string) {
  return useQuery({
    queryKey: ["credit", orderId],
    queryFn: async () => {
      const res = await fetch(`/api/credit/${orderId}`);
      if (!res.ok) throw new Error("Failed to fetch credit");

      const json = await res.json();
      return json.data;
    },
    enabled: !!orderId,
  });
}
