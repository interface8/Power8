import { CreditStatus, OrderStatus, PaymentType, SystemStatus } from "@prisma/client";

export type AdminUserListRowDto = {
  id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: Date;
};

export type AdminUsersListDto = {
  data: AdminUserListRowDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type AdminUserListFilters = {
  search?: string;
  isActive?: boolean;
  page: number;
  limit: number;
};

export type AdminUserOrderDto = {
  id: string;
  totalAmount: number;
  paymentType: PaymentType;
  status: OrderStatus;
  createdAt: Date;
};

export type AdminUserSolarSystemDto = {
  id: string;
  bundleName: string;
  status: SystemStatus;
  createdAt: Date;
};

export type AdminUserCreditAccountDto = {
  id: string;
  totalAmount: number;
  balanceRemaining: number;
  status: CreditStatus;
  createdAt: Date;
};

export type AdminUserSavingDto = {
  id: string;
  systemId: string;
  estimatedAnnualSavings: number | null;
  createdAt: Date;
};

export type AdminRolePermissionDto = {
  id: string;
  resource: string;
  action: string;
  description: string | null;
};

export type AdminUserRoleDto = {
  id: string;
  name: string;
  description: string | null;
  permissions: AdminRolePermissionDto[];
};

export type AdminUserDetailsDto = {
  user: {
    id: string;
    email: string;
    name: string;
    phone: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  roles: AdminUserRoleDto[];
  orders: AdminUserOrderDto[];
  solarSystems: AdminUserSolarSystemDto[];
  creditAccounts: AdminUserCreditAccountDto[];
  savings: AdminUserSavingDto[];
};
