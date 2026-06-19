"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getSolarSystems,
  getSolarSystemById,
  getSolarSystemLogs,
  enableSolarSystem,
  disableSolarSystem,
  limitSolarSystem,
} from "@/lib/api/admin-solar-systems";
import {
  SystemFilters,
  SystemsResponse,
  System,
  ControlLog,
} from "@/types/admin-solar-system";

// ============ Queries ============

export function useSolarSystems(filters: SystemFilters) {
  return useQuery<SystemsResponse>({
    queryKey: ["solar-systems", filters],
    queryFn: () => getSolarSystems(filters),
  });
}

export function useSolarSystem(id: string) {
  return useQuery<{ data: System }>({
    queryKey: ["solar-system", id],
    queryFn: () => getSolarSystemById(id),
    enabled: !!id,
  });
}

export function useSolarSystemLogs(id: string) {
  return useQuery<{ data: ControlLog[] }>({
    queryKey: ["solar-system-logs", id],
    queryFn: () => getSolarSystemLogs(id),
    enabled: !!id,
  });
}

// ============ Mutations ============

export function useEnableSolarSystem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => enableSolarSystem(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["solar-systems"] });
      queryClient.invalidateQueries({ queryKey: ["solar-system", id] });
      toast.success("System enabled successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to enable system");
    },
  });
}

export function useDisableSolarSystem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => disableSolarSystem(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["solar-systems"] });
      queryClient.invalidateQueries({ queryKey: ["solar-system", id] });
      toast.success("System disabled successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to disable system");
    },
  });
}

export function useLimitSolarSystem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => limitSolarSystem(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["solar-systems"] });
      queryClient.invalidateQueries({ queryKey: ["solar-system", id] });
      toast.success("System limited successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to limit system");
    },
  });
}
