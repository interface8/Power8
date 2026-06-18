export interface CartItemDto {
  id: string;
  itemType: "PRODUCT" | "BUNDLE";
  productId: string | null;
  productName: string | null;
  productImage: string | null;
  bundleId: string | null;
  bundleName: string | null;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface CartDto {
  cartId: string;
  userId: string;
  items: CartItemDto[];
  total: number;
}

export interface AddToCartInput {
  itemType: "PRODUCT" | "BUNDLE";
  productId?: string;
  bundleId?: string;
  quantity: number;
}

export interface UpdateCartItemInput {
  quantity: number;
}