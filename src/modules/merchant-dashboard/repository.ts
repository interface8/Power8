import { prisma } from "@/lib/prisma";
import type { OrderStatus, Prisma } from "@prisma/client";
import type {
  MerchantDashboardStatsDto,
  MerchantOrderDetailDto,
  MerchantOrdersFilters,
  MerchantOrdersListDto,
  MerchantOrderItemDto,
} from "./types";
import { merchantActivityService } from "@/modules/merchant-activity";

function splitCustomerName(name: string | null | undefined) {
  const trimmed = name?.trim() ?? "";
  if (!trimmed) return { firstName: "", lastName: "" };

  const parts = trimmed.split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? "";
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";
  return { firstName, lastName };
}

function buildOrderItemDto(item: {
  id: string;
  itemType: "PRODUCT" | "BUNDLE";
  quantity: number;
  unitPrice: { toNumber: () => number };
  product?: { name: string } | null;
  bundle?: { name: string } | null;
}): MerchantOrderItemDto {
  return {
    id: item.id,
    itemType: item.itemType,
    name: item.itemType === "PRODUCT" ? item.product?.name ?? "Unknown product" : item.bundle?.name ?? "Unknown bundle",
    quantity: item.quantity,
    unitPrice: item.unitPrice.toNumber(),
  };
}

function merchantItemFilters(merchantId: string): Prisma.OrderItemWhereInput[] {
  return [
    {
      product: {
        merchantProduct: {
          merchantId,
        },
      },
    },
    {
      bundle: {
        merchantBundle: {
          merchantId,
        },
      },
    },
  ];
}

function merchantOrderWhere(merchantId: string, filters?: MerchantOrdersFilters): Prisma.OrderWhereInput {
  const where: Prisma.OrderWhereInput = {
    OR: [
      {
        items: {
          some: merchantItemFilters(merchantId)[0],
        },
      },
      {
        items: {
          some: merchantItemFilters(merchantId)[1],
        },
      },
    ],
  };

  if (filters?.orderStatus) where.status = filters.orderStatus;
  if (filters?.startDate || filters?.endDate) {
    where.createdAt = {};
    if (filters.startDate) where.createdAt.gte = filters.startDate;
    if (filters.endDate) where.createdAt.lte = filters.endDate;
  }

  return where;
}

const merchantOrderSelect = (merchantId: string): Prisma.OrderSelect => ({
  id: true,
  status: true,
  createdAt: true,
  user: {
    select: {
      name: true,
    },
  },
  items: {
    where: {
      OR: merchantItemFilters(merchantId),
    },
    select: {
      id: true,
      itemType: true,
      quantity: true,
      unitPrice: true,
      product: {
        select: {
          name: true,
        },
      },
      bundle: {
        select: {
          name: true,
        },
      },
    },
  },
});

export async function getMerchantDashboardStats(merchantId: string): Promise<MerchantDashboardStatsDto> {
  const [totalProducts, pendingProducts, approvedProducts, rejectedProducts, totalOrders, recentActivity] =
    await Promise.all([
      prisma.merchantProduct.count({ where: { merchantId } }),
      prisma.merchantProduct.count({ where: { merchantId, approvalStatus: "PENDING" } }),
      prisma.merchantProduct.count({ where: { merchantId, approvalStatus: "APPROVED" } }),
      prisma.merchantProduct.count({ where: { merchantId, approvalStatus: "REJECTED" } }),
      prisma.order.count({ where: merchantOrderWhere(merchantId) }),
      merchantActivityService.getRecentMerchantActivities(merchantId, 10),
    ]);

  return {
    totalProducts,
    pendingProducts,
    approvedProducts,
    rejectedProducts,
    totalOrders,
    recentActivity,
  };
}

export async function findMerchantOrders(
  merchantId: string,
  filters: MerchantOrdersFilters,
): Promise<MerchantOrdersListDto> {
  const { page, limit } = filters;
  const skip = (page - 1) * limit;
  const where = merchantOrderWhere(merchantId, filters);

  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: merchantOrderSelect(merchantId),
    }),
  ]);

  return {
    data: orders.map((order) => ({
      orderId: order.id,
      customer: splitCustomerName(order.user.name),
      orderDate: order.createdAt,
      orderStatus: order.status as OrderStatus,
      items: order.items.map(buildOrderItemDto),
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function findMerchantOrderById(
  merchantId: string,
  orderId: string,
): Promise<MerchantOrderDetailDto | null> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: merchantOrderSelect(merchantId),
  });

  if (!order || order.items.length === 0) return null;

  return {
    orderId: order.id,
    customer: splitCustomerName(order.user.name),
    orderDate: order.createdAt,
    orderStatus: order.status as OrderStatus,
    items: order.items.map(buildOrderItemDto),
  };
}

export async function logMerchantOrderActivities(params: {
  orderId: string;
  merchantIds: string[];
  itemCountByMerchant: Map<string, number>;
}) {
  const { orderId, merchantIds, itemCountByMerchant } = params;
  if (merchantIds.length === 0) return;

  await merchantActivityService.recordMerchantActivities(
    merchantIds.map((merchantId) => ({
      merchantId,
      type: "NEW_ORDER",
      message: `New order ${orderId} contains ${itemCountByMerchant.get(merchantId) ?? 1} of your item(s).`,
    })),
  );
}
