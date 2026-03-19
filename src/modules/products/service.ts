import * as productRepo from "./repository";
import type { ProductFilters } from "./types";

export async function listProducts(filters: ProductFilters) {
  return productRepo.findProducts(filters);
}

export async function getProductById(id: string) {
  const product = await productRepo.findProductById(id);
  if (!product) throw new Error("Product not found");
  return product;
}
