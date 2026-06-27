import { NextRequest } from "next/server";
import { isErrorResponse, requireApiPermissionFor } from "@/lib/auth";
import { errorResponse, jsonResponse } from "@/lib/http";
import {
  adminMerchantBundlesService,
  adminMerchantBundleActionReasonSchema,
} from "@/modules/admin-merchant-bundles";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireApiPermissionFor("merchant_bundles", "reject");
  if (isErrorResponse(guard)) return guard;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = adminMerchantBundleActionReasonSchema.safeParse(body);
    if (!parsed.success) return errorResponse("Reason is required", 400);

    const data = await adminMerchantBundlesService.rejectBundle(id, parsed.data.reason);
    return jsonResponse({ data });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to reject bundle";
    if (msg === "Bundle not found") return errorResponse(msg, 404);
    if (msg === "Bundle already rejected") return errorResponse(msg, 400);
    if (msg === "Reason is required") return errorResponse(msg, 400);
    return errorResponse(msg, 500);
  }
}
