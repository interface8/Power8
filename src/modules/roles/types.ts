export interface RoleDto {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  permissions: { id: string; resource: string; action: string }[];
}

export interface RoleListItemDto {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  permissionsCount: number;
  usersCount: number;
}

export interface RolePermissionDetailDto {
  id: string;
  resource: string;
  action: string;
  description: string | null;
}

export interface RoleDetailDto {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  permissions: RolePermissionDetailDto[];
}

export interface RoleDeleteResult {
  deleted: boolean;
  affectedUsers: number;
  warning?: string;
}

export interface RoleStatsDto {
  totalRoles: number;
  totalPermissions: number;
  totalUserAssignments: number;
  rolesWithUsers: number;
  rolesWithoutUsers: number;
  roles: RoleListItemDto[];
}

export interface CreateRoleInput {
  name: string;
  description?: string;
  permissionIds?: string[];
}

export interface UpdateRoleInput {
  name?: string;
  description?: string | null;
  permissionIds?: string[];
}