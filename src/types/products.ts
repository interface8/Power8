export type Product = {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  categoryName: string;
  companyId: string;
  companyName: string;
  price: number;
  warranty: number;
  capacity: number;
  imageUrl: string | null;
  stockQuantity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  companyId?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string | null;
  sort: number;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  description: string | null;
  address: string;
  contactNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string | null;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  cartId: string | null;
  userId: string;
  items: CartItem[];
  total: number;
}
