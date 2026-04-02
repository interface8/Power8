import { NextRequest } from "next/server";
import { systemService } from "@/modules/systems";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";

// GET /api/systems/:id — authenticated
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;

  try {
    const { id } = await params;
    const system = await systemService.getSystemById(id, guard.id);
    return jsonResponse({ data: system });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "System not found") {
      return errorResponse("System not found", 404);
    }
    return errorResponse("Internal server error", 500);
  }
}
