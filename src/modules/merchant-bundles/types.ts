import { z } from "zod";
import { createMerchantBundleSchema, updateMerchantBundleSchema } from "./validation";

export type CreateMerchantBundleInput = z.infer<typeof createMerchantBundleSchema>;
export type UpdateMerchantBundleInput = z.infer<typeof updateMerchantBundleSchema>;
