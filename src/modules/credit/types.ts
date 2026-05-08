export interface PaymentScheduleDto {
  id: string;
  dueDate: Date;
  amountDue: number;
  status: "PENDING" | "PAID" | "OVERDUE";
}

export interface CreditAccountDto {
  id: string;
  orderId: string;
  totalAmount: number;
  balanceRemaining: number;
  durationMonths: number;
  status: "ACTIVE" | "COMPLETED" | "DEFAULTED";
  schedules: PaymentScheduleDto[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ApplyCreditInput {
  orderId: string;
  durationMonths: number;
}
