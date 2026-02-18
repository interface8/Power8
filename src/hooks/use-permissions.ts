import { useQuery, useMutation } from "./use-api";

interface Permission {
  id: string;
  resource: string;
  action: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CreatePermissionData {
  resource: string;
  action: string;
  description?: string;
}

interface UpdatePermissionData {
  resource?: string;
  action?: string;
  description?: string;
}

export function usePermissions() {
  return useQuery<Permission[]>("/api/permissions");
}

export function useCreatePermission() {
  return useMutation<Permission, CreatePermissionData>();
}

export function useUpdatePermission() {
  return useMutation<Permission, UpdatePermissionData>();
}

export function useDeletePermission() {
  return useMutation<void, never>();
}
