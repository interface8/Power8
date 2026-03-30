import * as orderRepo from "./repository";
import type { CreateOrderInput } from "./types";

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
  return orderRepo.createOrder(userId, input);
}
