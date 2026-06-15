import { Role } from "@/types/admin-role";
import { ApiResponse } from "@/types/admin-role";

const BASE_URL = "/api/admin/users";

// GET /api/admin/users/:id/roles - Get user's assigned roles
export async function getUserRoles(userId: string): Promise<ApiResponse<Role[]>> {
  const response = await fetch(`${BASE_URL}/${userId}/roles`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch user roles");
  return response.json();
}

// POST /api/admin/users/:id/roles - Assign a role to a user
export async function assignRoleToUser(
  userId: string,
  roleId: string
): Promise<ApiResponse<Role[]>> {
  const response = await fetch(`${BASE_URL}/${userId}/roles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ roleId }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to assign role");
  }
  return response.json();
}

// DELETE /api/admin/users/:id/roles/:roleId - Remove a role from a user
export async function removeRoleFromUser(
  userId: string,
  roleId: string
): Promise<ApiResponse<Role[]>> {
  const response = await fetch(`${BASE_URL}/${userId}/roles/${roleId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to remove role");
  }
  return response.json();
}

// GET /api/admin/users/:id/available-roles - Get roles not assigned to user
export async function getAvailableRolesForUser(
  userId: string
): Promise<ApiResponse<Role[]>> {
  const response = await fetch(`${BASE_URL}/${userId}/available-roles`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch available roles");
  return response.json();
}