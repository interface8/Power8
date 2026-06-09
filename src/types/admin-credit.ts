export type CreditStatus = "ACTIVE" | "COMPLETED" | "DEFAULTED";

export interface AdminCreditRepayment {
  paidInstallments: number;
  remainingInstallments: number;
  overdueInstallments: number;
  totalInstallments: number;
  nextDueDate: string | null;
}

export interface AdminCreditCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface AdminCreditAccount {
  id: string;

  customer: AdminCreditCustomer;

  orderId: string;

  totalAmount: number;

  balanceRemaining: number;

  durationMonths: number;

  status: CreditStatus;

  repayment: AdminCreditRepayment;

  createdAt: string;

  installation: {
    address: string | null;
    city: string | null;
    state: string | null;
  };

  orderCreatedAt: string;
}

export interface AdminCreditsResponse {
  data: AdminCreditAccount[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
