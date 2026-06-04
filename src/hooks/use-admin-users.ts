import { useQuery, useMutation } from "./use-api";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// This matches what your backend ACTUALLY returns
export interface AdminUsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  totalPages: number;
}

export function useAdminUsers(filters?: {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}) {
  const params = new URLSearchParams();
  if (filters?.search) params.set("search", filters.search);
  if (filters?.isActive !== undefined) params.set("isActive", String(filters.isActive));
  if (filters?.page) params.set("page", filters.page.toString());
  if (filters?.limit) params.set("limit", filters.limit.toString());

  const url = `/api/admin/users${params.toString() ? `?${params}` : ""}`;
  
  // Your API returns { users, total, page, totalPages } directly
  const result = useQuery<AdminUsersResponse>(url);
  
  console.log("useAdminUsers result:", result); // Debug log
  
  return result;
}

export function useAdminUser(id: string) {
  return useQuery<AdminUser>(`/api/admin/users/${id}`);
}

export function useUpdateUserStatus() {
  return useMutation<AdminUser, { isActive: boolean }>();
}