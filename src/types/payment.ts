export interface Payment {
  id: string;
  amount: number;
  status: "SUCCESS" | "PENDING" | "FAILED";
}

export interface Schedule {
  id: string;
  amount: number;
  status: "PAID" | "PENDING";
  dueDate: string;
}

export interface Credit {
  id: string;
  totalAmount: number;
}