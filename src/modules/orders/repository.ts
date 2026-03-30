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
  // Look up prices for each item
  const itemsWithPrices = await Promise.all(
    input.items.map(async (item) => {
      let unitPrice = 0;

      if (item.itemType === "PRODUCT" && item.productId) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        if (!product) throw new Error(`Product not found: ${item.productId}`);
        unitPrice = product.price.toNumber();
      }

      if (item.itemType === "BUNDLE" && item.bundleId) {
        const bundle = await prisma.productBundle.findUnique({
          where: { id: item.bundleId },
        });
        if (!bundle) throw new Error(`Bundle not found: ${item.bundleId}`);
        unitPrice = bundle.totalPrice.toNumber();
      }

      return {
        itemType: item.itemType,
        productId: item.productId ?? null,
        bundleId: item.bundleId ?? null,
        quantity: item.quantity,
        unitPrice,
        totalPrice: unitPrice * item.quantity,
      };
    }),
  );

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
