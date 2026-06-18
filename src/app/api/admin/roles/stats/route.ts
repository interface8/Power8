import { requireApiPermissionFor, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { roleService } from "@/modules/roles";

// GET /api/admin/roles/stats
export async function GET() {
  const guard = await requireApiPermissionFor("roles", "view");
  if (isErrorResponse(guard)) return guard;

  try {
    const data = await roleService.getRoleStatsAdmin();
    return jsonResponse({ data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch role stats";
    return errorResponse(message, 500);
  }
}
