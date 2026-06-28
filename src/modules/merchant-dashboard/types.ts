import type { OrderStatus } from "@prisma/client";
import type { MerchantActivityLogDto } from "@/modules/merchant-activity";

export type MerchantDashboardStatsDto = {
  totalProducts: number;
  pendingProducts: number;
  approvedProducts: number;
  rejectedProducts: number;
  totalOrders: number;
  recentActivity: MerchantActivityLogDto[];
};

export type MerchantOrderItemDto = {
  id: string;
  itemType: "PRODUCT" | "BUNDLE";
  name: string;
  quantity: number;
  unitPrice: number;
};

export type MerchantOrderCustomerDto = {
  firstName: string;
  lastName: string;
};

export type MerchantOrderListRowDto = {
  orderId: string;
  customer: MerchantOrderCustomerDto;
  orderDate: Date;
  orderStatus: OrderStatus;
  items: MerchantOrderItemDto[];
};

export type MerchantOrdersListDto = {
  data: MerchantOrderListRowDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type MerchantOrdersFilters = {
  orderStatus?: OrderStatus;
  startDate?: Date;
  endDate?: Date;
  page: number;
  limit: number;
};

export type MerchantOrderDetailDto = MerchantOrderListRowDto;
