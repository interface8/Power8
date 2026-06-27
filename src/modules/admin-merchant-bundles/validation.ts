import { z } from "zod";

export const adminPendingMerchantBundlesFiltersSchema = z.object({
  merchantId: z.string().trim().min(1).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const adminMerchantBundleActionReasonSchema = z.object({
  reason: z.string().trim().min(1, "Reason is required"),
});
