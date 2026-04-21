import { NextRequest } from "next/server";
import { paymentService, initiatePaymentSchema } from "@/modules/payments";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";

// POST /api/payments/initiate — authenticated
export async function POST(request: NextRequest) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;

  try {
    const body = await request.json();
    const parsed = initiatePaymentSchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        Object.values(parsed.error.flatten().fieldErrors).flat()[0] ??
        "Validation failed";
      return Response.json({ message: firstError }, { status: 400 });
    }

    const result = await paymentService.initiatePayment(guard.id, parsed.data);
    return jsonResponse(result, 201);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Order not found") {
      return errorResponse("Order not found", 404);
    }
    return errorResponse("Internal server error", 500);
  }
}
