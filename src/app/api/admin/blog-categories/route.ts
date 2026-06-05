import { NextRequest } from "next/server";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import {
  blogService,
  createBlogCategorySchema,
} from "@/modules/blogs";

function getFirstErrorMessage(error: {
  flatten: () => { fieldErrors: Record<string, string[]> };
}) {
  return (
    Object.values(error.flatten().fieldErrors).flat()[0] ?? "Validation failed"
  );
}

// GET /api/admin/blog-categories
export async function GET() {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;
  if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);

  try {
    const data = await blogService.listBlogCategories();
    return jsonResponse({ data });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch blog categories";
    return errorResponse(message, 500);
  }
}

// POST /api/admin/blog-categories
export async function POST(request: NextRequest) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;
  if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);

  try {
    const body = await request.json();
    const parsed = createBlogCategorySchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(getFirstErrorMessage(parsed.error), 400);
    }

    const data = await blogService.createBlogCategory(parsed.data);
    return jsonResponse({ data }, 201);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create blog category";
    if (message.includes("already exists")) return errorResponse(message, 409);
    return errorResponse(message, 500);
  }
}