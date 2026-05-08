import { NextRequest } from "next/server";
import { blogService, createBlogCategorySchema } from "@/modules/blogs";
import { requireApiPermission, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";

// GET /api/blog-categories — list all
export async function GET() {
  try {
    const categories = await blogService.listBlogCategories();
    return jsonResponse({ data: categories });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch blog categories";
    return errorResponse(message, 500);
  }
}

// POST /api/blog-categories — create (admin)
export async function POST(request: NextRequest) {
  const guard = await requireApiPermission("blog-categories.create");
  if (isErrorResponse(guard)) return guard;

  try {
    const body = await request.json();
    const parsed = createBlogCategorySchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        Object.values(parsed.error.flatten().fieldErrors).flat()[0] ?? "Validation failed";
      return errorResponse(firstError, 400);
    }

    const category = await blogService.createBlogCategory(parsed.data);
    return jsonResponse(category, 201);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create blog category";
    return errorResponse(message, 500);
  }
}
