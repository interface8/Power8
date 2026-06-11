import * as permissionRepo from "./repository";
import type { CreatePermissionInput, UpdatePermissionInput } from "./types";

export async function listPermissions() {
  return permissionRepo.findAllPermissions();
}

export async function getPermissionById(id: string) {
  const permission = await permissionRepo.findPermissionById(id);
  if (!permission) throw new Error("Permission not found");
  return permission;
}

export async function createPermission(input: CreatePermissionInput) {
  return permissionRepo.createPermission(input);
}

export async function updatePermission(
  id: string,
  input: UpdatePermissionInput,
) {
  const existing = await permissionRepo.findPermissionById(id);
  if (!existing) throw new Error("Permission not found");
  return permissionRepo.updatePermission(id, input);
}

export async function deletePermission(id: string) {
  const existing = await permissionRepo.findPermissionById(id);
  if (!existing) throw new Error("Permission not found");
  return permissionRepo.deletePermission(id);
}

export async function listPermissionsGrouped() {
  return permissionRepo.findAllPermissionsGrouped();
}

export async function getRolePermissions(roleId: string) {
  const role = await permissionRepo.findRoleById(roleId);
  if (!role) throw new Error("Role not found");

  return permissionRepo.findPermissionsForRole(roleId);
}

export async function replaceRolePermissions(
  roleId: string,
  permissionIds: string[],
) {
  const role = await permissionRepo.findRoleById(roleId);
  if (!role) throw new Error("Role not found");

  const uniquePermissionIds = Array.from(new Set(permissionIds));
  const foundPermissions = await permissionRepo.findPermissionsByIds(
    uniquePermissionIds,
  );

  if (foundPermissions.length !== uniquePermissionIds.length) {
    throw new Error("One or more permissions are invalid");
  }

  return permissionRepo.replaceRolePermissions(roleId, uniquePermissionIds);
}