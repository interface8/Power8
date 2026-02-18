import { useQuery, useMutation } from "./use-api";

interface Permission {
  id: string;
  resource: string;
  action: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Role {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  permissions?: Permission[];
}

interface CreateRoleData {
  name: string;
  description?: string;
  permissionIds?: string[];
}

interface UpdateRoleData {
  name?: string;
  description?: string;
  permissionIds?: string[];
}

export function useRoles() {
  return useQuery<Role[]>("/api/roles");
}

export function useCreateRole() {
  return useMutation<Role, CreateRoleData>();
}

export function useUpdateRole() {
  return useMutation<Role, UpdateRoleData>();
}

export function useDeleteRole() {
  return useMutation<void, never>();
}
