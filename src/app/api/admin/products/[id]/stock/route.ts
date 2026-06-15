import { NextRequest } from "next/server";
import { requireApiPermissionFor, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { productService, updateProductStockSchema } from "@/modules/products";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireApiPermissionFor("products", "update_stock");
  if (isErrorResponse(guard)) return guard;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateProductStockSchema.safeParse(body);
    if (!parsed.success) return errorResponse("Invalid stock payload", 400);

    const product = await productService.updateProductStock(id, parsed.data.stockQuantity);
    return jsonResponse({ data: product });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Product not found") {
      return errorResponse("Product not found", 404);
    }
    const msg = e instanceof Error ? e.message : "Failed to update stock";
    return errorResponse(msg, 500);
  }
}