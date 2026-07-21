import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type {
  AdminPendingMerchantBundlesDto,
  AdminPendingMerchantBundlesFilters,
} from "./types";

export async function findPendingBundles(
  filters: AdminPendingMerchantBundlesFilters,
): Promise<AdminPendingMerchantBundlesDto> {
  const { merchantId, startDate, endDate, page, limit } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.MerchantBundleWhereInput = {
    approvalStatus: "PENDING",
  };

  if (merchantId) where.merchantId = merchantId;
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = startDate;
    if (endDate) where.createdAt.lte = endDate;
  }

  const [total, rows] = await Promise.all([
    prisma.merchantBundle.count({ where }),
    prisma.merchantBundle.findMany({
      where,
      skip,
      take: limit,
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
        merchant: {
          select: {
            id: true,
            businessName: true,
            user: {
              select: {
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    }),
  ]);

  return {
    data: rows.map((row) => ({
      id: row.id,
      merchant: {
        id: row.merchant.id,
        businessName: row.merchant.businessName,
        contactName: row.merchant.user.name,
        email: row.merchant.user.email,
        phone: row.merchant.user.phone,
      },
      name: row.name,
      totalPrice: row.totalPrice.toNumber(),
      systemCapacityKw: row.systemCapacityKw?.toNumber() ?? null,
      description: row.description,
      approvalStatus: row.approvalStatus,
      rejectionReason: row.rejectionReason,
      isActive: row.isActive,
      items: row.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        merchantProduct: {
          id: item.merchantProduct.id,
          name: item.merchantProduct.name,
          images: item.merchantProduct.images,
        },
      })),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function findBundleById(id: string) {
  return prisma.merchantBundle.findUnique({
    where: { id },
    select: {
      id: true,
      merchantId: true,
      name: true,
      approvalStatus: true,
      items: {
        select: {
          merchantProductId: true,
          quantity: true,
          merchantProduct: {
            select: {
              product: { select: { id: true } },
            },
          },
        },
      },
    },
  });
}

export async function setBundleApprovalStatus(params: {
  bundleId: string;
  approvalStatus: "APPROVED" | "REJECTED";
  rejectionReason?: string | null;
}) {
  const { bundleId, approvalStatus, rejectionReason = null } = params;

  return prisma.$transaction(async (tx) => {
    const bundle = await tx.merchantBundle.findUnique({
      where: { id: bundleId },
      select: {
        id: true,
        merchantId: true,
        name: true,
        totalPrice: true,
        systemCapacityKw: true,
        items: {
          select: {
            merchantProductId: true,
            quantity: true,
            merchantProduct: {
              select: {
                product: { select: { id: true } },
              },
            },
          },
        },
      },
    });

    if (!bundle) throw new Error("Bundle not found");

    if (approvalStatus === "APPROVED") {
      // Check every item has a synced Product record
      const unsyncedItems = bundle.items.filter(
        (item) => !item.merchantProduct.product?.id,
      );

      if (unsyncedItems.length > 0) {
        throw new Error(
          `Cannot approve this bundle yet. ${unsyncedItems.length} product(s) in this bundle have not been approved yet. Please approve all products in this bundle before approving the bundle.`,
        );
      }

      const productBundleItems = bundle.items.map((item) => ({
        productId: item.merchantProduct.product!.id,
        quantity: item.quantity,
      }));

      // Check if a ProductBundle already exists linked to this MerchantBundle
      // ProductBundle has merchantBundleId pointing to MerchantBundle
      const existingProductBundle = await tx.productBundle.findUnique({
        where: { merchantBundleId: bundleId },
        select: { id: true },
      });

      if (existingProductBundle) {
        // Already linked — update name/price to stay in sync
        // Also refresh items: delete old ones and recreate
        await tx.bundleItem.deleteMany({
          where: { bundleId: existingProductBundle.id },
        });
        await tx.productBundle.update({
          where: { id: existingProductBundle.id },
          data: {
            name: bundle.name,
            totalPrice: bundle.totalPrice,
            systemCapacityKw: bundle.systemCapacityKw,
            items: {
              create: productBundleItems,
            },
          },
        });
      } else {
        // First approval — create a new ProductBundle linked to this MerchantBundle
        await tx.productBundle.create({
          data: {
            name: bundle.name,
            totalPrice: bundle.totalPrice,
            systemCapacityKw: bundle.systemCapacityKw,
            merchantBundleId: bundleId, // this field IS on ProductBundle
            items: {
              create: productBundleItems,
            },
          },
        });
      }
    }

    if (approvalStatus === "REJECTED") {
      // Unlink the ProductBundle if one exists — don't delete it
      // as it may be referenced in existing orders
      const existingProductBundle = await tx.productBundle.findUnique({
        where: { merchantBundleId: bundleId },
        select: { id: true },
      });
      if (existingProductBundle) {
        await tx.productBundle.update({
          where: { id: existingProductBundle.id },
          data: { merchantBundleId: null },
        });
      }
    }

    const updated = await tx.merchantBundle.update({
      where: { id: bundleId },
      data: {
        approvalStatus,
        rejectionReason,
        isActive: approvalStatus !== "REJECTED",
      },
      select: {
        id: true,
        merchantId: true,
        name: true,
        approvalStatus: true,
        rejectionReason: true,
        isActive: true,
        updatedAt: true,
      },
    });

    await tx.merchantActivityLog.create({
      data: {
        merchantId: bundle.merchantId,
        type: approvalStatus === "APPROVED" ? "BUNDLE_APPROVED" : "BUNDLE_REJECTED",
        message:
          approvalStatus === "APPROVED"
            ? `Your bundle "${bundle.name}" has been approved and is now live on the platform.`
            : `Your bundle "${bundle.name}" was rejected.${rejectionReason ? ` Reason: ${rejectionReason}` : ""}`,
      },
    });

    return updated;
  });
}