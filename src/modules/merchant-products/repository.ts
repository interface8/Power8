import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type {
  CreateMerchantProductInput,
  UpdateMerchantProductInput,
  ListMerchantProductsFilters,
} from "./types";

const MARKETPLACE_COMPANY_NAME = "Marketplace Merchants";

async function getMarketplaceCompanyId(tx: Prisma.TransactionClient) {
  const existing = await tx.company.findFirst({
    where: { name: MARKETPLACE_COMPANY_NAME },
    select: { id: true },
  });

  if (existing) return existing.id;

  const created = await tx.company.create({
    data: {
      name: MARKETPLACE_COMPANY_NAME,
      description: "Approved products sold by marketplace merchants",
      address: "Marketplace",
      contactNumber: "N/A",
    },
    select: { id: true },
  });

  return created.id;
}

export async function categoryExists(id: string) {
  return (await prisma.productCategory.count({ where: { id } })) > 0;
}

export async function findByMerchant(merchantId: string, filters: ListMerchantProductsFilters) {
  const { approvalStatus, isActive, page, limit } = filters;

  const where: Prisma.MerchantProductWhereInput = { merchantId };
  if (approvalStatus) where.approvalStatus = approvalStatus;
  if (isActive !== undefined) where.isActive = isActive;

  const [total, data] = await Promise.all([
    prisma.merchantProduct.count({ where }),
    prisma.merchantProduct.findMany({
      where,
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function findById(id: string) {
  return prisma.merchantProduct.findUnique({ where: { id } });
}

export async function findByIdWithCatalogProduct(id: string) {
  return prisma.merchantProduct.findUnique({
    where: { id },
    select: {
      id: true,
      merchantId: true,
      name: true,
      description: true,
      categoryId: true,
      price: true,
      warranty: true,
      capacity: true,
      stockQuantity: true,
      approvalStatus: true,
      rejectionReason: true,
      isActive: true,
      images: true,
      product: {
        select: {
          id: true,
        },
      },
      merchant: {
        select: {
          businessName: true,
        },
      },
    },
  });
}

export async function create(merchantId: string, input: CreateMerchantProductInput) {
  return prisma.merchantProduct.create({
    data: { merchantId, ...input, approvalStatus: "PENDING" },
  });
}

export async function update(id: string, input: UpdateMerchantProductInput) {
  return prisma.$transaction(async (tx) => {
    const updated = await tx.merchantProduct.update({
      where: { id },
      data: { ...input, approvalStatus: "PENDING", rejectionReason: null },
    });

    await tx.product.updateMany({
      where: { merchantProductId: id },
      data: { isActive: false },
    });

    return updated;
  });
}

export async function updateStock(id: string, stockQuantity: number) {
  return prisma.$transaction(async (tx) => {
    const updated = await tx.merchantProduct.update({
      where: { id },
      data: { stockQuantity },
    });

    await tx.product.updateMany({
      where: { merchantProductId: id },
      data: { stockQuantity },
    });

    return updated;
  });
}

export async function deactivate(id: string) {
  return prisma.$transaction(async (tx) => {
    const updated = await tx.merchantProduct.update({
      where: { id },
      data: { isActive: false },
    });

    await tx.product.updateMany({
      where: { merchantProductId: id },
      data: { isActive: false },
    });

    return updated;
  });
}

export async function approveAndPublish(id: string) {
  return prisma.$transaction(async (tx) => {
    const merchantProduct = await tx.merchantProduct.findUnique({
      where: { id },
      select: {
        id: true,
        merchantId: true,
        name: true,
        description: true,
        categoryId: true,
        price: true,
        warranty: true,
        capacity: true,
        stockQuantity: true,
        images: true,
      },
    });

    if (!merchantProduct) {
      throw new Error("Product not found");
    }

    const marketplaceCompanyId = await getMarketplaceCompanyId(tx);

    await tx.product.upsert({
      where: { merchantProductId: id },
      create: {
        merchantProductId: id,
        name: merchantProduct.name,
        description: merchantProduct.description,
        categoryId: merchantProduct.categoryId,
        companyId: marketplaceCompanyId,
        price: merchantProduct.price,
        warranty: merchantProduct.warranty,
        capacity: merchantProduct.capacity,
        imageUrls: merchantProduct.images,
        stockQuantity: merchantProduct.stockQuantity,
        isActive: true,
      },
      update: {
        name: merchantProduct.name,
        description: merchantProduct.description,
        categoryId: merchantProduct.categoryId,
        companyId: marketplaceCompanyId,
        price: merchantProduct.price,
        warranty: merchantProduct.warranty,
        capacity: merchantProduct.capacity,
        imageUrls: merchantProduct.images,
        stockQuantity: merchantProduct.stockQuantity,
        isActive: true,
      },
    });

    return tx.merchantProduct.update({
      where: { id },
      data: {
        approvalStatus: "APPROVED",
        rejectionReason: null,
        isActive: true,
      },
    });
  });
}

export async function setApprovalStatus(
  id: string,
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED",
  rejectionReason: string | null = null,
) {
  return prisma.$transaction(async (tx) => {
    const updated = await tx.merchantProduct.update({
      where: { id },
      data: {
        approvalStatus,
        rejectionReason,
        isActive: approvalStatus !== "REJECTED",
      },
    });

    if (approvalStatus !== "APPROVED") {
      await tx.product.updateMany({
        where: { merchantProductId: id },
        data: { isActive: false },
      });
    }

    return updated;
  });
}
