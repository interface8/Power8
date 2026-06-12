export interface Role {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  permissionsCount: number;
  usersCount: number;
}

export interface RoleListItem {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  permissionsCount: number;
  usersCount: number;
}

export interface RoleDetail {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  permissions: RolePermissionDetail[];
}

export interface RolePermissionDetail {
  id: string;
  resource: string;
  action: string;
  description: string | null;
}

export interface CreateRoleData {
  name: string;
  description?: string;
  permissionIds?: string[];
}

export interface UpdateRoleData {
  name?: string;
  description?: string | null;
  permissionIds?: string[];
}

export interface RoleDeleteResult {
  deleted: boolean;
  affectedUsers: number;
  warning?: string;
}

export interface RoleStats {
  totalRoles: number;
  totalPermissions: number;
  totalUsers: number;
  totalRolesWithUsers: number;
}

// API Response Wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

//Permission Types
export interface Permission {
  id: string;
  resource: string;
  action: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionGroup {
  resource: string;
  permissions: Permission[];
}

export interface RolePermissionsResponse {
  roleId: string;
  roleName: string;
  permissions: Permission[];
}
