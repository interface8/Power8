import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { SolarSystem } from "@/types/dashboard";


export function useUserSystems() {
  return useQuery<SolarSystem[]>({
    queryKey: ["systems"],
    queryFn: () => apiClient("/api/systems"),
  });
}

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
    queryClient.invalidateQueries({ queryKey: ["systems"] });
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
  });

  return { enable, disable, limit };
}


