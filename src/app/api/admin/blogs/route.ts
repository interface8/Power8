import { NextRequest } from "next/server";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import {
  adminBlogFiltersSchema,
  blogService,
  createBlogSchema,
} from "@/modules/blogs";

function getFirstErrorMessage(error: {
  flatten: () => { fieldErrors: Record<string, string[]> };
}) {
  return (
    Object.values(error.flatten().fieldErrors).flat()[0] ?? "Validation failed"
  );
}

// GET /api/admin/blogs
export async function GET(request: NextRequest) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;
  if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);

  const { searchParams } = new URL(request.url);
  const parsed = adminBlogFiltersSchema.safeParse(Object.fromEntries(searchParams));

  if (!parsed.success) {
    return errorResponse("Invalid query parameters", 400);
  }

  try {
    const result = await blogService.listAdminBlogs(parsed.data);
    return jsonResponse(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch blogs";
    return errorResponse(message, 500);
  }
}

// POST /api/admin/blogs
export async function POST(request: NextRequest) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;
  if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);

  try {
    const body = await request.json();
    const parsed = createBlogSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(getFirstErrorMessage(parsed.error), 400);
    }

    const data = await blogService.createBlog({
      ...parsed.data,
      authorId: parsed.data.authorId ?? guard.id,
    });

    return jsonResponse({ data }, 201);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create blog";
    if (message.includes("already exists")) return errorResponse(message, 409);
    return errorResponse(message, 500);
  }
}