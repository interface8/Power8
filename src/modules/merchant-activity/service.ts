import * as repo from "./repository";
import type { CreateMerchantActivityInput } from "./types";

export async function recordMerchantActivity(input: CreateMerchantActivityInput) {
  return repo.createActivity(input);
}

export async function recordMerchantActivities(inputs: CreateMerchantActivityInput[]) {
  return repo.createActivities(inputs);
}

export async function getRecentMerchantActivities(merchantId: string, limit = 10) {
  return repo.findRecentActivitiesByMerchant(merchantId, limit);
}
