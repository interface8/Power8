import * as repo from "./repository";
import type { CreateMerchantBundleInput, UpdateMerchantBundleInput } from "./types";

async function assertValidItems(merchantId: string, items: { merchantProductId: string }[]) {
  const ids = items.map((i) => i.merchantProductId);
  const { notOwned, notApproved } = await repo.checkBundleProducts(merchantId, ids);
  if (notOwned.length) throw new Error(`These products don't belong to you: ${notOwned.join(", ")}`);
  if (notApproved.length) throw new Error(`These products are not approved yet: ${notApproved.join(", ")}`);
}

async function getOwned(merchantId: string, id: string) {
  const bundle = await repo.findById(id);
  if (!bundle) throw new Error("Bundle not found");
  if (bundle.merchantId !== merchantId) throw new Error("Forbidden");
  return bundle;
}

export async function listBundles(merchantId: string) {
  return repo.findByMerchant(merchantId);
}

export async function createBundle(merchantId: string, input: CreateMerchantBundleInput) {
  await assertValidItems(merchantId, input.items);
  return repo.create(merchantId, input);
}

export async function updateBundle(merchantId: string, id: string, input: UpdateMerchantBundleInput) {
  await getOwned(merchantId, id);
  if (input.items) await assertValidItems(merchantId, input.items);
  const bundle = await repo.update(id, input);
  return { bundle, requiresReapproval: true };
}

export async function deleteBundle(merchantId: string, id: string) {
  await getOwned(merchantId, id);
  return repo.deactivate(id);
}
