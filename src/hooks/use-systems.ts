import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface SolarSystem {
  id: string;
  bundleName?: string;
  status: "ACTIVE" | "LIMITED" | "DISABLED";
  createdAt: string;
  // add other fields if needed
}

// Hook to get ALL systems for the current user
export function useUserSystems() {
  return useQuery<SolarSystem[]>({
    queryKey: ["userSystems"],
    queryFn: () => apiClient("/api/systems"),
  });
}

// single system hook
export function useSystem(id: string) {
  return useQuery({
    queryKey: ["systems", id],
    queryFn: () => apiClient(`/api/systems/${id}`),
    enabled: !!id,
  });
}

export function useSystemActions(id: string) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["userSystems"] });
    queryClient.invalidateQueries({ queryKey: ["systems", id] });
  };

  const enable = useMutation({
    mutationFn: () =>
      apiClient(`/api/systems/${id}/enable`, { method: "POST" }),
    onSuccess: invalidate,
  });

  const disable = useMutation({
    mutationFn: () =>
      apiClient(`/api/systems/${id}/disable`, { method: "POST" }),
    onSuccess: invalidate,
  });

  const limit = useMutation({
    mutationFn: () => apiClient(`/api/systems/${id}/limit`, { method: "POST" }),
    onSuccess: invalidate,
  });

  return { enable, disable, limit };
}
