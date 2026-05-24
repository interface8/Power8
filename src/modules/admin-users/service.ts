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