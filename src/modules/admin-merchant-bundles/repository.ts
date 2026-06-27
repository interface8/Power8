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
      },
    });

    if (!bundle) throw new Error("Bundle not found");

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
            ? `Bundle "${bundle.name}" approved.`
            : `Bundle "${bundle.name}" rejected.${rejectionReason ? ` Reason: ${rejectionReason}` : ""}`,
      },
    });

    return updated;
  });
}
