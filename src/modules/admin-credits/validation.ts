import { z } from "zod";
import { CreditStatus } from "@prisma/client";

export const adminCreditAccountFiltersSchema = z.object({
  status: z.nativeEnum(CreditStatus).optional(),
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});