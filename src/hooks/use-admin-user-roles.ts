"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getUserRoles,
  assignRoleToUser,
  removeRoleFromUser,
  getAvailableRolesForUser,
} from "@/lib/api/admin-user-roles";

// ============ Queries ============

export function useUserRoles(userId: string) {
  return useQuery({
    queryKey: ["user-roles", userId],
    queryFn: () => getUserRoles(userId),
    enabled: !!userId,
  });
}

export function useAvailableRolesForUser(userId: string) {
  return useQuery({
    queryKey: ["available-roles", userId],
    queryFn: () => getAvailableRolesForUser(userId),
    enabled: !!userId,
  });
}

// ============ Mutations ============

export function useAssignRoleToUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      assignRoleToUser(userId, roleId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user-roles", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["available-roles", variables.userId] });
      toast.success("Role assigned successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useRemoveRoleFromUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      removeRoleFromUser(userId, roleId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user-roles", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["available-roles", variables.userId] });
      toast.success("Role removed successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}