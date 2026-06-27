import { z } from "zod";
import {
  adminPendingMerchantBundlesFiltersSchema,
  adminMerchantBundleActionReasonSchema,
} from "./validation";

export type AdminPendingMerchantBundlesFilters = z.infer<typeof adminPendingMerchantBundlesFiltersSchema>;
export type AdminMerchantBundleActionReasonInput = z.infer<typeof adminMerchantBundleActionReasonSchema>;

export type AdminMerchantBundleReviewRowDto = {
  id: string;
  merchant: {
    id: string;
    businessName: string;
    contactName: string;
    email: string;
    phone: string;
  };
  name: string;
  totalPrice: number;
  systemCapacityKw: number | null;
  description: string | null;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason: string | null;
  isActive: boolean;
  items: {
    id: string;
    quantity: number;
    merchantProduct: {
      id: string;
      name: string;
      images: string[];
    };
  }[];
  createdAt: Date;
  updatedAt: Date;
};

export type AdminPendingMerchantBundlesDto = {
  data: AdminMerchantBundleReviewRowDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
