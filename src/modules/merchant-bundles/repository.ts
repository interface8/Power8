import { prisma } from "@/lib/prisma";
import type { CreateMerchantBundleInput, UpdateMerchantBundleInput } from "./types";

const withItems = {
  include: { items: { include: { merchantProduct: { select: { id: true, name: true } } } } },
} as const;

export async function findByMerchant(merchantId: string) {
  return prisma.merchantBundle.findMany({
    where: { merchantId },
    orderBy: { createdAt: "desc" },
    ...withItems,
  });
}

export async function findById(id: string) {
  return prisma.merchantBundle.findUnique({ where: { id }, ...withItems });
}

/** Returns which of the given product ids are not owned / not approved. */
export async function checkBundleProducts(merchantId: string, productIds: string[]) {
  const products = await prisma.merchantProduct.findMany({
    where: { id: { in: productIds } },
    select: { id: true, merchantId: true, approvalStatus: true },
  });
  const map = new Map(products.map((p) => [p.id, p]));
  const notOwned: string[] = [];
  const notApproved: string[] = [];
  for (const id of productIds) {
    const p = map.get(id);
    if (!p || p.merchantId !== merchantId) notOwned.push(id);
    else if (p.approvalStatus !== "APPROVED") notApproved.push(id);
  }
  return { notOwned, notApproved };
}

export async function create(merchantId: string, input: CreateMerchantBundleInput) {
  return prisma.merchantBundle.create({
    data: {
      merchantId,
      name: input.name,
      totalPrice: input.totalPrice,
      systemCapacityKw: input.systemCapacityKw,
      description: input.description,
      approvalStatus: "PENDING",
      items: { create: input.items.map((i) => ({ merchantProductId: i.merchantProductId, quantity: i.quantity })) },
    },
    ...withItems,
  });
}

export async function update(id: string, input: UpdateMerchantBundleInput) {
  return prisma.$transaction(async (tx) => {
    if (input.items !== undefined) {
      await tx.merchantBundleItem.deleteMany({ where: { bundleId: id } });
    }
    return tx.merchantBundle.update({
      where: { id },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.totalPrice !== undefined ? { totalPrice: input.totalPrice } : {}),
        ...(input.systemCapacityKw !== undefined ? { systemCapacityKw: input.systemCapacityKw } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        approvalStatus: "PENDING",
        ...(input.items !== undefined
          ? { items: { create: input.items.map((i) => ({ merchantProductId: i.merchantProductId, quantity: i.quantity })) } }
          : {}),
      },
      ...withItems,
    });
  });
}

export async function deactivate(id: string) {
  return prisma.merchantBundle.update({ where: { id }, data: { isActive: false }, ...withItems });
}
