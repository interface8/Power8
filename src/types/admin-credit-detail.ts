import { CreditStatus } from "./admin-credit";

export type ScheduleStatus =
  | "PAID"
  | "PENDING"
  | "OVERDUE";

export interface AdminCreditSchedule {
  id: string;
  installmentNumber: number;
  dueDate: string;
  amountDue: number;
  status: ScheduleStatus;
}

export interface AdminCreditDetail {
  id: string;

  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };

  order: {
    id: string;
    createdAt: string;
  };

  installation: {
    address: string | null;
    city: string | null;
    state: string | null;
  };

  totalAmount: number;

  balanceRemaining: number;

  durationMonths: number;

  status: CreditStatus;

  repayment: {
    paidInstallments: number;
    remainingInstallments: number;
    overdueInstallments: number;
    totalInstallments: number;
    nextDueDate: string | null;
  };

  schedules: AdminCreditSchedule[];

  createdAt: string;
}

export interface AdminCreditDetailResponse {
  data: AdminCreditDetail;
}