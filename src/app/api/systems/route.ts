import { systemService } from "@/modules/systems";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";

// GET /api/systems — authenticated (user's systems)
export async function GET() {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;

  try {
    const systems = await systemService.listSystems(guard.id);
    return jsonResponse({ data: systems });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch systems";
    return errorResponse(message, 500);
  }
}
