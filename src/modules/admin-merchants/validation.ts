import { z } from "zod";
import { MerchantStatus } from "@prisma/client";

export const adminMerchantListFiltersSchema = z.object({
  status: z.nativeEnum(MerchantStatus).optional(),
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const adminMerchantActionReasonSchema = z.object({
  reason: z.string().trim().min(1, "Reason is required"),
});

export const adminPendingMerchantReviewFiltersSchema = z.object({
  merchantId: z.string().trim().min(1).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
