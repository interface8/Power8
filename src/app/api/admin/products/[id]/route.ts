import { NextRequest } from "next/server";
import { requireApiPermissionFor, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { productService, updateProductSchema } from "@/modules/products";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireApiPermissionFor("products", "delete");
  if (isErrorResponse(guard)) return guard;

  try {
    const { id } = await params;
    const result = await productService.deleteProductAdmin(id);
    return jsonResponse({ message: "Product deleted successfully", data: result });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Product not found") {
      return errorResponse("Product not found", 404);
    }
    const msg = e instanceof Error ? e.message : "Failed to delete product";
    return errorResponse(msg, 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireApiPermissionFor("products", "edit");
  if (isErrorResponse(guard)) return guard;

  try {
    const { id } = await params;

    const body = await request.json();
    const parsed = updateProductSchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        Object.values(parsed.error.flatten().fieldErrors).flat()[0] ??
        "Validation failed";
      return errorResponse(firstError, 400);
    }

    const product = await productService.updateProduct(id, parsed.data);
    return jsonResponse({ data: product });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Product not found") {
      return errorResponse("Product not found", 404);
    }
    const msg = e instanceof Error ? e.message : "Failed to update product";
    return errorResponse(msg, 500);
  }
}