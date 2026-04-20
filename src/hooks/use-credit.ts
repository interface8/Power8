import { useQuery } from "@tanstack/react-query";

export function useCreditByOrder(orderId: string) {
  return useQuery({
    queryKey: ["credit", orderId],
    queryFn: async () => {
      const res = await fetch(`/api/credit/${orderId}`);
      if (!res.ok) throw new Error("Failed to fetch credit");
      return res.json();
    },
    enabled: !!orderId,
  });
}
