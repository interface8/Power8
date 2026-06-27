import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type {
  AdminPendingMerchantProductsDto,
  AdminPendingMerchantProductsFilters,
} from "./types";

export async function findPendingProducts(
  filters: AdminPendingMerchantProductsFilters,
): Promise<AdminPendingMerchantProductsDto> {
  const { merchantId, startDate, endDate, page, limit } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.MerchantProductWhereInput = {
    approvalStatus: "PENDING",
  };

  if (merchantId) where.merchantId = merchantId;
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = startDate;
    if (endDate) where.createdAt.lte = endDate;
  }

  const [total, rows] = await Promise.all([
    prisma.merchantProduct.count({ where }),
    prisma.merchantProduct.findMany({
      where,
      skip,
      take: limit,
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
      description: row.description,
      category: row.category,
      price: row.price.toNumber(),
      warranty: row.warranty,
      capacity: row.capacity,
      stockQuantity: row.stockQuantity,
      approvalStatus: row.approvalStatus,
      rejectionReason: row.rejectionReason,
      isActive: row.isActive,
      images: row.images,
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
