import * as repo from "./repository";
import type { AdminCreditAccountFilters } from "./types";

export async function listCreditAccounts(filters: AdminCreditAccountFilters) {
  return repo.findCreditAccounts(filters);
}