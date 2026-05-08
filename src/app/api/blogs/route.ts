import { NextRequest } from "next/server";
import { blogService, blogFiltersSchema, createBlogSchema } from "@/modules/blogs";
import { requireApiPermission, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";

// GET /api/blogs — list with filters (public: only published; admin: all)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const raw = Object.fromEntries(searchParams);
    const filters = blogFiltersSchema.parse(raw);

    // Public visitors only see published blogs
    if (filters.published === undefined) {
      filters.published = true;
    }

    const blogs = await blogService.listBlogs(filters);
    return jsonResponse({ data: blogs });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch blogs";
    return errorResponse(message, 500);
  }
}

// POST /api/blogs — create (admin)
export async function POST(request: NextRequest) {
  const guard = await requireApiPermission("blogs.create");
  if (isErrorResponse(guard)) return guard;

  try {
    const body = await request.json();
    const parsed = createBlogSchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        Object.values(parsed.error.flatten().fieldErrors).flat()[0] ?? "Validation failed";
      return errorResponse(firstError, 400);
    }

    const blog = await blogService.createBlog({
      ...parsed.data,
      authorId: guard.id,
    });
    return jsonResponse(blog, 201);
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("slug already exists")) {
      return errorResponse(error.message, 409);
    }
    const message = error instanceof Error ? error.message : "Failed to create blog";
    return errorResponse(message, 500);
  }
}
