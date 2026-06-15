import { PermissionGroup, Permission, ApiResponse } from "@/types/admin-role";

const BASE_URL = "/api/admin/permissions";
const ROLES_URL = "/api/admin/roles";

// GET /api/admin/permissions - Get all permissions grouped
export async function getPermissionsGrouped(): Promise<ApiResponse<PermissionGroup[]>> {
  const response = await fetch(BASE_URL, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch permissions");
  return response.json();
}

// GET /api/admin/roles/:id/permissions - Get role's permissions
export async function getRolePermissions(roleId: string): Promise<ApiResponse<Permission[]>> {
  const response = await fetch(`${ROLES_URL}/${roleId}/permissions`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch role permissions");
  return response.json();
}

// PUT /api/admin/roles/:id/permissions - Update role's permissions
export async function updateRolePermissions(
  roleId: string, 
  permissionIds: string[]
): Promise<ApiResponse<Permission[]>> {
  const response = await fetch(`${ROLES_URL}/${roleId}/permissions`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(permissionIds),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update role permissions");
  }
  return response.json();
}