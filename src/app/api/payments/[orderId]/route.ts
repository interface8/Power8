import { NextRequest } from "next/server";
import { paymentService } from "@/modules/payments";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";

// GET /api/payments/:orderId — authenticated
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;

  try {
    const { orderId } = await params;
    const payments = await paymentService.getPaymentsByOrderId(orderId, guard.id);
    return jsonResponse({ data: payments });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Order not found") {
      return errorResponse("Order not found", 404);
    }
    return errorResponse("Internal server error", 500);
  }
}
