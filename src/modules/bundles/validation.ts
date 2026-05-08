import { z } from "zod";

const bundleItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const createBundleSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  totalPrice: z.number().positive("Total price must be greater than 0"),
  systemCapacityKw: z.number().positive("Capacity must be greater than 0").optional(),
  items: z.array(bundleItemSchema).min(1, "Bundle must have at least one item"),
});

export const updateBundleSchema = z.object({
  name: z.string().min(1, "Name is required").max(100).optional(),
  totalPrice: z.number().positive("Total price must be greater than 0").optional(),
  systemCapacityKw: z.number().positive("Capacity must be greater than 0").optional(),
  items: z.array(bundleItemSchema).min(1, "Bundle must have at least one item").optional(),
});
