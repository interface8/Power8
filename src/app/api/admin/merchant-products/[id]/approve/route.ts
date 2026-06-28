import { NextRequest } from "next/server";
import { requireApiPermissionFor, isErrorResponse } from "@/lib/auth";
import { errorResponse, jsonResponse } from "@/lib/http";
import { merchantProductService } from "@/modules/merchant-products";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireApiPermissionFor("merchant_products", "approve");
  if (isErrorResponse(guard)) return guard;

  try {
    const { id } = await params;
    const data = await merchantProductService.approveProduct(id);
    return jsonResponse({ data });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to approve merchant product";
    if (message === "Product not found") return errorResponse(message, 404);
    if (message === "Product already approved") return errorResponse(message, 400);
    return errorResponse(message, 500);
  }
}
