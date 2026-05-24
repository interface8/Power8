import * as productRepo from "./repository";
import type { CreateProductInput, UpdateProductInput, ProductFilters } from "./types";
import type { AdminProductFilters } from "./types";

export async function listProducts(filters: ProductFilters) {
  return productRepo.findProducts(filters);
}

export async function getProductById(id: string) {
  const product = await productRepo.findProductById(id);
  if (!product) throw new Error("Product not found");
  return product;
}

export async function createProduct(input: CreateProductInput) {
   if (await productRepo.findProductByName(input.name)) {
    throw new Error("Product already exists");
  }
  return productRepo.createProduct(input);
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  if (!(await productRepo.productExists(id))) {
    throw new Error("Product not found");
  }
  return productRepo.updateProduct(id, input);
}

export async function deleteProduct(id: string) {
  if (!(await productRepo.productExists(id))) {
    throw new Error("Product not found");
  }
  return productRepo.deleteProduct(id);
}

export async function listProductsAdmin(filters: AdminProductFilters) {
  return productRepo.findProductsAdmin(filters);
}

export async function updateProductStock(id: string, stockQuantity: number) {
  if (!(await productRepo.productExists(id))) {
    throw new Error("Product not found");
  }
  return productRepo.updateProductStock(id, stockQuantity);
}

export async function deleteProductAdmin(id: string) {
  if (!(await productRepo.productExists(id))) {
    throw new Error("Product not found");
  }

  const referenced = await productRepo.isProductReferencedInOrders(id);

  if (referenced) {
    await productRepo.softDeleteProduct(id);
    return { mode: "soft" as const };
  }

  await productRepo.hardDeleteProduct(id);
  return { mode: "hard" as const };
}