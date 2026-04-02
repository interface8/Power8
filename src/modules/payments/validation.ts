import { z } from "zod";

export const initiatePaymentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  amount: z.number().positive("Amount must be greater than 0"),
});
