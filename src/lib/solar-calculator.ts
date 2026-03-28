import type { Appliance, SolarConfig, SolarResults } from "@/types/solar";

const DEFAULT_CONFIG: SolarConfig = {
  peakSunHours: 4,
  daysOfAutonomy: 1,
  systemVoltage: 24,
  batteryType: "lithium",
  safetyFactor: 1.25,
  efficiencyLoss: 1.3,
};

export function calculateSolar(
  appliances: Appliance[],
  config: Partial<SolarConfig> = {},
): SolarResults {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  // Step A: Total daily energy consumption (Wh/day)
  const totalDailyWh = appliances.reduce(
    (sum, a) => sum + a.watts * a.hoursPerDay * a.quantity,
    0,
  );

  // Step B: Inverter sizing
  const totalRunningWatts = appliances.reduce(
    (sum, a) => sum + a.watts * a.quantity,
    0,
  );
  const totalSurgeWatts = appliances.reduce(
    (sum, a) => sum + a.watts * a.quantity * a.surgeMultiplier,
    0,
  );
  const inverterSize = totalRunningWatts * cfg.safetyFactor;

  // Step C: Solar panel array size
  const solarPanelWatts =
    (totalDailyWh * cfg.efficiencyLoss) / cfg.peakSunHours;

  // Step D: Battery bank size
  const dod = cfg.batteryType === "lithium" ? 0.9 : 0.5;
  const inverterEfficiency = 0.95;
  const batteryCapacityAh =
    (totalDailyWh * cfg.daysOfAutonomy) /
    (cfg.systemVoltage * dod * inverterEfficiency);
  const batteryCapacityWh = batteryCapacityAh * cfg.systemVoltage;

  return {
    totalDailyWh: Math.round(totalDailyWh),
    totalRunningWatts: Math.round(totalRunningWatts),
    totalSurgeWatts: Math.round(totalSurgeWatts),
    inverterSize: Math.round(inverterSize),
    solarPanelWatts: Math.round(solarPanelWatts),
    batteryCapacityAh: Math.round(batteryCapacityAh),
    batteryCapacityWh: Math.round(batteryCapacityWh),
  };
}
