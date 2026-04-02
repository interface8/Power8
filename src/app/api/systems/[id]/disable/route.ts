import { NextRequest } from "next/server";
import { systemService } from "@/modules/systems";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";

// POST /api/systems/:id/disable — admin
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;

  try {
    const { id } = await params;
    const system = await systemService.disableSystem(id);
    return jsonResponse({ data: system });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "System not found") return errorResponse("System not found", 404);
      if (error.message === "System is already disabled") return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}
