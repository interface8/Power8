import { NextRequest } from "next/server";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { categoryService, updateProductCategorySchema } from "@/modules/product-categories";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;
  if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);

  try {
    const { id } = await params;
    const category = await categoryService.getCategoryById(id);
    return jsonResponse({ data: category });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Category not found") {
      return errorResponse("Category not found", 404);
    }
    const msg = e instanceof Error ? e.message : "Failed to fetch category";
    return errorResponse(msg, 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;
  if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateProductCategorySchema.safeParse(body);
    if (!parsed.success) return errorResponse("Validation failed", 400);

    const category = await categoryService.updateCategory(id, parsed.data);
    return jsonResponse({ data: category });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Category not found") {
      return errorResponse("Category not found", 404);
    }
    const msg = e instanceof Error ? e.message : "Failed to update category";
    return errorResponse(msg, 500);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const guard = await requireApiAuth();
    if (isErrorResponse(guard)) return guard;
    if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);

    const { id } = await params;
    console.log("🔍 DELETE called for category:", id);
    
    // ✅ Fixed: Changed from deleteCategoryAdmin to deleteCategory
    const result = await categoryService.deleteCategory(id);
    console.log("✅ DELETE successful:", result);
    
    return jsonResponse({ message: "Category deleted successfully" });
  } catch (e: unknown) {
    console.log("❌ DELETE ERROR:", e);
    
    if (e instanceof Error && e.message === "Category not found") {
      return errorResponse("Category not found", 404);
    }
    if (e instanceof Error && e.message === "Category has products") {
      return errorResponse(
        "Cannot delete category because it has products assigned. Move or delete those products first.",
        409,
      );
    }
    
    const msg = e instanceof Error ? e.message : "Failed to delete category";
    return errorResponse(msg, 500);
  }
}
