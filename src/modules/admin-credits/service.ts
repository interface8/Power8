import * as repo from "./repository";
import type { AdminCreditAccountFilters } from "./types";

export async function listCreditAccounts(filters: AdminCreditAccountFilters) {
  return repo.findCreditAccounts(filters);
}

export async function getCreditAccountDetailsById(id: string) {
  const credit = await repo.findCreditAccountDetailsById(id);
  if (!credit) throw new Error("Credit not found");
  return credit;
}