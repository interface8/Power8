export interface ProductCategoryDto {
  id: string;
  name: string;
  description: string | null;
  sort: number;
  isActive: boolean;  // ← ADD THIS
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductCategoryInput {
  name: string;
  description?: string;
  sort: number;
  isActive?: boolean;  // ← ADD THIS
}

export type UpdateProductCategoryInput = Partial<CreateProductCategoryInput>;