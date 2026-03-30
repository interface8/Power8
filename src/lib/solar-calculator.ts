import type { Appliance, SolarConfig, SolarResults, UsageProfile } from "@/types/solar";

const USAGE_MULTIPLIERS: Record<UsageProfile, number> = {
  home: 1.0,
  business: 1.3,
  school: 0.7 * (5 / 7), // shorter hours, weekdays only
  restaurant: 1.5,
};

const DEFAULT_CONFIG: SolarConfig = {
  peakSunHours: 4,
  daysOfAutonomy: 1,
  systemVoltage: 24,
  batteryType: "lithium",
  safetyFactor: 1.25,
  efficiencyLoss: 1.3,
  panelRating: 550,
  batteryUnitAh: 200,
  electricityRate: 70,
  location: "",
  usageProfile: "home",
};

export function calculateSolar(
  appliances: Appliance[],
  config: Partial<SolarConfig> = {},
): SolarResults {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const hoursMultiplier = USAGE_MULTIPLIERS[cfg.usageProfile];

  // Step A: Total daily energy consumption (Wh/day) adjusted by usage profile
  const totalDailyWh = appliances.reduce(
    (sum, a) => sum + a.watts * (a.hoursPerDay * hoursMultiplier) * a.quantity,
    0,
  );

  // Step B: Inverter sizing — use max of surge watts or running watts * safety factor
  const totalRunningWatts = appliances.reduce(
    (sum, a) => sum + a.watts * a.quantity,
    0,
  );
  const totalSurgeWatts = appliances.reduce(
    (sum, a) => sum + a.watts * a.quantity * a.surgeMultiplier,
    0,
  );
  const inverterSize = Math.max(
    totalSurgeWatts,
    totalRunningWatts * cfg.safetyFactor,
  );

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

  const roundedPanelWatts = Math.round(solarPanelWatts);
  const roundedBatteryAh = Math.round(batteryCapacityAh);
  const numberOfPanels = Math.ceil(roundedPanelWatts / cfg.panelRating);
  const numberOfBatteries = Math.ceil(roundedBatteryAh / cfg.batteryUnitAh);
  const monthlyProductionWh = roundedPanelWatts * cfg.peakSunHours * 30;
  const annualProductionWh = monthlyProductionWh * 12;
  const annualSavingsNGN = (annualProductionWh / 1000) * cfg.electricityRate;

  // Rough cost estimate: panels + batteries + inverter
  const panelUnitCost = 250000; // ₦ per panel
  const batteryUnitCost = 350000; // ₦ per battery
  const inverterUnitCost = 500000; // ₦ base inverter cost
  const estimatedSystemCost =
    numberOfPanels * panelUnitCost +
    numberOfBatteries * batteryUnitCost +
    inverterUnitCost;

  return {
    totalDailyWh: Math.round(totalDailyWh),
    totalRunningWatts: Math.round(totalRunningWatts),
    totalSurgeWatts: Math.round(totalSurgeWatts),
    inverterSize: Math.round(inverterSize),
    solarPanelWatts: roundedPanelWatts,
    batteryCapacityAh: roundedBatteryAh,
    batteryCapacityWh: Math.round(batteryCapacityWh),
    numberOfPanels,
    numberOfBatteries,
    monthlyProductionWh: Math.round(monthlyProductionWh),
    annualProductionWh: Math.round(annualProductionWh),
    annualSavingsNGN: Math.round(annualSavingsNGN),
    estimatedSystemCost,
  };
}
