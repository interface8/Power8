import type { CreditStatus } from "@prisma/client";

export type AdminCreditRepaymentDto = {
  paidInstallments: number;
  remainingInstallments: number;
  overdueInstallments: number;
  totalInstallments: number;
  nextDueDate: Date | null;
};

export type AdminCreditAccountRowDto = {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string
  };
  orderId: string;
  totalAmount: number;
  balanceRemaining: number;
  durationMonths: number;
  status: CreditStatus;
  repayment: AdminCreditRepaymentDto;
  createdAt: Date;
  installation: {
    address: string | null;
    city: string | null;
    state: string | null;
  }
  orderCreatedAt: Date;
};

export type AdminCreditAccountsListDto = {
  data: AdminCreditAccountRowDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type AdminCreditAccountFilters = {
  status?: CreditStatus;
  search?: string;
  page: number;
  limit: number;
};