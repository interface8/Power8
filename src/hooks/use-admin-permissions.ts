"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getPermissionsGrouped, getRolePermissions, updateRolePermissions } from "@/lib/api/admin-permissions";

// ============ Queries ============

export function usePermissionsGrouped() {
  return useQuery({
    queryKey: ["admin-permissions-grouped"],
    queryFn: () => getPermissionsGrouped(),
  });
}

export function useRolePermissions(roleId: string) {
  return useQuery({
    queryKey: ["admin-role-permissions", roleId],
    queryFn: () => getRolePermissions(roleId),
    enabled: !!roleId,
  });
}

// ============ Mutations ============

export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) => 
      updateRolePermissions(roleId, permissionIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-role-permissions", variables.roleId] });
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
      toast.success("Permissions updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update permissions");
    },
  });
}