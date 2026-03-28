export interface SolarCalculationDto {
  id: string;
  userId: string | null;
  appliances: unknown;
  config: unknown;
  results: unknown;
  location: string | null;
  totalDailyWh: number;
  inverterSize: number;
  solarPanelWatts: number;
  batteryAh: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSolarCalculationInput {
  appliances: unknown;
  config: unknown;
  results: unknown;
  location?: string;
  totalDailyWh: number;
  inverterSize: number;
  solarPanelWatts: number;
  batteryAh: number;
}
