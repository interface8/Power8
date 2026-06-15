import { NextRequest } from "next/server";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { blogService } from "@/modules/blogs";

// PATCH /api/admin/blogs/:id/publish
export async function PATCH(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;
  if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);

  try {
    const data = await blogService.publishBlog(params.id);
    return jsonResponse({ data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to publish blog";
    if (message === "Blog not found") return errorResponse(message, 404);
    return errorResponse(message, 500);
  }
}