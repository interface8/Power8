import { apiClient } from "@/lib/api-client";
import { PaymentSummary } from "@/types/dashboard";
import { useQuery } from "@tanstack/react-query";

export function useDashboardOverview() {
  return useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: () => apiClient("/api/dashboard"),
  });
}

export function usePaymentSummary() {
  return useQuery<PaymentSummary>({
    queryKey: ["dashboard", "payment"],
    queryFn: () => apiClient("/api/dashboard/payments"),
  });
}

export function useSavings() {
  return useQuery({
    queryKey: ["savings"],
    queryFn: () => apiClient("/api/dashboard/savings"),
  });
}
