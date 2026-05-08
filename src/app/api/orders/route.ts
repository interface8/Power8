import { NextRequest } from "next/server";
import { orderService, createOrderSchema } from "@/modules/orders";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";

// GET /api/orders — authenticated (user's orders)
export async function GET() {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;

  try {
    const orders = await orderService.listOrders(guard.id);
    return jsonResponse({ data: orders });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch orders";
    return errorResponse(message, 500);
  }
}

// POST /api/orders — authenticated
export async function POST(request: NextRequest) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;

  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        Object.values(parsed.error.flatten().fieldErrors).flat()[0] ??
        "Validation failed";
      return Response.json({ message: firstError }, { status: 400 });
    }

    const order = await orderService.createOrder(guard.id, parsed.data);
    return jsonResponse(order, 201);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create order";
    return errorResponse(message, 500);
  }
}
