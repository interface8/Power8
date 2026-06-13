import { 
  Role, 
  RoleDetail, 
  CreateRoleData, 
  UpdateRoleData, 
  RoleDeleteResult,
  ApiResponse 
} from "@/types/admin-role";

const BASE_URL = "/api/admin/roles";

// GET /api/admin/roles - List all roles (returns Role[])
export async function getRoles(): Promise<ApiResponse<Role[]>> {
  const response = await fetch(BASE_URL, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch roles");
  return response.json();
}

// POST /api/admin/roles - Create a new role
export async function createRole(data: CreateRoleData): Promise<ApiResponse<RoleDetail>> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create role");
  }
  return response.json();
}

// GET /api/admin/roles/:id - Get single role
export async function getRoleById(id: string): Promise<ApiResponse<RoleDetail>> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch role");
  return response.json();
}

// PATCH /api/admin/roles/:id - Update role
export async function updateRole(id: string, data: UpdateRoleData): Promise<ApiResponse<RoleDetail>> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update role");
  }
  return response.json();
}

// DELETE /api/admin/roles/:id - Delete role
export async function deleteRole(id: string, force?: boolean): Promise<ApiResponse<RoleDeleteResult>> {
  const url = force ? `${BASE_URL}/${id}?force=true` : `${BASE_URL}/${id}`;
  const response = await fetch(url, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete role");
  }
  return response.json();
}