import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(2, "Role name must be at least 2 characters").max(100),
  description: z.string().max(500).optional(),
  permissionIds: z.array(z.string().min(1)).optional(),
});

export const updateRoleSchema = z
  .object({
    name: z.string().min(2, "Role name must be at least 2 characters").max(100).optional(),
    description: z.string().max(500).nullable().optional(),
    permissionIds: z.array(z.string().min(1)).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });