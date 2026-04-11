import { z } from "zod";

export const applyCreditSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  durationMonths: z.number().int().min(1, "Duration must be at least 1 month").max(36, "Duration cannot exceed 36 months"),
});
