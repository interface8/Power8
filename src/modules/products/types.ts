export type ProductStockStatus = "IN_STOCK" | "OUT_OF_STOCK" | "LOW_STOCK";

export interface ProductDto {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  categoryName: string;
  companyId: string;
  companyName: string;
  merchantName: string | null;
  merchantId: string | null; 
  price: number;
  warranty: number;
  capacity: number;
  imageUrl: string | null;
  imageUrls: string[];
  stockQuantity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  categoryId: string;
  companyId: string;
  price: number;
  warranty: number;
  capacity: number;
  imageUrl?: string;
  imageUrls?: string[];
  stockQuantity?: number;
  isActive?: boolean;
}

export type UpdateProductInput = Partial<CreateProductInput>;

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  companyId?: string;
  minCapacity?: number;
  page?: number;
  limit?: number;
}

export interface PaginatedProducts {
  products: ProductDto[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AdminProductFilters extends ProductFilters {
  isActive?: boolean;
  stockStatus?: ProductStockStatus;
  lowStockThreshold?: number;
}
