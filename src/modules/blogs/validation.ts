import { z } from "zod";

export const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1, "Content is required"),
  imageUrl: z.string().url("Invalid image URL").optional(),
  isPublished: z.boolean().optional().default(false),
  categoryId: z.string().optional(),
  companyId: z.string().optional(),
  authorId: z.string().optional(),
});

export const updateBlogSchema = createBlogSchema.partial();

export const blogFiltersSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  companyId: z.string().optional(),
  published: z.coerce.boolean().optional(),
});

export const createBlogCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  sort: z.number().int().min(0).optional().default(0),
});

export const updateBlogCategorySchema = createBlogCategorySchema.partial();
