import { NextRequest } from "next/server";
import { solarCalculationsService } from "@/modules/solar-calculations";
import { jsonResponse, errorResponse } from "@/lib/http";

// GET /api/solar-calculations/[id] — get a single calculation
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const calculation = await solarCalculationsService.getById(id);

    if (!calculation) {
      return errorResponse("Calculation not found", 404);
    }

    return jsonResponse({ data: calculation });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch calculation";
    return errorResponse(message, 500);
  }
}
