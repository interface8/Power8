import { prisma } from "@/lib/prisma";
import type {
  CreateRoleInput,
  UpdateRoleInput,
  RoleDto,
  RoleDetailDto,
  RoleListItemDto,
} from "./types";

const roleWithPermissions = {
  include: {
    permissions: {
      include: {
        permission: {
          select: { id: true, resource: true, action: true },
        },
      },
    },
  },
} as const;

const roleWithPermissionsAndDescription = {
  include: {
    permissions: {
      include: {
        permission: {
          select: { id: true, resource: true, action: true, description: true },
        },
      },
    },
  },
} as const;

type RoleWithPermissions = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  permissions: Array<{
    permission: {
      id: string;
      resource: string;
      action: string;
    };
  }>;
};

type RoleWithPermissionDescription = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  permissions: Array<{
    permission: {
      id: string;
      resource: string;
      action: string;
      description: string | null;
    };
  }>;
};

function toRoleDto(role: RoleWithPermissions): RoleDto {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
    permissions:
      role.permissions?.map((rp) => ({
        id: rp.permission.id,
        resource: rp.permission.resource,
        action: rp.permission.action,
      })) ?? [],
  };
}

function toRoleDetailDto(role: RoleWithPermissionDescription): RoleDetailDto {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    createdAt: role.createdAt,
    permissions:
      role.permissions?.map((rp) => ({
        id: rp.permission.id,
        resource: rp.permission.resource,
        action: rp.permission.action,
        description: rp.permission.description,
      })) ?? [],
  };
}

export async function findRoleByName(
  name: string,
  excludeId?: string,
): Promise<{ id: string; name: string } | null> {
  return prisma.role.findFirst({
    where: {
      name: { equals: name, mode: "insensitive" },
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    select: {
      id: true,
      name: true,
    },
  });
}

export async function findAllRolesAdmin(): Promise<RoleListItemDto[]> {
  const roles = await prisma.role.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      _count: {
        select: {
          permissions: true,
          users: true,
        },
      },
    },
  });

  return roles.map((role) => ({
    id: role.id,
    name: role.name,
    description: role.description,
    createdAt: role.createdAt,
    permissionsCount: role._count.permissions,
    usersCount: role._count.users,
  }));
}

export async function findRoleDetailsByIdAdmin(
  id: string,
): Promise<RoleDetailDto | null> {
  const role = await prisma.role.findUnique({
    where: { id },
    ...roleWithPermissionsAndDescription,
  });

  if (!role) return null;
  return toRoleDetailDto(role);
}

export async function countUsersForRole(id: string): Promise<number> {
  return prisma.userRole.count({ where: { roleId: id } });
}

export async function createRole(input: CreateRoleInput): Promise<RoleDto> {
  const role = await prisma.role.create({
    data: {
      name: input.name,
      description: input.description,
      permissions: input.permissionIds?.length
        ? {
            create: input.permissionIds.map((permissionId) => ({
              permissionId,
            })),
          }
        : undefined,
    },
    ...roleWithPermissions,
  });
  return toRoleDto(role);
}

export async function updateRole(
  id: string,
  input: UpdateRoleInput,
): Promise<RoleDto> {
  const data: {
    name?: string;
    description?: string | null;
    permissions?: {
      create: Array<{ permissionId: string }>;
    };
  } = {};

  if (input.name) data.name = input.name;
  if (input.description !== undefined) data.description = input.description;

  if (input.permissionIds !== undefined) {
    data.permissions = {
      create: input.permissionIds.map((permissionId) => ({
        permissionId,
      })),
    };
  }

  const role = await prisma.$transaction(async (tx) => {
    if (input.permissionIds !== undefined) {
      await tx.rolePermission.deleteMany({ where: { roleId: id } });
    }

    return tx.role.update({
      where: { id },
      data,
      ...roleWithPermissions,
    });
  });
  return toRoleDto(role);
}

export async function deleteRoleWithAssignments(id: string): Promise<void> {
  await prisma.$transaction([
    prisma.userRole.deleteMany({ where: { roleId: id } }),
    prisma.role.delete({ where: { id } }),
  ]);
}
