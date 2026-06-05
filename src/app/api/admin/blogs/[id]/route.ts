import { NextRequest } from "next/server";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { blogService, updateBlogSchema } from "@/modules/blogs";

function getFirstErrorMessage(error: {
  flatten: () => { fieldErrors: Record<string, string[]> };
}) {
  return (
    Object.values(error.flatten().fieldErrors).flat()[0] ?? "Validation failed"
  );
}

// GET /api/admin/blogs/:id
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;
  if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);

  try {
    const data = await blogService.getBlogById(params.id);
    return jsonResponse({ data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch blog";
    if (message === "Blog not found") return errorResponse(message, 404);
    return errorResponse(message, 500);
  }
}

// PATCH /api/admin/blogs/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;
  if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);

  try {
    const body = await request.json();
    const parsed = updateBlogSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(getFirstErrorMessage(parsed.error), 400);
    }

    const data = await blogService.updateBlog(params.id, parsed.data);
    return jsonResponse({ data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update blog";
    if (message === "Blog not found") return errorResponse(message, 404);
    if (message.includes("already exists")) return errorResponse(message, 409);
    return errorResponse(message, 500);
  }
}

// DELETE /api/admin/blogs/:id
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;
  if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);

  try {
    await blogService.deleteBlog(params.id);
    return jsonResponse({ message: "Blog deleted" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete blog";
    if (message === "Blog not found") return errorResponse(message, 404);
    return errorResponse(message, 500);
  }
}