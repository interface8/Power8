import { useQuery, useMutation } from "./use-api";

interface User {
  id: string;
  name: string;
  email: string;
  roleId: string | null;
  createdAt: string;
  updatedAt: string;
  role?: {
    id: string;
    name: string;
  } | null;
}

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  roleId?: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  roleId?: string;
}

export function useUsers(filters?: { search?: string; role?: string; page?: number; limit?: number }) {
  const params = new URLSearchParams();
  if (filters?.search) params.set("search", filters.search);
  if (filters?.role) params.set("role", filters.role);
  if (filters?.page) params.set("page", filters.page.toString());
  if (filters?.limit) params.set("limit", filters.limit.toString());

  const url = `/api/users${params.toString() ? `?${params}` : ""}`;
  
  return useQuery<{ users: User[]; total: number }>(url);
}

export function useCreateUser() {
  return useMutation<User, CreateUserData>();
}

export function useUpdateUser() {
  return useMutation<User, UpdateUserData>();
}

export function useDeleteUser() {
  return useMutation<void, never>();
}
