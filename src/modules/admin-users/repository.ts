import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type {
  AdminUserListFilters,
  AdminUsersListDto,
  AdminUserDetailsDto,
  AdminUserRoleDto,
} from "./types";

type RolePermissionRow = {
  permission: {
    id: string;
    resource: string;
    action: string;
    description: string | null;
  };
};

type RoleWithPermissionsRow = {
  id: string;
  name: string;
  description: string | null;
  permissions: RolePermissionRow[];
};

function mapRole(role: RoleWithPermissionsRow): AdminUserRoleDto {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    permissions: role.permissions.map((rp) => ({
      id: rp.permission.id,
      resource: rp.permission.resource,
      action: rp.permission.action,
      description: rp.permission.description,
    })),
  };
}

export async function findUsers(filters: AdminUserListFilters): Promise<AdminUsersListDto> {
  const { search, isActive, page, limit } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {};

  if (isActive !== undefined) where.isActive = isActive;

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  const [total, rows] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    data: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function findUserDetailsById(
  userId: string,
): Promise<AdminUserDetailsDto | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) return null;

  const [orders, solarSystems, creditAccounts, savings] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        totalAmount: true,
        paymentType: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.solarSystem.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        createdAt: true,
        bundle: { select: { name: true } },
      },
    }),
    prisma.creditAccount.findMany({
      where: { order: { userId } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        totalAmount: true,
        balanceRemaining: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.userSaving.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        systemId: true,
        estimatedAnnualSavings: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    roles: user.roles.map((ur) => mapRole(ur.role)),
    orders: orders.map((o) => ({
      id: o.id,
      totalAmount: o.totalAmount.toNumber(),
      paymentType: o.paymentType,
      status: o.status,
      createdAt: o.createdAt,
    })),
    solarSystems: solarSystems.map((s) => ({
      id: s.id,
      bundleName: s.bundle.name,
      status: s.status,
      createdAt: s.createdAt,
    })),
    creditAccounts: creditAccounts.map((c) => ({
      id: c.id,
      totalAmount: c.totalAmount.toNumber(),
      balanceRemaining: c.balanceRemaining.toNumber(),
      status: c.status,
      createdAt: c.createdAt,
    })),
    savings: savings.map((sv) => ({
      id: sv.id,
      systemId: sv.systemId,
      estimatedAnnualSavings: sv.estimatedAnnualSavings?.toNumber() ?? null,
      createdAt: sv.createdAt,
    })),
  };
}

export async function updateUserStatusWithAudit(params: {
  userId: string;
  adminId: string;
  isActive: boolean;
}) {
  const { userId, adminId, isActive } = params;

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { id: true, isActive: true },
    });
    if (!user) throw new Error("User not found");

    const previousIsActive = user.isActive;

    const updated = await tx.user.update({
      where: { id: userId },
      data: { isActive },
      select: { id: true, isActive: true, updatedAt: true },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "USER_STATUS_UPDATED",
        adminId,
        metadata: {
          userId,
          previousIsActive,
          newIsActive: isActive,
        } satisfies Prisma.JsonObject,
      },
    });

    return { previousIsActive, ...updated };
  });
}

export async function findUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
}

export async function findRoleById(roleId: string) {
  return prisma.role.findUnique({
    where: { id: roleId },
    select: { id: true },
  });
}

export async function findUserRoleAssignment(userId: string, roleId: string) {
  return prisma.userRole.findUnique({
    where: {
      userId_roleId: {
        userId,
        roleId,
      },
    },
  });
}

export async function findUserRolesByUserId(
  userId: string,
): Promise<AdminUserRoleDto[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) return [];

  return user.roles.map((ur) => mapRole(ur.role));
}

export async function assignRoleToUser(userId: string, roleId: string) {
  await prisma.userRole.create({
    data: {
      userId,
      roleId,
    },
  });
}

export async function removeRoleFromUser(userId: string, roleId: string) {
  await prisma.userRole.delete({
    where: {
      userId_roleId: {
        userId,
        roleId,
      },
    },
  });
}
