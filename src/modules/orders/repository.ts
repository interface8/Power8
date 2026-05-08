import { prisma } from "@/lib/prisma";
import type { OrderDto, OrderItemDto, CreateOrderInput } from "./types";

const orderWithItems = {
  include: {
    items: {
      include: {
        product: { select: { name: true } },
        bundle: { select: { name: true } },
      },
    },
  },
} as const;

function toOrderDto(order: {
  id: string;
  userId: string;
  totalAmount: { toNumber: () => number };
  paymentType: string;
  status: string;
  items: {
    id: string;
    itemType: string;
    productId: string | null;
    product: { name: string } | null;
    bundleId: string | null;
    bundle: { name: string } | null;
    quantity: number;
    unitPrice: { toNumber: () => number };
    totalPrice: { toNumber: () => number };
  }[];
  createdAt: Date;
  updatedAt: Date;
}): OrderDto {
  return {
    id: order.id,
    userId: order.userId,
    totalAmount: order.totalAmount.toNumber(),
    paymentType: order.paymentType as OrderDto["paymentType"],
    status: order.status as OrderDto["status"],
    items: order.items.map(
      (item): OrderItemDto => ({
        id: item.id,
        itemType: item.itemType as OrderItemDto["itemType"],
        productId: item.productId,
        productName: item.product?.name ?? null,
        bundleId: item.bundleId,
        bundleName: item.bundle?.name ?? null,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toNumber(),
        totalPrice: item.totalPrice.toNumber(),
      }),
    ),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

export async function findOrdersByUser(userId: string): Promise<OrderDto[]> {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    ...orderWithItems,
  });
  return orders.map(toOrderDto);
}

export async function findOrderById(id: string): Promise<OrderDto | null> {
  const order = await prisma.order.findUnique({
    where: { id },
    ...orderWithItems,
  });
  return order ? toOrderDto(order) : null;
}

export async function createOrder(userId: string, input: CreateOrderInput): Promise<OrderDto> {
  // Batch fetch all products and bundles in two queries
  const productIds = input.items
    .filter((i) => i.itemType === "PRODUCT" && i.productId)
    .map((i) => i.productId!);
  const bundleIds = input.items
    .filter((i) => i.itemType === "BUNDLE" && i.bundleId)
    .map((i) => i.bundleId!);

  const [products, bundles] = await Promise.all([
    productIds.length > 0
      ? prisma.product.findMany({ where: { id: { in: productIds } } })
      : [],
    bundleIds.length > 0
      ? prisma.productBundle.findMany({ where: { id: { in: bundleIds } } })
      : [],
  ]);

  const productMap = new Map(products.map((p) => [p.id, p.price.toNumber()]));
  const bundleMap = new Map(bundles.map((b) => [b.id, b.totalPrice.toNumber()]));

  // Compute prices in-memory
  const itemsWithPrices = input.items.map((item) => {
    let unitPrice = 0;

    if (item.itemType === "PRODUCT" && item.productId) {
      unitPrice = productMap.get(item.productId) ?? 0;
      if (!productMap.has(item.productId)) throw new Error(`Product not found: ${item.productId}`);
    }

    if (item.itemType === "BUNDLE" && item.bundleId) {
      unitPrice = bundleMap.get(item.bundleId) ?? 0;
      if (!bundleMap.has(item.bundleId)) throw new Error(`Bundle not found: ${item.bundleId}`);
    }

    return {
      itemType: item.itemType,
      productId: item.productId ?? null,
      bundleId: item.bundleId ?? null,
      quantity: item.quantity,
      unitPrice,
      totalPrice: unitPrice * item.quantity,
    };
  });

  const totalAmount = itemsWithPrices.reduce((sum, item) => sum + item.totalPrice, 0);

  const order = await prisma.order.create({
    data: {
      userId,
      totalAmount,
      paymentType: input.paymentType,
      items: {
        create: itemsWithPrices,
      },
    },
    ...orderWithItems,
  });

  return toOrderDto(order);
}
