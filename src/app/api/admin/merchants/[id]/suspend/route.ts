import { NextRequest } from "next/server";
import { isErrorResponse, requireApiPermissionFor } from "@/lib/auth";
import { errorResponse, jsonResponse } from "@/lib/http";
import {
  adminMerchantsService,
  adminMerchantActionReasonSchema,
} from "@/modules/admin-merchants";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireApiPermissionFor("merchants", "suspend");
  if (isErrorResponse(guard)) return guard;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = adminMerchantActionReasonSchema.safeParse(body);
    if (!parsed.success) return errorResponse("Reason is required", 400);

    const data = await adminMerchantsService.suspendMerchant(id, parsed.data.reason);
    return jsonResponse({ data });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to suspend merchant";
    if (msg === "Merchant not found") return errorResponse(msg, 404);
    if (msg === "Merchant already suspended") return errorResponse(msg, 400);
    if (msg === "Reason is required") return errorResponse(msg, 400);
    return errorResponse(msg, 500);
  }
}
