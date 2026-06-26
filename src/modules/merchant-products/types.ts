import { z } from "zod";
import {
  createMerchantProductSchema,
  updateMerchantProductSchema,
  updateStockSchema,
  listMerchantProductsSchema,
} from "./validation";

export type CreateMerchantProductInput = z.infer<typeof createMerchantProductSchema>;
export type UpdateMerchantProductInput = z.infer<typeof updateMerchantProductSchema>;
export type UpdateStockInput = z.infer<typeof updateStockSchema>;
export type ListMerchantProductsFilters = z.infer<typeof listMerchantProductsSchema>;
