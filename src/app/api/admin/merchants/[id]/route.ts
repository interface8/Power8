import { NextRequest } from "next/server";
import { isErrorResponse, requireApiPermissionFor } from "@/lib/auth";
import { errorResponse, jsonResponse } from "@/lib/http";
import { adminMerchantsService } from "@/modules/admin-merchants";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireApiPermissionFor("merchants", "view_detail");
  if (isErrorResponse(guard)) return guard;

  try {
    const { id } = await params;
    const data = await adminMerchantsService.getMerchantDetailsById(id);
    return jsonResponse({ data });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to fetch merchant";
    if (msg === "Merchant not found") return errorResponse(msg, 404);
    return errorResponse(msg, 500);
  }
}
