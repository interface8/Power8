export type CreditStatus =
  | "ACTIVE"
  | "COMPLETED"
  | "DEFAULTED";

  export interface CreditAccount{
    id: string;
    customerName: string;
    totalAmount: number;
    balanceRemaining: number;
    durationMonths: number;
    status: CreditStatus;
    repaymentPercentage: number;
  }
  
  