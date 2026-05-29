import * as categoryRepo from "./repository";
import type {
  CreateProductCategoryInput,
  UpdateProductCategoryInput,
} from "./types";

export async function listCategories(activeOnly?: boolean) {
  return categoryRepo.findCategories(activeOnly);
}

export async function getCategoryById(id: string) {
  const category = await categoryRepo.findCategoryById(id);
  if (!category) throw new Error("Category not found");
  return category;
}

export async function createCategory(input: CreateProductCategoryInput) {
  if (await categoryRepo.findCategoryByName(input.name)) {
    throw new Error("Category already exists");
  }
  return categoryRepo.createCategory(input);
}

export async function updateCategory(
  id: string,
  input: UpdateProductCategoryInput,
) {
  if (!(await categoryRepo.categoryExists(id))) {
    throw new Error("Category not found");
  }
  return categoryRepo.updateCategory(id, input);
}

export async function deleteCategory(id: string) {
  if (!(await categoryRepo.categoryExists(id))) {
    throw new Error("Category not found");
  }
  return categoryRepo.deleteCategory(id);
}

export async function deleteCategoryAdmin(id: string) {
  if (!(await categoryRepo.categoryExists(id))) {
    throw new Error("Category not found");
  }

  if (await categoryRepo.categoryHasProducts(id)) {
    throw new Error("Category has products");
  }

  return categoryRepo.deleteCategory(id);
}