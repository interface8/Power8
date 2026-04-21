import { NextRequest } from "next/server";
import { orderService } from "@/modules/orders";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";

// GET /api/orders/:id — authenticated
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;

  try {
    const { id } = await params;
    const order = await orderService.getOrderById(id, guard.id);
    return jsonResponse({ data: order });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Order not found") {
      return errorResponse("Order not found", 404);
    }
    return errorResponse("Internal server error", 500);
  }
}
