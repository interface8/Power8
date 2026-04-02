import { prisma } from "@/lib/prisma";
import type { SolarSystemDto, SystemControlLogDto } from "./types";

const systemWithRelations = {
  include: {
    bundle: { select: { name: true } },
    logs: {
      orderBy: { createdAt: "desc" as const },
      take: 10,
    },
  },
} as const;

function toSystemDto(system: {
  id: string;
  userId: string;
  orderId: string;
  bundleId: string;
  bundle: { name: string };
  status: string;
  logs: {
    id: string;
    action: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}): SolarSystemDto {
  return {
    id: system.id,
    userId: system.userId,
    orderId: system.orderId,
    bundleId: system.bundleId,
    bundleName: system.bundle.name,
    status: system.status as SolarSystemDto["status"],
    logs: system.logs.map(
      (log): SystemControlLogDto => ({
        id: log.id,
        action: log.action as SystemControlLogDto["action"],
        createdAt: log.createdAt,
      }),
    ),
    createdAt: system.createdAt,
    updatedAt: system.updatedAt,
  };
}

export async function findSystemsByUser(userId: string): Promise<SolarSystemDto[]> {
  const systems = await prisma.solarSystem.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    ...systemWithRelations,
  });
  return systems.map(toSystemDto);
}

export async function findSystemById(id: string): Promise<SolarSystemDto | null> {
  const system = await prisma.solarSystem.findUnique({
    where: { id },
    ...systemWithRelations,
  });
  return system ? toSystemDto(system) : null;
}

export async function updateSystemStatus(
  id: string,
  status: "ACTIVE" | "LIMITED" | "DISABLED",
  action: "ENABLE" | "LIMIT" | "DISABLE",
  actorId: string,
): Promise<SolarSystemDto> {
  const system = await prisma.$transaction(async (tx) => {
    // Log the control action
    await tx.systemControlLog.create({
      data: {
        systemId: id,
        action,
      },
    });

    // Update the system status
    return tx.solarSystem.update({
      where: { id },
      data: { status },
      ...systemWithRelations,
    });
  });

  return toSystemDto(system);
}
