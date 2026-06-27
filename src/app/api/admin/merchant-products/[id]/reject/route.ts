import { NextRequest } from "next/server";
import { requireApiPermissionFor, isErrorResponse } from "@/lib/auth";
import { errorResponse, jsonResponse } from "@/lib/http";
import { merchantProductService } from "@/modules/merchant-products";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireApiPermissionFor("merchant_products", "reject");
  if (isErrorResponse(guard)) return guard;

  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const reason = typeof body?.reason === "string" ? body.reason.trim() : "";
    if (!reason) return errorResponse("Reason is required", 400);

    const data = await merchantProductService.rejectProduct(id, reason);
    return jsonResponse({ data });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to reject merchant product";
    if (message === "Product not found") return errorResponse(message, 404);
    if (message === "Product already rejected") return errorResponse(message, 400);
    if (message === "Reason is required") return errorResponse(message, 400);
    return errorResponse(message, 500);
  }
}
