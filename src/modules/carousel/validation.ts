import { z } from "zod";

export const createCarouselSlideSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL"),
  linkUrl: z.string().url("Must be a valid URL").optional(),
  sort: z.coerce.number().int().min(0, "Sort must be 0 or greater"),
  isActive: z.boolean().optional(),
});

export const updateCarouselSlideSchema = z
  .object({
    title: z.string().min(2, "Title must be at least 2 characters").optional(),
    description: z.string().optional(),
    imageUrl: z.string().url("Must be a valid URL").optional(),
    linkUrl: z.string().url("Must be a valid URL").optional(),
    sort: z.coerce.number().int().min(0, "Sort must be 0 or greater").optional(),
    isActive: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });