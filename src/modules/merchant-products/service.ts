import * as repo from "./repository";
import type {
  CreateMerchantProductInput,
  UpdateMerchantProductInput,
  ListMerchantProductsFilters,
} from "./types";
import { merchantActivityService } from "@/modules/merchant-activity";

export async function listProducts(merchantId: string, filters: ListMerchantProductsFilters) {
  return repo.findByMerchant(merchantId, filters);
}

async function getOwned(merchantId: string, id: string) {
  const product = await repo.findById(id);
  if (!product) throw new Error("Product not found");
  if (product.merchantId !== merchantId) throw new Error("Forbidden");
  return product;
}

export async function createProduct(merchantId: string, input: CreateMerchantProductInput) {
  if (!(await repo.categoryExists(input.categoryId))) throw new Error("Category not found");
  const product = await repo.create(merchantId, input);

  await merchantActivityService.recordMerchantActivity({
    merchantId,
    type: "PRODUCT_SUBMITTED",
    message: `Product "${product.name}" submitted for review.`,
  });

  return product;
}

export async function updateProduct(
  merchantId: string,
  id: string,
  input: UpdateMerchantProductInput,
) {
  await getOwned(merchantId, id);
  if (input.categoryId && !(await repo.categoryExists(input.categoryId))) {
    throw new Error("Category not found");
  }
  const product = await repo.update(id, input);

  await merchantActivityService.recordMerchantActivity({
    merchantId,
    type: "PRODUCT_SUBMITTED",
    message: `Product "${product.name}" updated and submitted for review.`,
  });

  return { product, requiresReapproval: true };
}

export async function updateStock(merchantId: string, id: string, stockQuantity: number) {
  await getOwned(merchantId, id);
  return repo.updateStock(id, stockQuantity); // no approval reset
}

export async function deleteProduct(merchantId: string, id: string) {
  await getOwned(merchantId, id);
  return repo.deactivate(id); // soft-delete only
}

export async function approveProduct(id: string) {
  const product = await repo.findById(id);
  if (!product) throw new Error("Product not found");
  if (product.approvalStatus === "APPROVED") throw new Error("Product already approved");

  const updated = await repo.setApprovalStatus(id, "APPROVED", null);

  await merchantActivityService.recordMerchantActivity({
    merchantId: updated.merchantId,
    type: "PRODUCT_APPROVED",
    message: `Product "${updated.name}" approved.`,
  });

  return updated;
}

export async function rejectProduct(id: string, reason: string) {
  if (!reason.trim()) throw new Error("Reason is required");
  const product = await repo.findById(id);
  if (!product) throw new Error("Product not found");
  if (product.approvalStatus === "REJECTED") throw new Error("Product already rejected");

  const updated = await repo.setApprovalStatus(id, "REJECTED", reason.trim());

  await merchantActivityService.recordMerchantActivity({
    merchantId: updated.merchantId,
    type: "PRODUCT_REJECTED",
    message: `Product "${updated.name}" rejected.${reason ? ` Reason: ${reason.trim()}` : ""}`,
  });

  return updated;
}


