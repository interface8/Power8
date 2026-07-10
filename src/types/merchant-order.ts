export interface MerchantOrderItem {
  id: string;
  itemType: "PRODUCT" | "BUNDLE";
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface MerchantOrder {
  id: string;
  customerFirstName: string;
  customerLastName: string;
  orderDate: string;
  orderStatus: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "COMPLETED" | "CANCELLED";
  items: MerchantOrderItem[];
}

export interface MerchantOrderStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
}