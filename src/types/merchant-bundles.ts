export interface MerchantBundle {
  id: string;
  name: string;
  totalPrice: number;
  capacity: string;
  itemsCount: number;
  status: "APPROVED" | "PENDING" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

export interface MerchantBundleStats {
  totalBundles: number;
  approvedBundles: number;
  pendingBundles: number;
}

export interface MerchantBundleFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}