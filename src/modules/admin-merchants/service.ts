import * as repo from "./repository";
import type { AdminMerchantListFilters } from "./types";

export async function listMerchants(filters: AdminMerchantListFilters) {
  return repo.findMerchants(filters);
}

export async function getMerchantDetailsById(merchantId: string) {
  const merchant = await repo.findMerchantDetailsById(merchantId);
  if (!merchant) throw new Error("Merchant not found");
  return merchant;
}

export async function approveMerchant(merchantId: string) {
  return repo.approveMerchant(merchantId);
}

export async function suspendMerchant(merchantId: string, reason: string) {
  if (!reason.trim()) throw new Error("Reason is required");
  return repo.suspendMerchant(merchantId, reason.trim());
}

export async function reinstateMerchant(merchantId: string) {
  return repo.reinstateMerchant(merchantId);
}
