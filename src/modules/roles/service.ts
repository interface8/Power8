import * as roleRepo from "./repository";
import type {
  CreateRoleInput,
  UpdateRoleInput,
  RoleDeleteResult,
  RoleDetailDto,
  RoleListItemDto,
  RoleStatsDto,
} from "./types";

export async function listRolesAdmin(): Promise<RoleListItemDto[]> {
  return roleRepo.findAllRolesAdmin();
}

export async function getRoleStatsAdmin(): Promise<RoleStatsDto> {
  const roles = await roleRepo.findAllRolesAdmin();
  const totalRoles = roles.length;
  const totalPermissions = roles.reduce((sum, role) => sum + role.permissionsCount, 0);
  const totalUserAssignments = roles.reduce((sum, role) => sum + role.usersCount, 0);
  const rolesWithUsers = roles.filter((role) => role.usersCount > 0).length;

  return {
    totalRoles,
    totalPermissions,
    totalUserAssignments,
    rolesWithUsers,
    rolesWithoutUsers: totalRoles - rolesWithUsers,
    roles,
  };
}

export async function getRoleDetailsByIdAdmin(
  id: string,
): Promise<RoleDetailDto> {
  const role = await roleRepo.findRoleDetailsByIdAdmin(id);
  if (!role) throw new Error("Role not found");
  return role;
}

export async function createRoleAdmin(input: CreateRoleInput) {
  const existing = await roleRepo.findRoleByName(input.name);
  if (existing) throw new Error("Role name already exists");

  const created = await roleRepo.createRole(input);
  const details = await roleRepo.findRoleDetailsByIdAdmin(created.id);
  if (!details) throw new Error("Role not found");
  return details;
}

export async function updateRoleAdmin(id: string, input: UpdateRoleInput) {
  const existing = await roleRepo.findRoleDetailsByIdAdmin(id);
  if (!existing) throw new Error("Role not found");

  if (input.name) {
    const duplicate = await roleRepo.findRoleByName(input.name, id);
    if (duplicate) throw new Error("Role name already exists");
  }

  await roleRepo.updateRole(id, input);

  const updated = await roleRepo.findRoleDetailsByIdAdmin(id);
  if (!updated) throw new Error("Role not found");
  return updated;
}

export async function deleteRoleAdmin(
  id: string,
  force = false,
): Promise<RoleDeleteResult> {
  const existing = await roleRepo.findRoleDetailsByIdAdmin(id);
  if (!existing) throw new Error("Role not found");

  const affectedUsers = await roleRepo.countUsersForRole(id);

  if (affectedUsers > 0 && !force) {
    return {
      deleted: false,
      affectedUsers,
      warning: `This role is assigned to ${affectedUsers} user${affectedUsers === 1 ? "" : "s"}. Use force=true to delete it.`,
    };
  }

  await roleRepo.deleteRoleWithAssignments(id);

  return {
    deleted: true,
    affectedUsers,
  };
}

// Backward-compatible wrappers for the legacy /api/roles routes
export async function listRoles(): Promise<RoleListItemDto[]> {
  return listRolesAdmin();
}

export async function getRoleById(id: string): Promise<RoleDetailDto> {
  return getRoleDetailsByIdAdmin(id);
}

export async function createRole(input: CreateRoleInput) {
  return createRoleAdmin(input);
}

export async function updateRole(id: string, input: UpdateRoleInput) {
  return updateRoleAdmin(id, input);
}

export async function deleteRole(id: string) {
  return deleteRoleAdmin(id, true);
}