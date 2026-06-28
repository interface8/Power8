import { prisma } from "@/lib/prisma";
import type { ControlAction, Prisma, SystemStatus } from "@prisma/client";
import type {
  AdminSolarSystemControlLogDto,
  AdminSolarSystemDetailDto,
  AdminSolarSystemListDto,
  AdminSolarSystemListFilters,
  AdminSolarSystemListRowDto,
} from "./types";

type LogRow = {
  id: string;
  action: ControlAction;
  actorId: string | null;
  actor: {
    name: string;
  } | null;
  createdAt: Date;
};

type SystemRow = {
  id: string;
  userId: string;
  orderId: string;
  bundleId: string;
  status: SystemStatus;
  createdAt: Date;
  updatedAt: Date;
  user: { name: string };
  bundle: { name: string };
  logs: LogRow[];
};

const RECENT_LOG_TAKE = 2;

function mapLogRow(log: LogRow): AdminSolarSystemControlLogDto {
  return {
    id: log.id,
    action: log.action,
    actorId: log.actorId,
    actorName: log.actor?.name ?? null,
    createdAt: log.createdAt,
  };
}

function buildListRow(
  row: SystemRow,
  logsCount: number,
): AdminSolarSystemListRowDto {
  return {
    id: row.id,
    userId: row.userId,
    orderId: row.orderId,
    bundleId: row.bundleId,
    customerName: row.user.name,
    bundleName: row.bundle.name,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    logsCount,
    recentLogs: row.logs.map(mapLogRow),
  };
}

async function loadSystemWithLogs(systemId: string, take: number | null = null) {
  return prisma.solarSystem.findUnique({
    where: { id: systemId },
    select: {
      id: true,
      userId: true,
      orderId: true,
      bundleId: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      user: { select: { name: true } },
      bundle: { select: { name: true } },
        logs: {
          orderBy: { createdAt: "desc" },
          ...(take ? { take } : {}),
          select: {
            id: true,
            action: true,
            actorId: true,
            actor: {
              select: {
                name: true,
              },
            },
            createdAt: true,
          },
        },
    },
  });
}

export async function findSolarSystems(
  filters: AdminSolarSystemListFilters,
): Promise<AdminSolarSystemListDto> {
  const { search, status, page, limit } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.SolarSystemWhereInput = {};
  if (status) where.status = status;

  if (search) {
    where.OR = [
      { id: { contains: search, mode: "insensitive" } },
      { user: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [total, rows] = await Promise.all([
    prisma.solarSystem.count({ where }),
    prisma.solarSystem.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        userId: true,
        orderId: true,
        bundleId: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { name: true } },
        bundle: { select: { name: true } },
        logs: {
          orderBy: { createdAt: "desc" },
          take: RECENT_LOG_TAKE,
          select: {
            id: true,
            action: true,
            actorId: true,
            actor: {
              select: {
                name: true,
              },
            },
            createdAt: true,
          },
        },
      },
    }),
  ]);

  const systemIds = rows.map((row) => row.id);
  const logCounts = systemIds.length
    ? await prisma.systemControlLog.groupBy({
        by: ["systemId"],
        where: { systemId: { in: systemIds } },
        _count: { id: true },
      })
    : [];

  const logCountMap = new Map(logCounts.map((item) => [item.systemId, item._count.id]));

  return {
    data: rows.map((row) => buildListRow(row as SystemRow, logCountMap.get(row.id) ?? row.logs.length)),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function findSolarSystemById(
  systemId: string,
): Promise<AdminSolarSystemDetailDto | null> {
  const row = await loadSystemWithLogs(systemId, null);
  if (!row) return null;

  return {
    id: row.id,
    userId: row.userId,
    orderId: row.orderId,
    bundleId: row.bundleId,
    customerName: row.user.name,
    bundleName: row.bundle.name,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    logs: row.logs.map(mapLogRow),
  };
}

export async function findSolarSystemLogsById(
  systemId: string,
): Promise<AdminSolarSystemControlLogDto[] | null> {
  const row = await loadSystemWithLogs(systemId, null);
  if (!row) return null;

  return row.logs.map(mapLogRow);
}

export async function updateSolarSystemStatus(params: {
  systemId: string;
  adminId: string;
  status: SystemStatus;
  action: ControlAction;
}): Promise<AdminSolarSystemDetailDto> {
  const { systemId, adminId, status, action } = params;

  await prisma.$transaction(async (tx) => {
    const current = await tx.solarSystem.findUnique({
      where: { id: systemId },
      select: { id: true, status: true },
    });

    if (!current) throw new Error("System not found");
    if (current.status === status) {
      throw new Error(`System is already ${status.toLowerCase()}`);
    }

    await tx.systemControlLog.create({
      data: {
        systemId,
        action,
        actorId: adminId,
      },
    });

    await tx.solarSystem.update({
      where: { id: systemId },
      data: { status },
    });
  });

  const updated = await findSolarSystemById(systemId);
  if (!updated) throw new Error("System not found");
  return updated;
}
