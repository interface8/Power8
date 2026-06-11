import { NextRequest } from "next/server";
import { categoryService, createProductCategorySchema } from "@/modules/product-categories";
import { requireApiPermissionFor, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";

// GET /api/product-categories - list all (sorted by sort field)
// Use ?activeOnly=true to get only active categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("activeOnly") === "true";

    const categories = await categoryService.listCategories(activeOnly);
    return jsonResponse({ data: categories });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch categories";
    return errorResponse(message, 500);
  }
}

// POST /api/product-categories — create (admin)
export async function POST(request: NextRequest) {
  const guard = await requireApiPermissionFor("product-categories", "create");
  if (isErrorResponse(guard)) return guard;

  try {
    const body = await request.json();
    const parsed = createProductCategorySchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        Object.values(parsed.error.flatten().fieldErrors).flat()[0] ?? "Validation failed";
      return Response.json({ message: firstError }, { status: 400 });
    }

    const category = await categoryService.createCategory(parsed.data);
    return jsonResponse(category, 201);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Category already exists") {
      return errorResponse("Category already exists", 409);
    }
    const message = error instanceof Error ? error.message : "Failed to create category";
    return errorResponse(message, 500);
  }
}