import { useQuery } from "@tanstack/react-query";

export function usePayments(orderId?: string) {
  return useQuery({
    queryKey: ["payments", orderId],
    queryFn: async () => {
      const res = await fetch(`/api/payments/${orderId}`);
      if (!res.ok) throw new Error("Failed to fetch payments");

      const json = await res.json();
      return json.data;
    },
    enabled: !!orderId,
  });
}
