import { NextRequest } from "next/server";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { blogService } from "@/modules/blogs";

export async function GET(request: NextRequest) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;
  if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug")?.trim();
  const excludeId = searchParams.get("excludeId")?.trim() || undefined;

  if (!slug) {
    return errorResponse("Slug is required", 400);
  }

  try {
    const data = await blogService.checkBlogSlugAvailability(slug, excludeId);
    return jsonResponse(data);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to check slug availability";
    return errorResponse(message, 500);
  }
}