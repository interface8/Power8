import * as repo from "./repository";
import type {
  CreateMerchantProductInput,
  UpdateMerchantProductInput,
  ListMerchantProductsFilters,
} from "./types";

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
  return repo.create(merchantId, input);
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


