export type ProductApprovalStatus = "APPROVED" | "PENDING" | "REJECTED";

export interface MerchantProduct {
  id: string;
  name: string;
  categoryName: string;
  price: number;
  stockQuantity: number;
  status: ProductApprovalStatus;
  primaryImage: string | null;
  createdAt: string;
}