import { NextRequest } from "next/server";
import { isErrorResponse, requireApiPermissionFor } from "@/lib/auth";
import { errorResponse, jsonResponse } from "@/lib/http";
import { adminMerchantsService } from "@/modules/admin-merchants";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireApiPermissionFor("merchants", "approve");
  if (isErrorResponse(guard)) return guard;

  try {
    const { id } = await params;
    const data = await adminMerchantsService.approveMerchant(id);
    return jsonResponse({ data });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to approve merchant";
    if (msg === "Merchant not found") return errorResponse(msg, 404);
    if (msg === "Merchant already approved") return errorResponse(msg, 400);
    return errorResponse(msg, 500);
  }
}
