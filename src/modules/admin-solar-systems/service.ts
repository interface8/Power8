import type { ControlAction, SystemStatus } from "@prisma/client";
import * as repo from "./repository";
import type { AdminSolarSystemListFilters } from "./types";

const statusToAction: Record<SystemStatus, ControlAction> = {
  ACTIVE: "ENABLE",
  LIMITED: "LIMIT",
  DISABLED: "DISABLE",
};

function statusAlreadyMessage(status: SystemStatus) {
  switch (status) {
    case "ACTIVE":
      return "System is already enabled";
    case "LIMITED":
      return "System is already limited";
    case "DISABLED":
      return "System is already disabled";
  }
}

export async function listSolarSystems(filters: AdminSolarSystemListFilters) {
  return repo.findSolarSystems(filters);
}

export async function getSolarSystemById(systemId: string) {
  const system = await repo.findSolarSystemById(systemId);
  if (!system) throw new Error("System not found");
  return system;
}

export async function getSolarSystemLogs(systemId: string) {
  const logs = await repo.findSolarSystemLogsById(systemId);
  if (!logs) throw new Error("System not found");
  return logs;
}

async function updateStatus(systemId: string, adminId: string, status: SystemStatus) {
  const action = statusToAction[status];
  const current = await repo.findSolarSystemById(systemId);
  if (!current) throw new Error("System not found");
  if (current.status === status) throw new Error(statusAlreadyMessage(status));

  return repo.updateSolarSystemStatus({
    systemId,
    adminId,
    status,
    action,
  });
}

export async function enableSolarSystem(systemId: string, adminId: string) {
  return updateStatus(systemId, adminId, "ACTIVE");
}

export async function limitSolarSystem(systemId: string, adminId: string) {
  return updateStatus(systemId, adminId, "LIMITED");
}

export async function disableSolarSystem(systemId: string, adminId: string) {
  return updateStatus(systemId, adminId, "DISABLED");
}