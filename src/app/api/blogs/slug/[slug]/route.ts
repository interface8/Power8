import { NextRequest } from "next/server";
import { blogService } from "@/modules/blogs";
import { jsonResponse, errorResponse } from "@/lib/http";

// GET /api/blogs/slug/:slug — get blog by slug (public)
export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const blog = await blogService.getBlogBySlug(slug);
    return jsonResponse({ data: blog });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Blog not found") {
      return errorResponse("Blog not found", 404);
    }
    const message = error instanceof Error ? error.message : "Failed to fetch blog";
    return errorResponse(message, 500);
  }
}
