export type SystemStatus = "ACTIVE" | "ENABLED" | "DISABLED" | "LIMITED";

export type ControlAction = "ENABLE" | "DISABLE" | "LIMIT";

export interface System {
  id: string;
  userId: string;
  orderId: string;
  bundleId: string;
  customerName: string;
  bundleName: string;
  deviceId?: string;
  status: SystemStatus;
  createdAt: string;
  updatedAt: string;
  logsCount: number;
  recentLogs: ControlLog[];
}

export interface ControlLog {
  id: string;
  action: ControlAction;
  actorId: string | null;
  actorName: string | null;
  createdAt: string;
}

export interface SystemFilters {
   search?: string;
  status?: SystemStatus | "ALL";
  page?: number;
  limit?: number;
}

export interface SystemsResponse {
  data: {
    data: System[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface SystemStats {
  total: number;
  active: number;
  limited: number;
  disabled: number;
}