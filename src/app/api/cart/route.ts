import { NextRequest } from "next/server";
import { cartService, addToCartSchema } from "@/modules/carts";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";

// GET /api/cart — get current user's cart
export async function GET() {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;

  try {
    const cart = await cartService.getCart(guard.id);
    return jsonResponse({ data: cart });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch cart";
    return errorResponse(message, 500);
  }
}

// POST /api/cart — add item to cart
export async function POST(request: NextRequest) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;

  try {
    const body = await request.json();
    const parsed = addToCartSchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        Object.values(parsed.error.flatten().fieldErrors).flat()[0] ?? "Validation failed";
      return Response.json({ message: firstError }, { status: 400 });
    }

    const cart = await cartService.addToCart(guard.id, parsed.data);
    return jsonResponse({ data: cart }, 201);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Product not found") return errorResponse("Product not found", 404);
      if (error.message === "Product is out of stock") return errorResponse("Product is out of stock", 400);
      if (error.message.startsWith("Only")) return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}
