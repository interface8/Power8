import { NextRequest } from "next/server";
import { requireApiMerchant } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { merchantProductService, updateStockSchema } from "@/modules/merchant-products";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireApiMerchant();
  if (auth instanceof Response) return auth;
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateStockSchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message ?? "Validation failed";
      return errorResponse(first, 400);
    }
    const product = await merchantProductService.updateStock(auth.merchant.id, id, parsed.data.stockQuantity);
    return jsonResponse({ data: product, message: "Stock updated." });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update stock";
    if (msg === "Product not found") return errorResponse(msg, 404);
    if (msg === "Forbidden") return errorResponse("You do not own this product", 403);
    return errorResponse(msg, 500);
  }
}
