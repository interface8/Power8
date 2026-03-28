export interface Appliance {
  id: string;
  name: string;
  watts: number;
  hoursPerDay: number;
  quantity: number;
  surgeMultiplier: number; // 1 for non-motor, 3-5 for motor-driven
  imageUrl?: string;
}

export interface SolarConfig {
  peakSunHours: number; // typically 4-5
  daysOfAutonomy: number; // backup days
  systemVoltage: 12 | 24 | 48;
  batteryType: "lead-acid" | "lithium";
  safetyFactor: number; // 1.25 default
  efficiencyLoss: number; // 1.3 default (30% loss)
}

export interface SolarResults {
  totalDailyWh: number;
  totalRunningWatts: number;
  totalSurgeWatts: number;
  inverterSize: number;
  solarPanelWatts: number;
  batteryCapacityAh: number;
  batteryCapacityWh: number;
}

export interface OCRResult {
  rawText: string;
  extractedWatts: number | null;
  extractedAmps: number | null;
  extractedVolts: number | null;
  confidence: number;
}
