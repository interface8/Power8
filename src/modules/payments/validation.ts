import { z } from "zod";

export const initiatePaymentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
});
