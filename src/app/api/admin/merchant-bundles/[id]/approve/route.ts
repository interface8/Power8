import { NextRequest } from "next/server";
import { isErrorResponse, requireApiPermissionFor } from "@/lib/auth";
import { errorResponse, jsonResponse } from "@/lib/http";
import { adminMerchantBundlesService } from "@/modules/admin-merchant-bundles";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireApiPermissionFor("merchant_bundles", "approve");
  if (isErrorResponse(guard)) return guard;

  try {
    const { id } = await params;
    const data = await adminMerchantBundlesService.approveBundle(id);
    return jsonResponse({ data });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to approve bundle";
    if (msg === "Bundle not found") return errorResponse(msg, 404);
    if (msg === "Bundle already approved") return errorResponse(msg, 400);
    return errorResponse(msg, 500);
  }
}
