import * as adminStatsRepo from "./repository";
import type { GetAdminStatsInput } from "./types";

export async function getStats(input: GetAdminStatsInput = {}) {
  const lowStockThreshold = Math.max(0, input.lowStockThreshold ?? 5);
  return adminStatsRepo.getAdminStats(lowStockThreshold);
}
