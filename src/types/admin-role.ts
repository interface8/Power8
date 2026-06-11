export interface Role {
  id: string;
  name: string;
  description: string | null;
  permissionsCount: number;
  usersCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleData {
  name: string;
  description?: string;
}

export type UpdateRoleData = Partial<CreateRoleData>;

export interface RolesResponse {
  data: Role[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface RoleStats {
  totalRoles: number;
  totalPermissions: number;
  totalUsers: number;
  totalRolesWithUsers: number;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string;
}

export interface PermissionGroup {
  resource: string;
  label: string;
  icon: React.ElementType;
  permissions: Permission[];
}

export interface RolePermissions {
  roleId: string;
  roleName: string;
  roleDescription: string | null;
  permissionIds: string[];
}

export interface UpdateRolePermissionsData {
  roleId: string;
  permissionIds: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
}

export interface AssignRoleData {
  userId: string;
  roleId: string;
}

export interface RemoveRoleData {
  userId: string;
  roleId: string;
}