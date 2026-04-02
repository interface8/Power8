export interface SystemControlLogDto {
  id: string;
  action: "ENABLE" | "LIMIT" | "DISABLE";
  createdAt: Date;
}

export interface SolarSystemDto {
  id: string;
  userId: string;
  orderId: string;
  bundleId: string;
  bundleName: string;
  status: "ACTIVE" | "LIMITED" | "DISABLED";
  logs: SystemControlLogDto[];
  createdAt: Date;
  updatedAt: Date;
}
