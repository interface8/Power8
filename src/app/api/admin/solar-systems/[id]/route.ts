import { requireApiPermissionFor, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { adminSolarSystemsService } from "@/modules/admin-solar-systems";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireApiPermissionFor("solar_systems", "view_detail");
  if (isErrorResponse(guard)) return guard;

  try {
    const { id } = await params;
    const data = await adminSolarSystemsService.getSolarSystemById(id);
    return jsonResponse({ data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch solar system";
    if (message === "System not found") return errorResponse(message, 404);
    return errorResponse(message, 500);
  }
}
