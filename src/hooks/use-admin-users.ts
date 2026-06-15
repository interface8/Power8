import { useQuery, useMutation } from "./use-api";

// ============================================
// TYPES
// ============================================

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Types for the User Detail API response
export interface UserOrder {
  id: string;
  totalAmount: number;
  paymentType: string;
  status: string;
  createdAt: string;
}

export interface UserSolarSystem {
  id: string;
  bundleName: string;
  status: string;
  createdAt: string;
}

export interface UserCreditAccount {
  id: string;
  totalAmount: number;
  balanceRemaining: number;
  status: string;
  createdAt: string;
}

export interface UserSaving {
  id: string;
  systemId: string;
  estimatedAnnualSavings: number | null;
  createdAt: string;
}

export interface AdminUserDetailResponse {
  user: AdminUser;
  orders: UserOrder[];
  solarSystems: UserSolarSystem[];
  creditAccounts: UserCreditAccount[];
  savings: UserSaving[];
}

// Type for the users list API response (nested structure from your backend)
interface ApiListResponse {
  data: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// HOOKS
// ============================================

// Hook for getting a list of users (with search, filter, pagination)
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
  
  const { data, loading, error, refetch } = useQuery<ApiListResponse>(url);
  
  // Transform the nested API response to what the page expects
  return {
    data: data ? {
      users: data.data,
      total: data.pagination.total,
      page: data.pagination.page,
      totalPages: data.pagination.totalPages,
    } : null,
    loading,
    error,
    refetch,
  };
}

// Hook for getting a single user's details (including orders, systems, credit, savings)
export function useAdminUser(id: string) {
  // Fetch the user data from the API
  const { data: apiResponse, loading, error, refetch } = useQuery<{ data: AdminUserDetailResponse }>(`/api/admin/users/${id}`);
  
  // The API returns { data: { user, orders, solarSystems, creditAccounts, savings } }
  // Extract the inner data so the page can use it directly
  return {
    data: apiResponse?.data,
    loading,
    error,
    refetch,
  };
}

// Hook for updating a user's status (activate/deactivate)
export function useUpdateUserStatus() {
  const { mutate, loading, error, clearError } = useMutation<AdminUser, { isActive: boolean }>();
  
  // Wrapper function that specifically uses PATCH method
  const updateStatus = async (userId: string, isActive: boolean) => {
    return mutate(`/api/admin/users/${userId}/status`, { isActive }, "PATCH");
  };
  
  return {
    updateStatus,
    loading,
    error,
    clearError,
  };
}