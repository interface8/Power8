import { NextRequest } from "next/server";
import { creditService, applyCreditSchema } from "@/modules/credit";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";

// POST /api/credit/apply — authenticated
export async function POST(request: NextRequest) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;

  try {
    const body = await request.json();
    const parsed = applyCreditSchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        Object.values(parsed.error.flatten().fieldErrors).flat()[0] ??
        "Validation failed";
      return Response.json({ message: firstError }, { status: 400 });
    }

    const credit = await creditService.applyCredit(guard.id, parsed.data);
    return jsonResponse(credit, 201);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Order not found") return errorResponse("Order not found", 404);
      if (error.message === "Order is not a credit order") return errorResponse(error.message, 400);
      if (error.message === "Credit already exists for this order") return errorResponse(error.message, 409);
    }
    return errorResponse("Internal server error", 500);
  }
}
