import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type {
  CreateMerchantProductInput,
  UpdateMerchantProductInput,
  ListMerchantProductsFilters,
} from "./types";

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

export async function create(merchantId: string, input: CreateMerchantProductInput) {
  return prisma.merchantProduct.create({
    data: { merchantId, ...input, approvalStatus: "PENDING" },
  });
}

export async function update(id: string, input: UpdateMerchantProductInput) {
  return prisma.merchantProduct.update({
    where: { id },
    data: { ...input, approvalStatus: "PENDING" },
  });
}

export async function updateStock(id: string, stockQuantity: number) {
  return prisma.merchantProduct.update({ where: { id }, data: { stockQuantity } });
}

export async function deactivate(id: string) {
  return prisma.merchantProduct.update({ where: { id }, data: { isActive: false } });
}
