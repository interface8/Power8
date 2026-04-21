import { dashboardService } from "@/modules/dashboard";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";

// GET /api/dashboard/payments — authenticated
export async function GET() {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;

  try {
    const payments = await dashboardService.getPaymentSummary(guard.id);
    return jsonResponse({ data: payments });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch payment summary";
    return errorResponse(message, 500);
  }
}
