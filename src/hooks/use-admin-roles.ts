"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getRoles, createRole, getRoleById, updateRole, deleteRole } from "@/lib/api/admin-roles";
import { CreateRoleData, UpdateRoleData } from "@/types/admin-role";

// ============ Queries ============

export function useRoles() {
  return useQuery({
    queryKey: ["admin-roles"],
    queryFn: () => getRoles(),
  });
}

export function useRole(id: string) {
  return useQuery({
    queryKey: ["admin-role", id],
    queryFn: () => getRoleById(id),
    enabled: !!id,
  });
}

// ============ Mutations ============

export function useCreateRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateRoleData) => createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
      toast.success("Role created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleData }) => updateRole(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-role", variables.id] });
      toast.success("Role updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, force }: { id: string; force?: boolean }) => deleteRole(id, force),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
      if (result.data?.affectedUsers > 0) {
        toast.warning(`Role removed from ${result.data.affectedUsers} user(s)`);
      } else {
        toast.success("Role deleted successfully");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}