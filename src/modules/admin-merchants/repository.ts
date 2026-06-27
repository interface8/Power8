import { prisma } from "@/lib/prisma";
import type { MerchantApprovalStatus, OrderStatus, Prisma } from "@prisma/client";
import type {
  AdminMerchantDetailsDto,
  AdminMerchantListFilters,
  AdminMerchantListRowDto,
  AdminMerchantProductCountsDto,
  AdminMerchantsListDto,
} from "./types";

function emptyCounts(): AdminMerchantProductCountsDto {
  return { total: 0, pending: 0, approved: 0, rejected: 0 };
}

function addCountBucket(
  counts: Map<string, AdminMerchantProductCountsDto>,
  merchantId: string,
  status: MerchantApprovalStatus,
  value: number,
) {
  const bucket = counts.get(merchantId) ?? emptyCounts();
  bucket.total += value;
  if (status === "PENDING") bucket.pending += value;
  if (status === "APPROVED") bucket.approved += value;
  if (status === "REJECTED") bucket.rejected += value;
  counts.set(merchantId, bucket);
}

export async function findMerchants(filters: AdminMerchantListFilters): Promise<AdminMerchantsListDto> {
  const { status, search, page, limit } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.MerchantWhereInput = {};
  if (status) where.status = status;

  if (search) {
    where.OR = [
      { businessName: { contains: search, mode: "insensitive" } },
      { cacNumber: { contains: search, mode: "insensitive" } },
      { user: { name: { contains: search, mode: "insensitive" } } },
      { user: { email: { contains: search, mode: "insensitive" } } },
      { user: { phone: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [total, rows] = await Promise.all([
    prisma.merchant.count({ where }),
    prisma.merchant.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        businessName: true,
        cacNumber: true,
        status: true,
        suspensionReason: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    }),
  ]);

  const merchantIds = rows.map((row) => row.id);
  const productCounts = new Map<string, AdminMerchantProductCountsDto>();

  if (merchantIds.length > 0) {
    const grouped = await prisma.merchantProduct.groupBy({
      by: ["merchantId", "approvalStatus"],
      where: { merchantId: { in: merchantIds } },
      _count: { _all: true },
    });

    for (const row of grouped as Array<{
      merchantId: string;
      approvalStatus: MerchantApprovalStatus;
      _count: { _all: number };
    }>) {
      addCountBucket(productCounts, row.merchantId, row.approvalStatus, row._count._all);
    }
  }

  return {
    data: rows.map((row): AdminMerchantListRowDto => ({
      id: row.id,
      businessName: row.businessName,
      contactName: row.user.name,
      email: row.user.email,
      phone: row.user.phone,
      cacNumber: row.cacNumber,
      status: row.status,
      suspensionReason: row.suspensionReason,
      createdAt: row.createdAt,
      productCounts: productCounts.get(row.id) ?? emptyCounts(),
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function findMerchantDetailsById(id: string): Promise<AdminMerchantDetailsDto | null> {
  const merchant = await prisma.merchant.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      businessName: true,
      businessAddress: true,
      cacNumber: true,
      cacDocumentUrl: true,
      governmentIdUrl: true,
      logoUrl: true,
      status: true,
      suspensionReason: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  if (!merchant) return null;

  const [products, bundles, counts] = await Promise.all([
    prisma.merchantProduct.findMany({
      where: { merchantId: id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        warranty: true,
        capacity: true,
        stockQuantity: true,
        approvalStatus: true,
        rejectionReason: true,
        isActive: true,
        images: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.merchantBundle.findMany({
      where: { merchantId: id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        totalPrice: true,
        systemCapacityKw: true,
        description: true,
        approvalStatus: true,
        rejectionReason: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            id: true,
            quantity: true,
            merchantProduct: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
      },
    }),
    prisma.merchantProduct.groupBy({
      by: ["approvalStatus"],
      where: { merchantId: id },
      _count: { _all: true },
    }),
  ]);

  const merchantProductIds = products.map((product) => product.id);
  const merchantBundleIds = bundles.map((bundle) => bundle.id);

  const orderItemFilters: Prisma.OrderItemWhereInput[] = [];
  if (merchantProductIds.length > 0) {
    orderItemFilters.push({
      product: {
        merchantProductId: { in: merchantProductIds },
      },
    });
  }
  if (merchantBundleIds.length > 0) {
    orderItemFilters.push({
      bundle: {
        merchantBundleId: { in: merchantBundleIds },
      },
    });
  }

  const orderWhere: Prisma.OrderWhereInput | undefined =
    orderItemFilters.length > 0
      ? {
          items: {
            some: {
              OR: orderItemFilters,
            },
          },
        }
      : undefined;

  const [orderSummaryCount, orderSummaryRows] = orderWhere
    ? await Promise.all([
        prisma.order.count({ where: orderWhere }),
        prisma.order.findMany({
          where: orderWhere,
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            createdAt: true,
            status: true,
            user: {
              select: { name: true },
            },
            items: {
              where: {
                OR: orderItemFilters,
              },
              select: {
                id: true,
              },
            },
          },
        }),
      ])
    : [0, [] as Array<{ id: string; createdAt: Date; status: OrderStatus; user: { name: string }; items: { id: string }[] }>];

  const productCounts = counts.reduce<AdminMerchantProductCountsDto>(
    (acc, row: { approvalStatus: MerchantApprovalStatus; _count: { _all: number } }) => {
      acc.total += row._count._all;
      if (row.approvalStatus === "PENDING") acc.pending += row._count._all;
      if (row.approvalStatus === "APPROVED") acc.approved += row._count._all;
      if (row.approvalStatus === "REJECTED") acc.rejected += row._count._all;
      return acc;
    },
    emptyCounts(),
  );

  return {
    merchant: {
      id: merchant.id,
      userId: merchant.userId,
      businessName: merchant.businessName,
      businessAddress: merchant.businessAddress,
      cacNumber: merchant.cacNumber,
      status: merchant.status,
      suspensionReason: merchant.suspensionReason,
      contactName: merchant.user.name,
      email: merchant.user.email,
      phone: merchant.user.phone,
      createdAt: merchant.createdAt,
      updatedAt: merchant.updatedAt,
    },
    kyc: {
      cacDocumentUrl: merchant.cacDocumentUrl,
      governmentIdUrl: merchant.governmentIdUrl,
      logoUrl: merchant.logoUrl,
    },
    productCounts,
    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price.toNumber(),
      warranty: product.warranty,
      capacity: product.capacity,
      stockQuantity: product.stockQuantity,
      approvalStatus: product.approvalStatus,
      rejectionReason: product.rejectionReason,
      isActive: product.isActive,
      images: product.images,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    })),
    bundles: bundles.map((bundle) => ({
      id: bundle.id,
      name: bundle.name,
      totalPrice: bundle.totalPrice.toNumber(),
      systemCapacityKw: bundle.systemCapacityKw?.toNumber() ?? null,
      description: bundle.description,
      approvalStatus: bundle.approvalStatus,
      rejectionReason: bundle.rejectionReason,
      isActive: bundle.isActive,
      items: bundle.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        merchantProduct: {
          id: item.merchantProduct.id,
          name: item.merchantProduct.name,
          images: item.merchantProduct.images,
        },
      })),
      createdAt: bundle.createdAt,
      updatedAt: bundle.updatedAt,
    })),
    ordersSummary: {
      totalOrders: orderSummaryCount,
      recentOrders: orderSummaryRows.map((order) => ({
        id: order.id,
        orderDate: order.createdAt,
        orderStatus: order.status,
        customerName: order.user.name,
        itemCount: order.items.length,
      })),
    },
  };
}

export async function approveMerchant(merchantId: string) {
  return prisma.$transaction(async (tx) => {
    const merchant = await tx.merchant.findUnique({
      where: { id: merchantId },
      select: { id: true, status: true },
    });

    if (!merchant) throw new Error("Merchant not found");
    if (merchant.status === "APPROVED") throw new Error("Merchant already approved");

    const updated = await tx.merchant.update({
      where: { id: merchantId },
      data: {
        status: "APPROVED",
        suspensionReason: null,
      },
      select: {
        id: true,
        status: true,
        updatedAt: true,
      },
    });

    await tx.merchantActivityLog.create({
      data: {
        merchantId,
        type: "MERCHANT_APPROVED",
        message: "Your merchant account was approved.",
      },
    });

    return updated;
  });
}

export async function suspendMerchant(merchantId: string, reason: string) {
  return prisma.$transaction(async (tx) => {
    const merchant = await tx.merchant.findUnique({
      where: { id: merchantId },
      select: { id: true, status: true },
    });

    if (!merchant) throw new Error("Merchant not found");
    if (merchant.status === "SUSPENDED") throw new Error("Merchant already suspended");

    const updated = await tx.merchant.update({
      where: { id: merchantId },
      data: {
        status: "SUSPENDED",
        suspensionReason: reason,
      },
      select: {
        id: true,
        status: true,
        suspensionReason: true,
        updatedAt: true,
      },
    });

    await tx.merchantActivityLog.create({
      data: {
        merchantId,
        type: "MERCHANT_SUSPENDED",
        message: `Your merchant account was suspended. Reason: ${reason}`,
      },
    });

    return updated;
  });
}

export async function reinstateMerchant(merchantId: string) {
  return prisma.$transaction(async (tx) => {
    const merchant = await tx.merchant.findUnique({
      where: { id: merchantId },
      select: { id: true, status: true },
    });

    if (!merchant) throw new Error("Merchant not found");
    if (merchant.status !== "SUSPENDED") throw new Error("Merchant is not suspended");

    const updated = await tx.merchant.update({
      where: { id: merchantId },
      data: {
        status: "APPROVED",
        suspensionReason: null,
      },
      select: {
        id: true,
        status: true,
        updatedAt: true,
      },
    });

    await tx.merchantActivityLog.create({
      data: {
        merchantId,
        type: "MERCHANT_REINSTATED",
        message: "Your merchant account was reinstated.",
      },
    });

    return updated;
  });
}
