import { NextRequest } from "next/server";
import { blogService, updateBlogSchema } from "@/modules/blogs";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/blogs/:id — get single blog (public)
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const blog = await blogService.getBlogById(id);
    return jsonResponse({ data: blog });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Blog not found") {
      return errorResponse("Blog not found", 404);
    }
    const message = error instanceof Error ? error.message : "Failed to fetch blog";
    return errorResponse(message, 500);
  }
}

// PUT /api/blogs/:id — update (auth required)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateBlogSchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        Object.values(parsed.error.flatten().fieldErrors).flat()[0] ?? "Validation failed";
      return errorResponse(firstError, 400);
    }

    const blog = await blogService.updateBlog(id, parsed.data);
    return jsonResponse({ data: blog });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Blog not found") {
      return errorResponse("Blog not found", 404);
    }
    if (error instanceof Error && error.message.includes("slug already exists")) {
      return errorResponse(error.message, 409);
    }
    const message = error instanceof Error ? error.message : "Failed to update blog";
    return errorResponse(message, 500);
  }
}

// DELETE /api/blogs/:id — delete (auth required)
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;

  try {
    const { id } = await params;
    await blogService.deleteBlog(id);
    return jsonResponse({ message: "Blog deleted" });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Blog not found") {
      return errorResponse("Blog not found", 404);
    }
    const message = error instanceof Error ? error.message : "Failed to delete blog";
    return errorResponse(message, 500);
  }
}
