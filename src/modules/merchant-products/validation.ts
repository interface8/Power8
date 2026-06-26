import { z } from "zod";

export const createMerchantProductSchema = z.object({
  name: z.string().min(2).max(150),
  description: z.string().min(1),
  categoryId: z.string().min(1),
  price: z.number().positive(),
  warranty: z.number().int().min(0),
  capacity: z.number().int().min(0),
  stockQuantity: z.number().int().min(0),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
});

export const updateMerchantProductSchema = z
  .object({
    name: z.string().min(2).max(150).optional(),
    description: z.string().min(1).optional(),
    categoryId: z.string().min(1).optional(),
    price: z.number().positive().optional(),
    warranty: z.number().int().min(0).optional(),
    capacity: z.number().int().min(0).optional(),
    stockQuantity: z.number().int().min(0).optional(),
    images: z.array(z.string().url()).min(1).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "At least one field is required" });

export const updateStockSchema = z.object({
  stockQuantity: z.number().int().min(0),
});

export const listMerchantProductsSchema = z.object({
  approvalStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  isActive: z.enum(["true", "false"]).transform((v) => v === "true").optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});
