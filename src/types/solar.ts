export interface Appliance {
  id: string;
  name: string;
  watts: number;
  hoursPerDay: number;
  quantity: number;
  surgeMultiplier: number; // 1 for non-motor, 3-5 for motor-driven
  imageUrl?: string;
  detectedCategory?: string | null;
}

export type UsageProfile = "home" | "business" | "school" | "restaurant";

export interface SolarConfig {
  peakSunHours: number; // typically 4-5
  daysOfAutonomy: number; // backup days
  systemVoltage: 12 | 24 | 48;
  batteryType: "lead-acid" | "lithium";
  safetyFactor: number; // 1.25 default
  efficiencyLoss: number; // 1.3 default (30% loss)
  panelRating: number; // watts per panel, default 550
  batteryUnitAh: number; // Ah per battery unit, default 200
  electricityRate: number; // ₦ per kWh, default 70
  location: string; // city name for sun hours lookup
  usageProfile: UsageProfile; // adjusts hours multiplier
}

export interface SolarResults {
  totalDailyWh: number;
  totalRunningWatts: number;
  totalSurgeWatts: number;
  inverterSize: number;
  solarPanelWatts: number;
  batteryCapacityAh: number;
  batteryCapacityWh: number;
  numberOfPanels: number;
  numberOfBatteries: number;
  monthlyProductionWh: number;
  annualProductionWh: number;
  annualSavingsNGN: number;
  estimatedSystemCost: number;
}

export interface OCRResult {
  rawText: string;
  extractedWatts: number | null;
  extractedAmps: number | null;
  extractedVolts: number | null;
  confidence: number;
  adjustedConfidence: number;
  allMatches: { watts: number[]; amps: number[]; volts: number[] };
  detectedCategory: string | null;
}
