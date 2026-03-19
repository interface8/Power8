import z from "zod";

export const productFiltersSchema = z.object({
  search: z.string().optional(),
});