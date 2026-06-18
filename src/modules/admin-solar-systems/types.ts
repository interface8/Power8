import type { ControlAction, SystemStatus } from "@prisma/client";

export type AdminSolarSystemControlLogDto = {
  id: string;
  action: ControlAction;
  actorId: string | null;
  actorName: string | null;
  createdAt: Date;
};

export type AdminSolarSystemListRowDto = {
  id: string;
  userId: string;
  orderId: string;
  bundleId: string;
  customerName: string;
  bundleName: string;
  status: SystemStatus;
  createdAt: Date;
  updatedAt: Date;
  logsCount: number;
  recentLogs: AdminSolarSystemControlLogDto[];
};

export type AdminSolarSystemDetailDto = {
  id: string;
  userId: string;
  orderId: string;
  bundleId: string;
  customerName: string;
  bundleName: string;
  status: SystemStatus;
  createdAt: Date;
  updatedAt: Date;
  logs: AdminSolarSystemControlLogDto[];
};

export type AdminSolarSystemListFilters = {
  search?: string;
  status?: SystemStatus;
  page: number;
  limit: number;
};

export type AdminSolarSystemListDto = {
  data: AdminSolarSystemListRowDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};