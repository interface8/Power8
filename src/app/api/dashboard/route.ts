import { dashboardService } from "@/modules/dashboard";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";

// GET /api/dashboard — authenticated
export async function GET() {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;

  try {
    const overview = await dashboardService.getOverview(guard.id);
    return jsonResponse({ data: overview });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch dashboard";
    return errorResponse(message, 500);
  }
}
