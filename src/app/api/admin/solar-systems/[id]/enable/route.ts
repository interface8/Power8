import { requireApiPermissionFor, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { adminSolarSystemsService } from "@/modules/admin-solar-systems";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireApiPermissionFor("solar_systems", "enable");
  if (isErrorResponse(guard)) return guard;

  try {
    const { id } = await params;
    const data = await adminSolarSystemsService.enableSolarSystem(id, guard.id);
    return jsonResponse({ data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to enable solar system";
    if (message === "System not found") return errorResponse(message, 404);
    if (message === "System is already enabled") return errorResponse(message, 400);
    return errorResponse(message, 500);
  }
}