import { z } from "zod";

const queryBooleanSchema = z.preprocess((value) => {
  if (typeof value === "string") {
    const normalized = value.toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }
  return value;
}, z.boolean());

export const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1, "Content is required"),
  imageUrl: z.string().url("Invalid image URL").optional(),
  isPublished: z.boolean().optional().default(false),
  categoryId: z.string().optional(),
  companyId: z.string().optional(),
  authorId: z.string().optional(),
});

export const updateBlogSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(200).optional(),
    slug: z
      .string()
      .min(1, "Slug is required")
      .max(200)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format")
      .optional(),
    excerpt: z.string().max(500).nullable().optional(),
    content: z.string().min(1, "Content is required").optional(),
    imageUrl: z.string().url("Invalid image URL").nullable().optional(),
    isPublished: z.boolean().optional(),
    categoryId: z.string().nullable().optional(),
    companyId: z.string().nullable().optional(),
    authorId: z.string().nullable().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

export const blogFiltersSchema = z.object({
  search: z.string().trim().min(1).optional(),
  categoryId: z.string().optional(),
  companyId: z.string().optional(),
  published: queryBooleanSchema.optional(),
});

export const adminBlogFiltersSchema = z.object({
  search: z.string().trim().min(1).optional(),
  categoryId: z.string().optional(),
  authorId: z.string().optional(),
  published: queryBooleanSchema.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const createBlogCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  sort: z.coerce.number().int().min(0).optional().default(0),
});

export const updateBlogCategorySchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100).optional(),
    description: z.string().max(500).nullable().optional(),
    sort: z.coerce.number().int().min(0).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });