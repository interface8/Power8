import { NextRequest } from "next/server";
import { creditService } from "@/modules/credit";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";

// GET /api/credit/:orderId — authenticated
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;

  try {
    const { orderId } = await params;
    const credit = await creditService.getCreditByOrderId(orderId, guard.id);
    return jsonResponse({ data: credit });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Order not found") return errorResponse("Order not found", 404);
      if (error.message === "Credit not found") return errorResponse("Credit not found", 404);
    }
    return errorResponse("Internal server error", 500);
  }
}
