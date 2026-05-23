import { NextRequest } from "next/server";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { categoryService, createProductCategorySchema } from "@/modules/product-categories";

export async function GET() {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;
  if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);

  try {
    const categories = await categoryService.listCategories();
    return jsonResponse({ data: categories });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to fetch categories";
    return errorResponse(msg, 500);
  }
}

export async function POST(request: NextRequest) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;
  if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);

  try {
    const body = await request.json();
    const parsed = createProductCategorySchema.safeParse(body);
    if (!parsed.success) return errorResponse("Validation failed", 400);

    const category = await categoryService.createCategory(parsed.data);
    return jsonResponse({ data: category }, 201);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Category already exists") {
      return errorResponse("Category already exists", 409);
    }
    const msg = e instanceof Error ? e.message : "Failed to create category";
    return errorResponse(msg, 500);
  }
}