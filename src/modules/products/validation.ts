import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  categoryId: z.string().min(1, "Category is required"),
  companyId: z.string().min(1, "Company is required"),
  price: z.number().positive("Price must be greater than 0"),
  warranty: z.number().int().min(0, "Warranty cannot be negative"),
  capacity: z.number().int().min(0, "Capacity cannot be negative"),
  imageUrl: z.string().url("Invalid image URL").optional(),
  stockQuantity: z.number().int().min(0, "Stock cannot be negative").optional(),
  isActive: z.boolean().optional().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export const productFiltersSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  companyId: z.string().optional(),
  minCapacity: z.coerce.number().int().min(0).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(12),
});

export const adminProductFiltersSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  companyId: z.string().optional(),
  minCapacity: z.coerce.number().int().min(0).optional(),

  isActive: z.coerce.boolean().optional(),

  stockStatus: z.enum(["IN_STOCK", "OUT_OF_STOCK", "LOW_STOCK"]).optional(),
  lowStockThreshold: z.coerce.number().int().min(0).optional().default(5),

  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const updateProductStockSchema = z.object({
  stockQuantity: z.number().int().min(0, "Stock cannot be negative"),
});