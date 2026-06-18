export type SystemStatus = "ENABLED" | "DISABLED" | "LIMITED";

export type ControlAction = "ENABLE" | "DISABLE" | "LIMIT";

export interface System {
  id: string;
  deviceId: string;
  customerName: string;
  bundleName: string;
  status: SystemStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ControlLog {
  id: string;
  systemId: string;
  action: ControlAction;
  performedBy: string;
  performedByEmail: string;
  notes?: string;
  createdAt: string;
}

export interface SystemFilters {
  search: string;
  status: SystemStatus | "ALL";
}

export interface LimitSystemData {
  systemId: string;
  limitPercentage: number;
  notes?: string;
}