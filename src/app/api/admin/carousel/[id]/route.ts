import { NextRequest } from "next/server";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { carouselService, updateCarouselSlideSchema } from "@/modules/carousel";

function getFirstErrorMessage(error: {
  flatten: () => { fieldErrors: Record<string, string[]> };
}) {
  return Object.values(error.flatten().fieldErrors).flat()[0] ?? "Validation failed";
}

// PATCH /api/admin/carousel/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;
  if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);

  try {
    const body = await request.json();
    const parsed = updateCarouselSlideSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(getFirstErrorMessage(parsed.error), 400);
    }

    const data = await carouselService.updateSlide(params.id, parsed.data);
    return jsonResponse({ data });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update carousel slide";
    if (message === "Carousel slide not found") return errorResponse(message, 404);
    return errorResponse(message, 500);
  }
}

// DELETE /api/admin/carousel/:id
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;
  if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);

  try {
    await carouselService.deleteSlide(params.id);
    return jsonResponse({ message: "Carousel slide deleted" });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete carousel slide";
    if (message === "Carousel slide not found") return errorResponse(message, 404);
    return errorResponse(message, 500);
  }
}