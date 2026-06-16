import { prisma } from "@/lib/prisma";
import type { CartDto, AddToCartInput } from "./types";

const cartWithItems = {
  include: {
    items: {
      include: {
        product: true,
        bundle: true,
      },
    },
  },
} as const;

function toCartDto(cart: {
  id: string;
  userId: string;
  items: Array<{
    id: string;
    itemType: string;
    productId: string | null;
    bundleId: string | null;
    quantity: number;
    product: {
      name: string;
      imageUrls: string[];
      price: { toNumber: () => number };
    } | null;
    bundle: {
      name: string;
      totalPrice: { toNumber: () => number };
    } | null;
  }>;
}): CartDto {
  const items = cart.items.map((item) => {
    const price = item.product
      ? item.product.price.toNumber()
      : item.bundle
        ? item.bundle.totalPrice.toNumber()
        : 0;

    return {
      id: item.id,
      itemType: item.itemType as "PRODUCT" | "BUNDLE",
      productId: item.productId,
      productName: item.product?.name ?? null,
      productImage: item.product?.imageUrls[0] ?? null,
      bundleId: item.bundleId,
      bundleName: item.bundle?.name ?? null,
      price,
      quantity: item.quantity,
      subtotal: price * item.quantity,
    };
  });

  return {
    cartId: cart.id,
    userId: cart.userId,
    items,
    total: items.reduce((sum, item) => sum + item.subtotal, 0),
  };
}

export async function findCartByUserId(userId: string): Promise<CartDto | null> {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    ...cartWithItems,
  });
  return cart ? toCartDto(cart) : null;
}

export async function upsertCartItem(
  userId: string,
  input: AddToCartInput,
): Promise<CartDto> {
  const cart = await prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });

  if (input.itemType === "PRODUCT" && input.productId) {
    await prisma.cartItem.upsert({
      where: {
        cartId_productId: { cartId: cart.id, productId: input.productId },
      },
      create: {
        cartId: cart.id,
        itemType: "PRODUCT",
        productId: input.productId,
        quantity: input.quantity,
      },
      update: { quantity: input.quantity },
    });
  } else if (input.itemType === "BUNDLE" && input.bundleId) {
    await prisma.cartItem.upsert({
      where: {
        cartId_bundleId: { cartId: cart.id, bundleId: input.bundleId },
      },
      create: {
        cartId: cart.id,
        itemType: "BUNDLE",
        bundleId: input.bundleId,
        quantity: input.quantity,
      },
      update: { quantity: input.quantity },
    });
  }

  const updatedCart = await prisma.cart.findUnique({
    where: { userId },
    ...cartWithItems,
  });

  return toCartDto(updatedCart!);
}

export async function updateCartItem(
  itemId: string,
  quantity: number,
): Promise<CartDto | null> {
  const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
  if (!item) return null;

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });

  const cart = await prisma.cart.findUnique({
    where: { id: item.cartId },
    ...cartWithItems,
  });

  return cart ? toCartDto(cart) : null;
}

export async function deleteCartItem(
  itemId: string,
): Promise<CartDto | null> {
  const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
  if (!item) return null;

  const cartId = item.cartId;

  await prisma.cartItem.delete({ where: { id: itemId } });

  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    ...cartWithItems,
  });

  return cart ? toCartDto(cart) : null;
}