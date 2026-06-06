import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { blogService } from "@/modules/blogs";

export async function GET() {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;
  if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);

  try {
    const data = await blogService.getBlogStats();
    return jsonResponse(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch blog stats";
    return errorResponse(message, 500);
  }
}