import * as orderRepo from "./repository";
import type { CreateOrderInput } from "./types";
import { prisma } from "@/lib/prisma";
import { merchantActivityService } from "@/modules/merchant-activity";

export async function listOrders(userId: string) {
  return orderRepo.findOrdersByUser(userId);
}

export async function getOrderById(id: string, userId: string) {
  const order = await orderRepo.findOrderById(id);
  if (!order) throw new Error("Order not found");
  if (order.userId !== userId) throw new Error("Order not found");
  return order;
}

export async function createOrder(userId: string, input: CreateOrderInput) {
  const order = await orderRepo.createOrder(userId, input);

  const withMerchants = await prisma.order.findUnique({
    where: { id: order.id },
    select: {
      id: true,
      items: {
        select: {
          quantity: true,
          product: {
            select: {
              merchantProduct: {
                select: {
                  merchantId: true,
                },
              },
            },
          },
          bundle: {
            select: {
              merchantBundle: {
                select: {
                  merchantId: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (withMerchants) {
    const merchantCounts = new Map<string, number>();

    for (const item of withMerchants.items) {
      const merchantId =
        item.product?.merchantProduct?.merchantId ??
        item.bundle?.merchantBundle?.merchantId ??
        null;

      if (!merchantId) continue;

      merchantCounts.set(
        merchantId,
        (merchantCounts.get(merchantId) ?? 0) + item.quantity,
      );
    }

    if (merchantCounts.size > 0) {
      await merchantActivityService.recordMerchantActivities(
        Array.from(merchantCounts.entries()).map(([merchantId, quantity]) => ({
          merchantId,
          type: "NEW_ORDER",
          message: `New order ${order.id} contains ${quantity} of your item(s).`,
        })),
      );
    }
  }

  return order;
}
