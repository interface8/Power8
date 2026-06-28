import * as repo from "./repository";
import type { AdminPendingMerchantProductsFilters } from "./types";

export async function listPendingProducts(filters: AdminPendingMerchantProductsFilters) {
  return repo.findPendingProducts(filters);
}
