import * as cartRepo from "./repository";
import { productRepository } from "@/modules/products";
import type { AddToCartInput, UpdateCartItemInput } from "./types";

export async function getCart(userId: string) {
  const cart = await cartRepo.findCartByUserId(userId);
  if (!cart) return { cartId: null, userId, items: [], total: 0 };
  return cart;
}

export async function addToCart(userId: string, input: AddToCartInput) {
  if (input.itemType === "PRODUCT") {
    if (!input.productId) throw new Error("productId is required for PRODUCT items");

    const product = await productRepository.findProductById(input.productId);
    if (!product) throw new Error("Product not found");
    if (product.stockQuantity === 0) throw new Error("Product is out of stock");
    if (input.quantity > product.stockQuantity) {
      throw new Error(`Only ${product.stockQuantity} items available in stock`);
    }
  } else if (input.itemType === "BUNDLE") {
    if (!input.bundleId) throw new Error("bundleId is required for BUNDLE items");
  }

  return cartRepo.upsertCartItem(userId, input);
}

export async function updateCartItem(
  userId: string,
  itemId: string,
  input: UpdateCartItemInput,
) {
  const cart = await cartRepo.findCartByUserId(userId);
  if (!cart) throw new Error("Cart not found");

  const item = cart.items.find((i) => i.id === itemId);
  if (!item) throw new Error("Cart item not found");

  // Only validate stock for products, not bundles
  if (item.itemType === "PRODUCT" && item.productId) {
    const product = await productRepository.findProductById(item.productId);
    if (!product) throw new Error("Product not found");
    if (input.quantity > product.stockQuantity) {
      throw new Error(`Only ${product.stockQuantity} items available in stock`);
    }
  }

  const updated = await cartRepo.updateCartItem(itemId, input.quantity);
  if (!updated) throw new Error("Cart item not found");
  return updated;
}

export async function removeCartItem(userId: string, itemId: string) {
  const cart = await cartRepo.findCartByUserId(userId);
  if (!cart) throw new Error("Cart not found");

  const item = cart.items.find((i) => i.id === itemId);
  if (!item) throw new Error("Cart item not found");

  const updated = await cartRepo.deleteCartItem(itemId);
  if (!updated) throw new Error("Cart item not found");
  return updated;
}