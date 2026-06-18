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
  installationAddress: z.string().min(5, "Address is too short"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  items: z.array(orderItemSchema).min(1, "Order must have at least one item"),
  deliveryAddress: z.string().min(5, "Delivery address is too short"),
  deliveryCity: z.string().min(2, "Delivery city is required"),
  deliveryState: z.string().min(2, "Delivery state is required"),
});
