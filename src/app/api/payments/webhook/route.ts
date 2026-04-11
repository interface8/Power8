import { NextRequest } from "next/server";
import { paymentService } from "@/modules/payments";
import { jsonResponse, errorResponse } from "@/lib/http";

// POST /api/payments/webhook — NO auth (called by payment provider)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const reference = body.reference || body.data?.reference;

    if (!reference) {
      return errorResponse("Reference is required", 400);
    }

    const payment = await paymentService.handleWebhook(reference);
    return jsonResponse({ data: payment });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Payment not found") return errorResponse("Payment not found", 404);
      if (error.message === "Payment already processed") return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}
