import * as systemRepo from "./repository";

export async function listSystems(userId: string) {
  return systemRepo.findSystemsByUser(userId);
}

export async function getSystemById(id: string, userId: string) {
  const system = await systemRepo.findSystemById(id);
  if (!system) throw new Error("System not found");
  if (system.userId !== userId) throw new Error("System not found");
  return system;
}

export async function enableSystem(id: string, actorId: string) {
  const system = await systemRepo.findSystemById(id);
  if (!system) throw new Error("System not found");
  if (system.status === "ACTIVE") throw new Error("System is already active");
  return systemRepo.updateSystemStatus(id, "ACTIVE", "ENABLE", actorId);
}

export async function limitSystem(id: string, actorId: string) {
  const system = await systemRepo.findSystemById(id);
  if (!system) throw new Error("System not found");
  if (system.status === "LIMITED") throw new Error("System is already limited");
  return systemRepo.updateSystemStatus(id, "LIMITED", "LIMIT", actorId);
}

export async function disableSystem(id: string, actorId: string) {
  const system = await systemRepo.findSystemById(id);
  if (!system) throw new Error("System not found");
  if (system.status === "DISABLED") throw new Error("System is already disabled");
  return systemRepo.updateSystemStatus(id, "DISABLED", "DISABLE", actorId);
}
