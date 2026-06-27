import * as repo from "./repository";
import type { MerchantOrdersFilters } from "./types";

export async function getDashboardStats(merchantId: string) {
  return repo.getMerchantDashboardStats(merchantId);
}

export async function listOrders(merchantId: string, filters: MerchantOrdersFilters) {
  return repo.findMerchantOrders(merchantId, filters);
}

export async function getOrderById(merchantId: string, orderId: string) {
  const order = await repo.findMerchantOrderById(merchantId, orderId);
  if (!order) throw new Error("Order not found");
  return order;
}
