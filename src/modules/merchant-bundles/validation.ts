import { z } from "zod";

const bundleItemSchema = z.object({
  merchantProductId: z.string().min(1),
  quantity: z.number().int().min(1),
});

export const createMerchantBundleSchema = z.object({
  name: z.string().min(2).max(150),
  totalPrice: z.number().positive(),
  systemCapacityKw: z.number().positive().optional(),
  description: z.string().optional(),
  items: z.array(bundleItemSchema).min(1, "A bundle needs at least one item"),
});

export const updateMerchantBundleSchema = z
  .object({
    name: z.string().min(2).max(150).optional(),
    totalPrice: z.number().positive().optional(),
    systemCapacityKw: z.number().positive().optional(),
    description: z.string().optional(),
    items: z.array(bundleItemSchema).min(1).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "At least one field is required" });
