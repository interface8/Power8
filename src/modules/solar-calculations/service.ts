import * as solarCalculationsRepository from "./repository";
import { calculateSolar } from "@/lib/solar-calculator";
import { createSolarCalculationSchema } from "./validation";
import type { Appliance, SolarConfig } from "@/types/solar";

export async function saveCalculation(
  input: { appliances: unknown; config: unknown },
  userId?: string,
) {
  const parsed = createSolarCalculationSchema.parse(input);
  const appliances = parsed.appliances as Appliance[];
  const config = parsed.config as SolarConfig;

  const results = calculateSolar(appliances, config);

  return solarCalculationsRepository.create({
    userId,
    appliances,
    config,
    results,
    location: config.location || undefined,
    totalDailyWh: results.totalDailyWh,
    inverterSize: results.inverterSize,
    solarPanelWatts: results.solarPanelWatts,
    batteryAh: results.batteryCapacityAh,
  });
}

export async function listByUser(userId: string) {
  return solarCalculationsRepository.getByUser(userId);
}

export async function getById(id: string) {
  return solarCalculationsRepository.getById(id);
}
