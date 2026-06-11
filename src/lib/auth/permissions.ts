import type { SessionUser } from "./session";
import { prisma } from "@/lib/prisma";

// ─── Permission checking ──────────────────────────────

/**
 * Check if a user has a specific permission.
 * Permission format: "resource.action" e.g. "users.read"
 */
export function hasPermission(
  user: SessionUser | null,
  permission: string,
): boolean;
export async function hasPermission(
  userId: string,
  resource: string,
  action: string,
): Promise<boolean>;
export function hasPermission(
  userOrId: SessionUser | string | null,
  permissionOrResource: string,
  action?: string,
): boolean | Promise<boolean> {
  if (typeof userOrId === "string") {
    if (!action) return false;
    return hasPermissionForUserId(userOrId, permissionOrResource, action);
  }

  if (!userOrId) return false;
  return userOrId.permissions.includes(permissionOrResource);
}

async function hasPermissionForUserId(
  userId: string,
  resource: string,
  action: string,
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      isActive: true,
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: {
                    select: {
                      resource: true,
                      action: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user || !user.isActive) return false;

  return user.roles.some((userRole) =>
    userRole.role.permissions.some(
      (rolePermission) =>
        rolePermission.permission.resource === resource &&
        rolePermission.permission.action === action,
    ),
  );
}
/**
 * Check if a user has ALL of the specified permissions.
 */
export function hasAllPermissions(
  user: SessionUser | null,
  permissions: string[],
): boolean {
  if (!user) return false;
  return permissions.every((p) => user.permissions.includes(p));
}

/**
 * Check if a user has ANY of the specified permissions.
 */
export function hasAnyPermission(
  user: SessionUser | null,
  permissions: string[],
): boolean {
  if (!user) return false;
  return permissions.some((p) => user.permissions.includes(p));
}

/**
 * Check if a user has a specific role.
 */
export function hasRole(user: SessionUser | null, role: string): boolean {
  if (!user) return false;
  return user.roles.includes(role);
}
