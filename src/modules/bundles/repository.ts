import { prisma } from "@/lib/prisma";
import type { BundleDto, BundleItemDto, CreateBundleInput, UpdateBundleInput } from "./types";

const bundleWithItems = {
  include: {
    items: {
      include: {
        product: { select: { name: true, price: true } },
      },
    },
  },
} as const;

function toBundleDto(bundle: {
  id: string;
  name: string;
  totalPrice: { toNumber: () => number };
  systemCapacityKw: { toNumber: () => number } | null;
  items: {
    id: string;
    productId: string;
    product: { name: string; price: { toNumber: () => number } };
    quantity: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}): BundleDto {
  return {
    id: bundle.id,
    name: bundle.name,
    totalPrice: bundle.totalPrice.toNumber(),
    systemCapacityKw: bundle.systemCapacityKw?.toNumber() ?? null,
    items: bundle.items.map(
      (item): BundleItemDto => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price.toNumber(),
      }),
    ),
    createdAt: bundle.createdAt,
    updatedAt: bundle.updatedAt,
  };
}

export async function findBundles(): Promise<BundleDto[]> {
  const bundles = await prisma.productBundle.findMany({
    orderBy: { createdAt: "desc" },
    ...bundleWithItems,
  });
  return bundles.map(toBundleDto);
}

export async function findBundleById(id: string): Promise<BundleDto | null> {
  const bundle = await prisma.productBundle.findUnique({
    where: { id },
    ...bundleWithItems,
  });
  return bundle ? toBundleDto(bundle) : null;
}

export async function createBundle(input: CreateBundleInput): Promise<BundleDto> {
  const bundle = await prisma.productBundle.create({
    data: {
      name: input.name,
      totalPrice: input.totalPrice,
      systemCapacityKw: input.systemCapacityKw,
      items: {
        create: input.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      },
    },
    ...bundleWithItems,
  });
  return toBundleDto(bundle);
}

export async function updateBundle(id: string, input: UpdateBundleInput): Promise<BundleDto> {
  const bundle = await prisma.$transaction(async (tx) => {
    // If items are provided, delete old ones and create new ones
    if (input.items) {
      await tx.bundleItem.deleteMany({ where: { bundleId: id } });
    }

    return tx.productBundle.update({
      where: { id },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.totalPrice !== undefined ? { totalPrice: input.totalPrice } : {}),
        ...(input.systemCapacityKw !== undefined ? { systemCapacityKw: input.systemCapacityKw } : {}),
        ...(input.items
          ? {
              items: {
                create: input.items.map((item) => ({
                  productId: item.productId,
                  quantity: item.quantity,
                })),
              },
            }
          : {}),
      },
      ...bundleWithItems,
    });
  });
  return toBundleDto(bundle);
}

export async function bundleExists(id: string): Promise<boolean> {
  const count = await prisma.productBundle.count({ where: { id } });
  return count > 0;
}

export async function findBundleByName(name: string): Promise<BundleDto | null> {
  const bundle = await prisma.productBundle.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
    ...bundleWithItems,
  });
  return bundle ? toBundleDto(bundle) : null;
}
