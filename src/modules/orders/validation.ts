import { z } from "zod";

const orderItemSchema = z.object({
  itemType: z.enum(["PRODUCT", "BUNDLE"]),
  productId: z.string().min(1).optional(),
  bundleId: z.string().min(1).optional(),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
}).refine(
  (item) => {
    if (item.itemType === "PRODUCT") return !!item.productId;
    if (item.itemType === "BUNDLE") return !!item.bundleId;
    return false;
  },
  { message: "Product items require productId, bundle items require bundleId" },
);

export const createOrderSchema = z.object({
  paymentType: z.enum(["FULL", "CREDIT"]),
  items: z.array(orderItemSchema).min(1, "Order must have at least one item"),
});
