import { z } from "zod";

export const adminUserListFiltersSchema = z.object({
  search: z.string().trim().min(1).optional(),
  isActive: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const adminUpdateUserStatusSchema = z.object({
  isActive: z.coerce.boolean(),
});
