import { z } from "zod";

export const createCarouselSlideSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL"),
  linkUrl: z.string().url("Must be a valid URL").optional(),
  sort: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const updateCarouselSlideSchema = createCarouselSlideSchema.partial();
