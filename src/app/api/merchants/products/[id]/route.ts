import { NextRequest } from "next/server";
import { requireApiMerchant } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { merchantProductService, updateMerchantProductSchema } from "@/modules/merchant-products";

function mapErr(e: unknown, fallback: string) {
  const msg = e instanceof Error ? e.message : fallback;
  if (msg === "Product not found") return errorResponse(msg, 404);
  if (msg === "Forbidden") return errorResponse("You do not own this product", 403);
  if (msg === "Category not found") return errorResponse(msg, 400);
  return errorResponse(msg, 500);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireApiMerchant();
  if (auth instanceof Response) return auth;
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateMerchantProductSchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message ?? "Validation failed";
      return errorResponse(first, 400);
    }
    const result = await merchantProductService.updateProduct(auth.merchant.id, id, parsed.data);
    return jsonResponse({
      data: result.product,
      requiresReapproval: result.requiresReapproval,
      message: "Product updated — it's now pending admin re-approval.",
    });
  } catch (e) {
    return mapErr(e, "Failed to update product");
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireApiMerchant();
  if (auth instanceof Response) return auth;
  try {
    const { id } = await params;
    const product = await merchantProductService.deleteProduct(auth.merchant.id, id);
    return jsonResponse({ data: product, message: "Product deactivated." });
  } catch (e) {
    return mapErr(e, "Failed to delete product");
  }
}
