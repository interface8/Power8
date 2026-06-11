import * as repo from "./repository";
import type { AdminUserListFilters } from "./types";
import type { AdminUserDetailsDto } from "./types";

export async function listUsers(filters: AdminUserListFilters) {
  return repo.findUsers(filters);
}

export async function getUserDetailsById(userId: string): Promise<AdminUserDetailsDto> {
  const details = await repo.findUserDetailsById(userId);
  if (!details) throw new Error("User not found");
  return details;
}

export async function updateUserStatus(params: {
  userId: string;
  adminId: string;
  isActive: boolean;
}) {
  return repo.updateUserStatusWithAudit(params);
}

export async function getUserRolesById(userId: string) {
  const user = await repo.findUserById(userId);
  if (!user) throw new Error("User not found");

  return repo.findUserRolesByUserId(userId);
}

export async function assignRoleToUser(userId: string, roleId: string) {
  const user = await repo.findUserById(userId);
  if (!user) throw new Error("User not found");

  const role = await repo.findRoleById(roleId);
  if (!role) throw new Error("Role not found");

  const existing = await repo.findUserRoleAssignment(userId, roleId);
  if (existing) throw new Error("User already has this role");

  await repo.assignRoleToUser(userId, roleId);

  return repo.findUserRolesByUserId(userId);
}

export async function removeRoleFromUser(userId: string, roleId: string) {
  const user = await repo.findUserById(userId);
  if (!user) throw new Error("User not found");

  const existing = await repo.findUserRoleAssignment(userId, roleId);
  if (!existing) throw new Error("User does not have this role");

  await repo.removeRoleFromUser(userId, roleId);

  return repo.findUserRolesByUserId(userId);
}
