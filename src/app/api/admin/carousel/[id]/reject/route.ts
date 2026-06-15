import { NextRequest } from "next/server";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { carouselService } from "@/modules/carousel";

// PATCH /api/admin/carousel/:id/reject
export async function PATCH(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;
  if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);

  try {
    const data = await carouselService.rejectSlide(params.id);
    return jsonResponse({ data });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to reject carousel slide";
    if (message === "Carousel slide not found") return errorResponse(message, 404);
    return errorResponse(message, 500);
  }
}