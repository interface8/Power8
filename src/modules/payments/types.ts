export interface PaymentDto {
  id: string;
  userId: string;
  orderId: string;
  amount: number;
  status: "SUCCESS" | "FAILED";
  reference: string;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface InitiatePaymentInput {
  orderId: string;
}
