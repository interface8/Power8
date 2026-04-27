import { NextRequest } from "next/server";
import { creditService } from "@/modules/credit";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";

// GET /api/credit/schedule/:creditId — authenticated
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ creditId: string }> },
) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;

  try {
    const { creditId } = await params;
    const schedules = await creditService.getCreditSchedule(creditId, guard.id);
    return jsonResponse({ data: schedules });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Credit not found") return errorResponse("Credit not found", 404);
      if (error.message === "Order not found") return errorResponse("Order not found", 404);
    }
    return errorResponse("Internal server error", 500);
  }
}
