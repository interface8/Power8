import { z } from "zod";

export const addToCartSchema = z.object({
  itemType: z.enum(["PRODUCT", "BUNDLE"]),
  productId: z.string().optional(),
  bundleId: z.string().optional(),
  quantity: z.number().int().min(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});
