import { NextRequest } from "next/server";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import {
  blogService,
  updateBlogCategorySchema,
} from "@/modules/blogs";

function getFirstErrorMessage(error: {
  flatten: () => { fieldErrors: Record<string, string[]> };
}) {
  return (
    Object.values(error.flatten().fieldErrors).flat()[0] ?? "Validation failed"
  );
}

// PATCH /api/admin/blog-categories/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;
  if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);

  try {
    const body = await request.json();
    const parsed = updateBlogCategorySchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(getFirstErrorMessage(parsed.error), 400);
    }

    const data = await blogService.updateBlogCategory(params.id, parsed.data);
    return jsonResponse({ data });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update blog category";
    if (message === "Blog category not found") return errorResponse(message, 404);
    if (message.includes("already exists")) return errorResponse(message, 409);
    return errorResponse(message, 500);
  }
}

// DELETE /api/admin/blog-categories/:id
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;
  if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);

  try {
    await blogService.deleteBlogCategory(params.id);
    return jsonResponse({ message: "Blog category deleted" });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete blog category";
    if (message === "Blog category not found") return errorResponse(message, 404);
    return errorResponse(message, 500);
  }
}