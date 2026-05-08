import * as dashboardRepo from "./repository";

export async function getOverview(userId: string) {
  return dashboardRepo.getOverview(userId);
}

export async function getSavings(userId: string) {
  return dashboardRepo.getSavings(userId);
}

export async function getPaymentSummary(userId: string) {
  return dashboardRepo.getPaymentSummary(userId);
}
