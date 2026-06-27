import type { MerchantApprovalStatus, MerchantStatus, OrderStatus } from "@prisma/client";
import { z } from "zod";
import {
  adminMerchantActionReasonSchema,
  adminMerchantListFiltersSchema,
  adminPendingMerchantReviewFiltersSchema,
} from "./validation";

export type AdminMerchantListFilters = z.infer<typeof adminMerchantListFiltersSchema>;
export type AdminMerchantActionReasonInput = z.infer<typeof adminMerchantActionReasonSchema>;
export type AdminPendingMerchantReviewFilters = z.infer<typeof adminPendingMerchantReviewFiltersSchema>;

export type AdminMerchantProductCountsDto = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
};

export type AdminMerchantListRowDto = {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  cacNumber: string;
  status: MerchantStatus;
  suspensionReason: string | null;
  createdAt: Date;
  productCounts: AdminMerchantProductCountsDto;
};

export type AdminMerchantsListDto = {
  data: AdminMerchantListRowDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type AdminMerchantProductDto = {
  id: string;
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

export type AdminMerchantBundleItemDto = {
  id: string;
  quantity: number;
  merchantProduct: {
    id: string;
    name: string;
    images: string[];
  };
};

export type AdminMerchantBundleDto = {
  id: string;
  name: string;
  totalPrice: number;
  systemCapacityKw: number | null;
  description: string | null;
  approvalStatus: MerchantApprovalStatus;
  rejectionReason: string | null;
  isActive: boolean;
  items: AdminMerchantBundleItemDto[];
  createdAt: Date;
  updatedAt: Date;
};

export type AdminMerchantOrderSummaryRowDto = {
  id: string;
  orderDate: Date;
  orderStatus: OrderStatus;
  customerName: string;
  itemCount: number;
};

export type AdminMerchantDetailsDto = {
  merchant: {
    id: string;
    userId: string;
    businessName: string;
    businessAddress: string;
    cacNumber: string;
    status: MerchantStatus;
    suspensionReason: string | null;
    contactName: string;
    email: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
  };
  kyc: {
    cacDocumentUrl: string;
    governmentIdUrl: string;
    logoUrl: string | null;
  };
  productCounts: AdminMerchantProductCountsDto;
  products: AdminMerchantProductDto[];
  bundles: AdminMerchantBundleDto[];
  ordersSummary: {
    totalOrders: number;
    recentOrders: AdminMerchantOrderSummaryRowDto[];
  };
};
