import * as bundleRepo from "./repository";
import type { CreateBundleInput, UpdateBundleInput } from "./types";

export async function listBundles() {
  return bundleRepo.findBundles();
}

export async function getBundleById(id: string) {
  const bundle = await bundleRepo.findBundleById(id);
  if (!bundle) throw new Error("Bundle not found");
  return bundle;
}

export async function createBundle(input: CreateBundleInput) {
  if (await bundleRepo.findBundleByName(input.name)) {
    throw new Error("Bundle already exists");
  }
  return bundleRepo.createBundle(input);
}

export async function updateBundle(id: string, input: UpdateBundleInput) {
  if (!(await bundleRepo.bundleExists(id))) {
    throw new Error("Bundle not found");
  }
  return bundleRepo.updateBundle(id, input);
}
