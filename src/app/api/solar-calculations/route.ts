import { NextRequest } from "next/server";
import { solarCalculationsService, createSolarCalculationSchema } from "@/modules/solar-calculations";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";

// POST /api/solar-calculations — save a calculation
export async function POST(request: NextRequest) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;

  try {
    const body = await request.json();
    const parsed = createSolarCalculationSchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        Object.values(parsed.error.flatten().fieldErrors).flat()[0] ?? "Validation failed";
      return errorResponse(firstError, 400);
    }

    const calculation = await solarCalculationsService.saveCalculation(
      parsed.data,
      guard.id,
    );
    return jsonResponse({ data: calculation }, 201);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save calculation";
    return errorResponse(message, 500);
  }
}

// GET /api/solar-calculations — list current user's calculations
export async function GET() {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;

  try {
    const calculations = await solarCalculationsService.listByUser(guard.id);
    return jsonResponse({ data: calculations });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch calculations";
    return errorResponse(message, 500);
  }
}
