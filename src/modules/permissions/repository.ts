import { prisma } from "@/lib/prisma";
import type {
  CreatePermissionInput,
  UpdatePermissionInput,
  PermissionDto,
} from "./types";
import type { Permission } from "@prisma/client";

function toPermissionDto(p: Permission): PermissionDto {
  return {
    id: p.id,
    resource: p.resource,
    action: p.action,
    description: p.description,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

export async function findAllPermissions(): Promise<PermissionDto[]> {
  const permissions = await prisma.permission.findMany({
    orderBy: [{ resource: "asc" }, { action: "asc" }],
  });
  return permissions.map(toPermissionDto);
}

export async function findPermissionById(
  id: string,
): Promise<PermissionDto | null> {
  const permission = await prisma.permission.findUnique({ where: { id } });
  return permission ? toPermissionDto(permission) : null;
}

export async function createPermission(
  input: CreatePermissionInput,
): Promise<PermissionDto> {
  const permission = await prisma.permission.create({
    data: {
      resource: input.resource,
      action: input.action,
      description: input.description,
    },
  });
  return toPermissionDto(permission);
}

export async function updatePermission(
  id: string,
  input: UpdatePermissionInput,
): Promise<PermissionDto> {
  const permission = await prisma.permission.update({
    where: { id },
    data: input,
  });
  return toPermissionDto(permission);
}

export async function deletePermission(id: string): Promise<void> {
  await prisma.permission.delete({ where: { id } });
}

export async function findAllPermissionsGrouped(): Promise<
  { resource: string; permissions: PermissionDto[] }[]
> {
  const permissions = await prisma.permission.findMany({
    orderBy: [{ resource: "asc" }, { action: "asc" }],
  });

  const groups = new Map<string, PermissionDto[]>();

  for (const permission of permissions.map(toPermissionDto)) {
    const existing = groups.get(permission.resource) ?? [];
    existing.push(permission);
    groups.set(permission.resource, existing);
  }

  return Array.from(groups.entries()).map(([resource, permissions]) => ({
    resource,
    permissions,
  }));
}

export async function findRoleById(id: string): Promise<{ id: string } | null> {
  return prisma.role.findUnique({
    where: { id },
    select: { id: true },
  });
}

export async function findPermissionsByIds(
  ids: string[],
): Promise<PermissionDto[]> {
  const permissions = await prisma.permission.findMany({
    where: { id: { in: ids } },
    orderBy: [{ resource: "asc" }, { action: "asc" }],
  });

  return permissions.map(toPermissionDto);
}

export async function findPermissionsForRole(
  roleId: string,
): Promise<PermissionDto[]> {
  const role = await prisma.role.findUnique({
    where: { id: roleId },
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });

  if (!role) return [];

  return role.permissions
    .map((rp) => toPermissionDto(rp.permission))
    .sort((a, b) => {
      const resourceCompare = a.resource.localeCompare(b.resource);
      if (resourceCompare !== 0) return resourceCompare;
      return a.action.localeCompare(b.action);
    });
}

export async function replaceRolePermissions(
  roleId: string,
  permissionIds: string[],
): Promise<PermissionDto[]> {
  const uniquePermissionIds = Array.from(new Set(permissionIds));

  await prisma.$transaction(async (tx) => {
    await tx.rolePermission.deleteMany({ where: { roleId } });

    if (uniquePermissionIds.length > 0) {
      await tx.rolePermission.createMany({
        data: uniquePermissionIds.map((permissionId) => ({
          roleId,
          permissionId,
        })),
      });
    }
  });

  return findPermissionsForRole(roleId);
}
