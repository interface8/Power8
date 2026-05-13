import { adminStatsService } from "@/modules/admin-stats";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";

// GET /api/admin/stats  (admin-only)
export async function GET(request: Request) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;

  if (!guard.roles.includes("admin")) {
    return errorResponse("Forbidden", 403);
  }

  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("lowStockThreshold");
  const lowStockThreshold = raw !== null && Number.isFinite(Number(raw)) ? Number(raw) : 5;

  try {
    const stats = await adminStatsService.getStats({ lowStockThreshold });
    return jsonResponse({ data: stats });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch admin stats";
    return errorResponse(message, 500);
  }
}