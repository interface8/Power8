import * as repo from "./repository";
import type { AdminPendingMerchantBundlesFilters } from "./types";

export async function listPendingBundles(filters: AdminPendingMerchantBundlesFilters) {
  return repo.findPendingBundles(filters);
}

export async function approveBundle(bundleId: string) {
  const bundle = await repo.findBundleById(bundleId);
  if (!bundle) throw new Error("Bundle not found");
  if (bundle.approvalStatus === "APPROVED") throw new Error("Bundle already approved");
  return repo.setBundleApprovalStatus({ bundleId, approvalStatus: "APPROVED" });
}

export async function rejectBundle(bundleId: string, reason: string) {
  if (!reason.trim()) throw new Error("Reason is required");

  const bundle = await repo.findBundleById(bundleId);
  if (!bundle) throw new Error("Bundle not found");
  if (bundle.approvalStatus === "REJECTED") throw new Error("Bundle already rejected");

  return repo.setBundleApprovalStatus({
    bundleId,
    approvalStatus: "REJECTED",
    rejectionReason: reason.trim(),
  });
}
