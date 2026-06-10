export type CreditStatus =
  | "ACTIVE"
  | "COMPLETED"
  | "DEFAULTED";

export type PaymentStatus =
  | "PAID"
  | "PENDING"
  | "OVERDUE";

export interface PaymentSchedule {
  id: string;
  dueDate: string;
  amountDue: number;
  status: PaymentStatus;
}

export interface CreditAccountDetail {
  id: string;
  customerName: string;
  email: string;
  phone: string;

  totalAmount: number;
  balanceRemaining: number;

  durationMonths: number;

  startDate: string;
  endDate: string;

  creditStatus: CreditStatus;

  repaymentPercentage: number;

  paymentSchedule: PaymentSchedule[];
}