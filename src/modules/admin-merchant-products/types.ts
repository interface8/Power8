import type { MerchantApprovalStatus } from "@prisma/client";
import { z } from "zod";
import { adminPendingMerchantProductsFiltersSchema } from "./validation";

export type AdminPendingMerchantProductsFilters = z.infer<typeof adminPendingMerchantProductsFiltersSchema>;

export type AdminMerchantProductReviewRowDto = {
  id: string;
  merchant: {
    id: string;
    businessName: string;
    contactName: string;
    email: string;
    phone: string;
  };
  name: string;
  description: string | null;
  category: {
    id: string;
    name: string;
  };
  price: number;
  warranty: number;
  capacity: number;
  stockQuantity: number;
  approvalStatus: MerchantApprovalStatus;
  rejectionReason: string | null;
  isActive: boolean;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type AdminPendingMerchantProductsDto = {
  data: AdminMerchantProductReviewRowDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
