export interface OrderItemDto {
  id: string;
  itemType: "PRODUCT" | "BUNDLE";
  productId: string | null;
  productName: string | null;
  bundleId: string | null;
  bundleName: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderDto {
  id: string;
  userId: string;
  totalAmount: number;
  paymentType: "FULL" | "CREDIT";
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  items: OrderItemDto[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderItemInput {
  itemType: "PRODUCT" | "BUNDLE";
  productId?: string;
  bundleId?: string;
  quantity: number;
}

export interface CreateOrderInput {
  paymentType: "FULL" | "CREDIT";
  items: CreateOrderItemInput[];
}
